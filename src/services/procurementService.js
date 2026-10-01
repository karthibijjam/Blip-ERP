import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Normalized Dairy Procurement Service
 * Payload size: ~200 bytes per entry (instead of 50MB)
 */

export const fetchProcurementFromDB = async (companyId = 'bijjam-group', limit = 50) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, data: [] };

  try {
    const { data, error } = await supabase
      .from('dairy_procurement')
      .select('*')
      .eq('company_id', companyId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err) {
    console.warn('fetchProcurementFromDB error:', err.message);
    return { success: false, error: err.message, data: [] };
  }
};

export const insertProcurementToDB = async (entry) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: 'Supabase offline' };

  try {
    const row = {
      id: entry.id ? String(entry.id) : `proc-${Date.now()}`,
      company_id: entry.companyId || entry.company_id || 'bijjam-group',
      farmer_name: entry.farmer || entry.farmer_name,
      farmer_id: entry.farmerId || entry.farmer_id || null,
      date: entry.date || new Date().toISOString().split('T')[0],
      shift: entry.shift || 'Morning',
      qty: Number(entry.qty) || 0,
      fat: Number(entry.fat) || 0,
      snf: Number(entry.snf) || 0,
      rate: Number(entry.rate) || 0,
      total: Number(entry.total) || 0
    };

    const { data, error } = await supabase
      .from('dairy_procurement')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('insertProcurementToDB error:', err.message);
    return { success: false, message: err.message };
  }
};
