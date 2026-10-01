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

// Push local ERP state to Supabase with automatic conflict-free lossless merge
export const pushLocalERPState = async (dbData) => {
  if (!supabase) return { success: false, message: 'Backend Supabase not configured.' };

  try {
    let finalData = dbData;

    // Lossless safety check: fetch current cloud state to prevent accidental drops
    const { data: currentRecord } = await supabase
      .from('erp_state')
      .select('data')
      .eq('id', 'bijjam_group_default')
      .maybeSingle();

    if (currentRecord?.data) {
      const remote = currentRecord.data;
      const deletedIds = new Set(
        [...(dbData?.deletedCompanyIds || []), ...(remote?.deletedCompanyIds || [])].map(String)
      );

      // Protect companies: never drop an active company
      const companyMap = new Map();
      (remote.companies || []).forEach(comp => {
        if (!comp) return;
        const key = String(comp.id || comp.companyId || comp.code);
        if (!deletedIds.has(key)) companyMap.set(key, comp);
      });

      (dbData?.companies || []).forEach(comp => {
        if (!comp) return;
        const key = String(comp.id || comp.companyId || comp.code);
        if (deletedIds.has(key)) return;

        if (!companyMap.has(key)) {
          companyMap.set(key, comp);
        } else {
          const existing = companyMap.get(key);
          const requiresPasswordChange = (existing.requiresPasswordChange === false || comp.requiresPasswordChange === false)
            ? false
            : (comp.requiresPasswordChange ?? existing.requiresPasswordChange ?? true);
          const isFirstTimeLogin = (existing.isFirstTimeLogin === false || comp.isFirstTimeLogin === false)
            ? false
            : (comp.isFirstTimeLogin ?? existing.isFirstTimeLogin ?? true);
          const password = (comp.password && comp.password !== 'admin123')
            ? comp.password
            : (existing.password || comp.password || 'admin123');

          companyMap.set(key, {
            ...existing,
            ...comp,
            password,
            requiresPasswordChange,
            isFirstTimeLogin,
            passwordUpdatedAt: comp.passwordUpdatedAt || existing.passwordUpdatedAt,
            subscribedModules: comp.subscribedModules?.length ? comp.subscribedModules : existing.subscribedModules
          });
        }
      });

      // Helper to merge lists by unique identifier
      const mergeLists = (localList = [], remoteList = [], key = 'id') => {
        const m = new Map();
        (remoteList || []).forEach(item => { if (item && item[key]) m.set(String(item[key]), item); });
        (localList || []).forEach(item => {
          if (item && item[key]) {
            const k = String(item[key]);
            if (!m.has(k)) m.set(k, item);
            else m.set(k, { ...m.get(k), ...item });
          }
        });
        return Array.from(m.values());
      };

      const mergeDicts = (localDict = {}, remoteDict = {}, key = 'id') => {
        const res = { ...(localDict || {}), ...(remoteDict || {}) };
        const allKeys = new Set([...Object.keys(localDict || {}), ...Object.keys(remoteDict || {})]);
        allKeys.forEach(k => {
          res[k] = mergeLists(localDict?.[k] || [], remoteDict?.[k] || [], key);
        });
        return res;
      };

      finalData = {
        ...remote,
        ...dbData,
        companies: Array.from(companyMap.values()),
        deletedCompanyIds: Array.from(deletedIds),
        customersByBrand: mergeDicts(dbData?.customersByBrand, remote?.customersByBrand, 'phone'),
        sellingItemsByBrand: mergeDicts(dbData?.sellingItemsByBrand, remote?.sellingItemsByBrand, 'skuCode'),
        dairyFarmers: mergeLists(dbData?.dairyFarmers, remote?.dairyFarmers, 'id'),
        deliveryRoutes: mergeLists(dbData?.deliveryRoutes, remote?.deliveryRoutes, 'id'),
        dairyCustomers: mergeLists(dbData?.dairyCustomers, remote?.dairyCustomers, 'phone'),
        dairyProcurement: mergeLists(dbData?.dairyProcurement, remote?.dairyProcurement, 'id'),
        farmsPurchases: mergeLists(dbData?.farmsPurchases, remote?.farmsPurchases, 'id'),
        farmsSales: mergeLists(dbData?.farmsSales, remote?.farmsSales, 'id'),
        plantrixPurchases: mergeLists(dbData?.plantrixPurchases, remote?.plantrixPurchases, 'id'),
        plantrixSales: mergeLists(dbData?.plantrixSales, remote?.plantrixSales, 'id'),
        mixedExpenses: mergeLists(dbData?.mixedExpenses, remote?.mixedExpenses, 'id')
      };
    }

    const { error } = await supabase
      .from('erp_state')
      .upsert({
        id: 'bijjam_group_default',
        company_name: finalData?.company?.name || 'Bijjam Enterprises Group',
        data: finalData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, mergedData: finalData };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
