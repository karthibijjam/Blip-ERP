import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Normalized Selling Items & SKUs Service
 * Manages product catalog and inventory per company outlet
 * Payload size: ~250 bytes per SKU
 */

export const fetchItemsFromDB = async (companyId = 'bijjam-group', brandId = null) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, data: [] };

  try {
    let query = supabase.from('selling_items').select('*').eq('company_id', companyId);
    if (brandId) {
      query = query.eq('brand_id', brandId);
    }
    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err) {
    console.warn('fetchItemsFromDB error:', err.message);
    return { success: false, error: err.message, data: [] };
  }
};

export const insertItemToDB = async (item) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: 'Supabase offline' };

  try {
    const row = {
      id: item.id ? String(item.id) : `item-${Date.now()}`,
      company_id: item.companyId || item.company_id || 'bijjam-group',
      brand_id: item.brandId || item.brand_id || 'dairy',
      sku_code: item.skuCode || item.sku_code || null,
      name: item.name,
      category: item.category || 'General',
      mrp: item.mrp ? Number(item.mrp) : null,
      price: Number(item.price) || 0,
      stock: Number(item.stock) || 0,
      status: item.status || 'In Stock'
    };

    const { data, error } = await supabase
      .from('selling_items')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('insertItemToDB error:', err.message);
    return { success: false, message: err.message };
  }
};
