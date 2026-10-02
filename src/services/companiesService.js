import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Normalized Companies API Service
 * Handles granular row-level CRUD operations for tenant outlets
 * Payload size: ~1KB instead of 50MB monolithic JSON
 */

export const fetchCompaniesFromDB = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, data: [] };

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('serial_number', { ascending: true });

    if (error) throw error;
    
    // Format rows to match app state structure
    const formatted = (data || []).map(row => ({
      id: row.id,
      companyId: row.serial_number,
      code: row.serial_number,
      name: row.name,
      gst: row.gst,
      owner: row.owner,
      email: row.email,
      password: row.password,
      requiresPasswordChange: row.requires_password_change,
      isFirstTimeLogin: row.is_first_time_login,
      username: row.username || (row.email ? row.email.split('@')[0] : row.id),
      phone: row.phone,
      address: row.address,
      plan: row.plan,
      status: row.status,
      renewalDate: row.renewal_date,
      monthlyFee: Number(row.monthly_fee),
      subscribedModules: row.subscribed_modules || ['dairy', 'fmcg'],
      avatar: row.avatar,
      createdDate: row.created_at?.split('T')[0]
    }));

    return { success: true, data: formatted };
  } catch (err) {
    console.warn('Relational fetchCompaniesFromDB error:', err.message);
    return { success: false, error: err.message, data: [] };
  }
};

export const insertCompanyToDB = async (company) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: 'Supabase offline' };

  try {
    const row = {
      id: company.id,
      serial_number: company.companyId || company.code || 101,
      name: company.name,
      gst: company.gst,
      owner: company.owner,
      email: company.email,
      password: company.password || 'Admin@123',
      requires_password_change: company.requiresPasswordChange !== false,
      is_first_time_login: company.isFirstTimeLogin !== false,
      phone: company.phone,
      address: company.address,
      plan: company.plan || 'Professional',
      status: company.status || 'Active',
      renewal_date: company.renewalDate || '2027-09-30',
      monthly_fee: Number(company.monthlyFee) || 8500,
      subscribed_modules: company.subscribedModules || ['dairy', 'fmcg'],
      avatar: company.avatar
    };

    const { data, error } = await supabase
      .from('companies')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('insertCompanyToDB error:', err.message);
    return { success: false, message: err.message };
  }
};

export const updateCompanyInDB = async (companyId, updates) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: 'Supabase offline' };

  try {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.owner !== undefined) dbUpdates.owner = updates.owner;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.password !== undefined) dbUpdates.password = updates.password;
    if (updates.requiresPasswordChange !== undefined) dbUpdates.requires_password_change = updates.requiresPasswordChange;
    if (updates.isFirstTimeLogin !== undefined) dbUpdates.is_first_time_login = updates.isFirstTimeLogin;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.plan !== undefined) dbUpdates.plan = updates.plan;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.monthlyFee !== undefined) dbUpdates.monthly_fee = Number(updates.monthlyFee);
    if (updates.subscribedModules !== undefined) dbUpdates.subscribed_modules = updates.subscribedModules;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;

    const { data, error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', companyId)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('updateCompanyInDB error:', err.message);
    return { success: false, message: err.message };
  }
};

export const deleteCompanyFromDB = async (companyId) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, message: 'Supabase offline' };

  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn('deleteCompanyFromDB error:', err.message);
    return { success: false, message: err.message };
  }
};
