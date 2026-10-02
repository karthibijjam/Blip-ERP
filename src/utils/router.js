// src/utils/router.js
// Dynamic URL Routing Engine for Blip ERP Multi-Brand System

export const TAB_TO_PATH = {
  'dashboard': '/dashboard',
  'company-dashboard': '/company-dashboard',
  'super-admin-portal': '/platform-dashboard',
  'core-modules': '/modules-management',
  'modules-management': '/modules-management',
  'platform-modules': '/modules-management',
  'tenant-companies-management': '/tenant-companies-management',
  'outlet-companies-management': '/tenant-companies-management',
  'account': '/account',
  'dairy': '/dairy',
  'farms': '/farms',
  'plantrix': '/plantrix',
  'mixed': '/mixed',
  'brand-manage': '/brand-manage',
  'brand-modules-manage': '/brand-modules',
  'brand-customers': '/customers',
  'brand-items': '/brand-items',
  'customer-profile': '/customer-profile',
  'customer-pending-payments': '/customer-pending-payments',
  'customer-purchase-history': '/customer-purchase-history',
  'customer-brand-detail': '/customer-brand-detail',
  'financial-subpage': '/financials'
};

export const PATH_TO_TAB = {
  'dashboard': 'dashboard',
  'company-dashboard': 'company-dashboard',
  'platform-dashboard': 'super-admin-portal',
  'platform': 'super-admin-portal',
  'super-admin': 'super-admin-portal',
  'super-admin-portal': 'super-admin-portal',
  'admin': 'super-admin-portal',
  'console': 'super-admin-portal',
  'modules-management': 'core-modules',
  'modules': 'core-modules',
  'core-modules': 'core-modules',
  'platform-modules': 'core-modules',
  'tenant-companies-management': 'tenant-companies-management',
  'tenant-companies': 'tenant-companies-management',
  'tenants': 'tenant-companies-management',
  'outlet-companies-management': 'tenant-companies-management',
  'outlet-companies': 'tenant-companies-management',
  'companies': 'tenant-companies-management',
  'account': 'account',
  'settings': 'account',
  'profile': 'account',
  'dairy': 'dairy',
  'farms': 'farms',
  'plantrix': 'plantrix',
  'mixed': 'mixed',
  'brand-manage': 'brand-manage',
  'brand-modules': 'brand-modules-manage',
  'brand-modules-manage': 'brand-modules-manage',
  'customers': 'brand-customers',
  'brand-customers': 'brand-customers',
  'brand-items': 'brand-items',
  'items': 'brand-items',
  'customer-profile': 'customer-profile',
  'customer-pending-payments': 'customer-pending-payments',
  'customer-purchase-history': 'customer-purchase-history',
  'customer-brand-detail': 'customer-brand-detail',
  'financials': 'financial-subpage',
  'financial-subpage': 'financial-subpage'
};

/**
 * Builds the URL string from the tab name and optional context state.
 */
export function getUrlFromTab(tab, context = {}) {
  const {
    currentManageBrandId,
    activeFinancialBrandId,
    activeFinancialType,
    activeCustomerObj,
    activeBrandDetail
  } = context;

  const basePath = TAB_TO_PATH[tab] || (tab ? `/${tab}` : '/dashboard');
  const params = new URLSearchParams();

  if (tab === 'financial-subpage') {
    const brand = activeFinancialBrandId || currentManageBrandId || 'dairy';
    const type = activeFinancialType || 'sales';
    if (brand) params.set('brand', brand);
    if (type) params.set('type', type);
  } else if (['brand-manage', 'brand-modules-manage', 'brand-customers', 'brand-items'].includes(tab)) {
    if (currentManageBrandId) {
      params.set('brand', currentManageBrandId);
    }
  } else if (['customer-profile', 'customer-pending-payments', 'customer-purchase-history'].includes(tab)) {
    const custId = activeCustomerObj?.id || activeCustomerObj?.name;
    if (custId) {
      params.set('id', custId);
    }
  } else if (tab === 'customer-brand-detail') {
    if (activeBrandDetail) {
      params.set('brand', activeBrandDetail);
    }
    const custId = activeCustomerObj?.id || activeCustomerObj?.name;
    if (custId) {
      params.set('id', custId);
    }
  }

  const queryStr = params.toString();
  return queryStr ? `${basePath}?${queryStr}` : basePath;
}

/**
 * Parses the current browser location (pathname, hash, search) into tab & parameters.
 */
export function parseRouteFromBrowser(allBrands = []) {
  if (typeof window === 'undefined') {
    return { tab: 'dashboard', params: {}, isRoot: true };
  }

  let rawPath = window.location.pathname || '';
  let rawSearch = window.location.search || '';

  // Support hash routing fallback (e.g., /#/dairy?brand=dairy)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    const hashContent = window.location.hash.slice(2);
    const [hPath, hSearch] = hashContent.split('?');
    rawPath = '/' + (hPath || '');
    if (hSearch) rawSearch = '?' + hSearch;
  }

  // Normalize: remove leading/trailing slashes and convert to lowercase
  const cleanPath = rawPath.replace(/^\/+|\/+$/g, '').toLowerCase();
  const searchParams = new URLSearchParams(rawSearch);
  const params = {};
  searchParams.forEach((val, key) => {
    params[key] = val;
  });

  if (!cleanPath || cleanPath === 'login' || cleanPath === 'index.html') {
    return { tab: null, params, isRoot: true };
  }

  // 1. Direct path dictionary match
  if (PATH_TO_TAB[cleanPath]) {
    return { tab: PATH_TO_TAB[cleanPath], params, isRoot: false };
  }

  // 2. /brand/:brandId path pattern
  if (cleanPath.startsWith('brand/')) {
    const brandId = cleanPath.split('/')[1];
    return { tab: brandId || 'brand-manage', params: { ...params, brand: brandId }, isRoot: false };
  }

  // 3. Dynamic brand in database
  const matchingBrand = (allBrands || []).find(b => b.id?.toLowerCase() === cleanPath);
  if (matchingBrand) {
    return { tab: matchingBrand.id, params, isRoot: false };
  }

  // Fallback to the raw cleanPath
  return { tab: cleanPath, params, isRoot: false };
}

/**
 * Synchronizes the browser address bar with the target URL without a page reload.
 */
export function syncBrowserUrl(targetUrl, replace = false) {
  if (typeof window === 'undefined' || !targetUrl) return;

  const isFileProtocol = window.location.protocol === 'file:';

  if (isFileProtocol) {
    const targetHash = '#' + targetUrl;
    if (window.location.hash !== targetHash) {
      if (replace) {
        window.location.replace(targetHash);
      } else {
        window.location.hash = targetHash;
      }
    }
    return;
  }

  const currentUrl = (window.location.pathname || '') + (window.location.search || '');
  if (currentUrl === targetUrl) return;

  try {
    if (replace) {
      window.history.replaceState({ url: targetUrl }, '', targetUrl);
    } else {
      window.history.pushState({ url: targetUrl }, '', targetUrl);
    }
  } catch (err) {
    console.warn('Browser URL sync warning:', err);
  }
}
