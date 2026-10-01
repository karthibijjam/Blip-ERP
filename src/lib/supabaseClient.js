import { createClient } from '@supabase/supabase-js';

// Configuration is managed exclusively via the backend environment (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('your-project')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

export const getSupabaseClient = () => supabase;

// Backend connectivity test
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return { success: false, message: 'Supabase backend environment variables not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('erp_state')
      .select('id, updated_at')
      .limit(1);

    if (error) {
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      hasRecord: Array.isArray(data) && data.length > 0 
    };
  } catch (err) {
    return { success: false, message: err.message || 'Network error' };
  }
};

// Fetch remote ERP state from Supabase
export const fetchRemoteERPState = async () => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('erp_state')
      .select('*')
      .eq('id', 'bijjam_group_default')
      .maybeSingle();

    if (error) {
      console.warn('Backend Supabase sync error:', error);
      return null;
    }

    return data ? data.data : null;
  } catch (err) {
    console.warn('Backend Supabase network error:', err);
    return null;
  }
};

// Push local ERP state to Supabase in the background
export const pushLocalERPState = async (dbData) => {
  if (!supabase) return { success: false, message: 'Backend Supabase not configured.' };

  try {
    const { error } = await supabase
      .from('erp_state')
      .upsert({
        id: 'bijjam_group_default',
        company_name: dbData?.company?.name || 'Bijjam Enterprises Group',
        data: dbData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
