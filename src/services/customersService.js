import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Normalized Customers Directory Service
 * Manages customer accounts with phone numbers per company outlet
 * Payload size: ~300 bytes per customer
 */

export const fetchCustomersFromDB = async (companyId = 'bijjam-group', brandId = null) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, data: [] };

  try {
    let query = supabase.from('customers').select('*').eq('company_id', companyId);
    if (brandId) {
      query = query.eq('brand_id', brandId);
    }
    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err) {
    console.warn('fetchCustomersFromDB error:', err.message);
    return { success: false, error: err.message, data: [] };
  }
};

export const insertCustomerToDB = async (cust) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: 'Supabase offline' };

  try {
    const row = {
      id: cust.id ? String(cust.id) : `cust-${Date.now()}`,
      company_id: cust.companyId || cust.company_id || 'bijjam-group',
      brand_id: cust.brandId || cust.brand_id || 'dairy',
      name: cust.name,
      phone: cust.phone,
      area: cust.area || '',
      route: cust.route || '',
      sku: cust.sku || '',
      bill: Number(cust.bill) || 0,
      pending: Number(cust.pending) || 0,
      reg_date: cust.regDate || cust.reg_date || new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('customers')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('insertCustomerToDB error:', err.message);
    return { success: false, message: err.message };
  }
};
