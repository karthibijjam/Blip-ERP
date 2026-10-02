import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ERPContext } from './erpContextDef';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchRemoteERPState,
  pushLocalERPState,
  getSupabaseClient
} from '../lib/supabaseClient';
import {
  fetchCompaniesFromDB,
  insertCompanyToDB,
  updateCompanyInDB,
  deleteCompanyFromDB
} from '../services/companiesService';
import { insertCustomerToDB } from '../services/customersService';
import { insertItemToDB } from '../services/itemsService';
import { insertProcurementToDB } from '../services/procurementService';
import {
  DEFAULT_INITIAL_PASSWORD,
  validatePasswordPolicy
} from '../utils/passwordPolicy';
import {
  getUrlFromTab,
  parseRouteFromBrowser,
  syncBrowserUrl
} from '../utils/router';

const initialDB = {
  company: {
    name: 'Bijjam Enterprises Group',
    gst: '36AABCB1234F1Z5',
    phone: '+91 9848012345',
    address: 'Plot No. 42, Dairy Farm Road, Jubilee Hills, Hyderabad'
  },
  companies: [
    {
      id: 'bijjam-group',
      companyId: 101,
      code: 101,
      name: 'Bijjam Enterprises Group',
      gst: '36AABCB1234F1Z5',
      owner: 'Bijjam Enterprises Admin',
      username: 'bijjam',
      email: 'admin@bijjam.com',
      password: 'admin@bijjam.com',
      phone: '+91 9848012345',
      address: 'Plot No. 42, Dairy Farm Road, Jubilee Hills, Hyderabad',
      plan: 'Enterprise',
      status: 'Active',
      renewalDate: '2027-09-30',
      monthlyFee: 15000,
      subscribedModules: ['dairy', 'fmcg', 'mixed'],
      createdDate: '2026-01-15'
    },
    {
      id: 'sri-krishna-dairy',
      companyId: 102,
      code: 102,
      name: 'Sri Krishna Dairy Farms Pvt Ltd',
      gst: '36AAACK9876E1Z2',
      owner: 'Krishna Murthy',
      username: 'krishna102',
      email: 'krishna@skdairy.com',
      password: DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: true,
      isFirstTimeLogin: true,
      phone: '+91 9848099887',
      address: 'NH 44, Medchal Highway, Hyderabad',
      plan: 'Professional',
      status: 'Active',
      renewalDate: '2026-12-15',
      monthlyFee: 6500,
      subscribedModules: ['dairy'],
      createdDate: '2026-03-10'
    },
    {
      id: 'green-agro-fmcg',
      companyId: 103,
      code: 103,
      name: 'Green Agro Naturals & FMCG',
      gst: '36AABCG5544K1Z8',
      owner: 'Haritha Reddy',
      username: 'greenagro103',
      email: 'haritha@greenagro.com',
      password: DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: true,
      isFirstTimeLogin: true,
      phone: '+91 9848077665',
      address: 'Industrial Area, Cherlapally, Hyderabad',
      plan: 'Starter',
      status: 'Active',
      renewalDate: '2026-11-01',
      monthlyFee: 4500,
      subscribedModules: ['fmcg'],
      createdDate: '2026-05-20'
    },
    {
      id: 'murali-co-104',
      companyId: 104,
      code: 104,
      name: 'Murali & Co.',
      gst: '36AABCM9988D1Z4',
      owner: 'Murali',
      username: 'murali104',
      email: 'murali@muralico.com',
      password: DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: true,
      isFirstTimeLogin: true,
      phone: '+91 9848055112',
      address: 'Commercial Complex, Hyderabad',
      plan: 'Professional',
      status: 'Active',
      renewalDate: '2027-09-30',
      monthlyFee: 8500,
      subscribedModules: ['dairy', 'fmcg'],
      createdDate: '2026-10-01'
    }
  ],
  admin: {
    name: 'Bijjam Enterprises Admin',
    email: 'admin@bijjamenterprises.com',
    phone: '+91 9848012345',
    password: 'admin123'
  },
  users: [
    { id: 1, name: 'Rajesh Sharma', username: 'rajesh', email: 'rajesh@bijjam.com', password: 'user123', role: 'Manager', brand: 'All Brands', companyId: 'bijjam-group', status: 'Active' },
    { id: 2, name: 'Suresh Kumar', username: 'suresh', email: 'suresh@bijjam.com', password: 'user123', role: 'Accountant', brand: 'Bijjam Dairy', companyId: 'bijjam-group', status: 'Active' },
    { id: 3, name: 'Venkatesh Rao', username: 'venkat', email: 'venkat@skdairy.com', password: DEFAULT_INITIAL_PASSWORD, requiresPasswordChange: true, isFirstTimeLogin: true, role: 'Plant Supervisor', brand: 'Bijjam Dairy', companyId: 'sri-krishna-dairy', status: 'Active' },
    { id: 4, name: 'Pooja Nair', username: 'pooja', email: 'pooja@greenagro.com', password: DEFAULT_INITIAL_PASSWORD, requiresPasswordChange: true, isFirstTimeLogin: true, role: 'Sales Lead', brand: 'Bijjam Farms', companyId: 'green-agro-fmcg', status: 'Active' }
  ],
  platformTeam: [
    { id: 'pt-1', name: 'Karthik Reddy', email: 'karthik@bliperp.com', role: 'Platform Director & Founder', phone: '+91 9848012345', status: 'Active', joinedDate: '2026-01-01', lastLogin: 'Today, 05:00 PM' },
    { id: 'pt-2', name: 'Blip Admin', email: 'admin@bliperp.com', role: 'Lead Platform Administrator', phone: '+91 9000011223', status: 'Active', joinedDate: '2026-01-15', lastLogin: 'Today, 04:45 PM' },
    { id: 'pt-3', name: 'Priya Sharma', email: 'priya@bliperp.com', role: 'Platform Operations Manager', phone: '+91 9848055443', status: 'Active', joinedDate: '2026-02-10', lastLogin: 'Yesterday' },
    { id: 'pt-4', name: 'Rahul Verma', email: 'rahul@bliperp.com', role: 'Cloud Infrastructure & DevOps Lead', phone: '+91 9848077665', status: 'Active', joinedDate: '2026-03-01', lastLogin: '3 days ago' },
    { id: 'pt-5', name: 'Master Admin', email: 'superadmin@bliperp.com', role: 'Super Platform Administrator', phone: '+91 9000099887', status: 'Active', joinedDate: '2026-01-01', lastLogin: 'Today' }
  ],
  brands: [
    { id: 'dairy', name: 'Bijjam Dairy', icon: 'fa-solid fa-cow', color: 'amber', subtitle: 'Farmer Milk Procurement & Delivery', active: true },
    { id: 'farms', name: 'Bijjam Farms', icon: 'fa-solid fa-seedling', color: 'emerald', subtitle: 'Bulk Food Products & Retail', active: true },
    { id: 'plantrix', name: 'Eco Plantrix', icon: 'fa-solid fa-spray-can-sparkles', color: 'cyan', subtitle: 'Eco-Friendly Cleaning Products', active: true },
    { id: 'mixed', name: 'Mixed Spends', icon: 'fa-solid fa-wallet', color: 'purple', subtitle: 'Common Company Overheads & Salaries', active: true }
  ],
  brandModules: {
    dairy: [
      { id: 'sales', name: 'Sales Management Hub', icon: 'fa-solid fa-cash-register', color: 'emerald', desc: 'Record milk sales & customer bills' },
      { id: 'delivery', name: 'Milk Delivery Management Hub', icon: 'fa-solid fa-truck-fast', color: 'cyan', desc: 'Manage delivery routes & subscriptions' },
      { id: 'milk_purchases', name: 'Milk Farmers Management Hub', icon: 'fa-solid fa-users', color: 'amber', desc: 'Add & manage milk suppliers & farmers' },
      { id: 'purchases', name: 'Purchases Management Hub', icon: 'fa-solid fa-cart-shopping', color: 'blue', desc: 'Record farmer milk procurement' },
      { id: 'expenses', name: 'Expenses Management Hub', icon: 'fa-solid fa-receipt', color: 'amber', desc: 'Cattle feed & veterinary costs' },
      { id: 'salary', name: 'Salary Management Hub', icon: 'fa-solid fa-wallet', color: 'purple', desc: 'Staff wages & dairy personnel pay' }
    ],
    farms: [
      { id: 'sales', name: 'Sales Management Hub', icon: 'fa-solid fa-cash-register', color: 'emerald', desc: 'Record and manage retail sales' },
      { id: 'purchases', name: 'Purchases Management Hub', icon: 'fa-solid fa-cart-shopping', color: 'blue', desc: 'Record and manage inventory & supplies' },
      { id: 'expenses', name: 'Expenses Management Hub', icon: 'fa-solid fa-receipt', color: 'amber', desc: 'Record and manage operational costs' },
      { id: 'salary', name: 'Salary Management Hub', icon: 'fa-solid fa-wallet', color: 'purple', desc: 'Record and manage staff wages' }
    ],
    plantrix: [
      { id: 'sales', name: 'Sales Management Hub', icon: 'fa-solid fa-cash-register', color: 'cyan', desc: 'Record cleaning products sales' },
      { id: 'purchases', name: 'Purchases Management Hub', icon: 'fa-solid fa-cart-shopping', color: 'blue', desc: 'Record raw chemical & jar purchases' },
      { id: 'expenses', name: 'Expenses Management Hub', icon: 'fa-solid fa-receipt', color: 'amber', desc: 'Lab utility & packaging costs' },
      { id: 'salary', name: 'Salary Management Hub', icon: 'fa-solid fa-wallet', color: 'purple', desc: 'Plantrix technician & sales wages' }
    ]
  },
  dairyFarmers: [
    { id: 1, name: 'Ramesh Kumar', phone: '9848012345', area: 'Jubilee Hills', companyId: 'bijjam-group' },
    { id: 2, name: 'Venkat Reddy', phone: '9848056789', area: 'Banjara Hills', companyId: 'bijjam-group' }
  ],
  deliveryRoutes: [
    { id: 1, name: 'Route A - Jubilee Hills', executive: 'Rajesh Sharma', customers: 28, shift: 'Morning (5:00 AM - 8:00 AM)', companyId: 'bijjam-group' },
    { id: 2, name: 'Route B - Banjara Hills', executive: 'Suresh Kumar', customers: 22, shift: 'Morning (5:00 AM - 8:00 AM)', companyId: 'bijjam-group' }
  ],
  dairyCustomers: [
    { id: 1, name: 'Dr. Srinivas Rao', route: 'Route A - Jubilee Hills', phone: '9848012345', sku: 'Cow Milk 1L', bill: 3250, recentDate: '2026-09-30', pending: 500, payments: [], companyId: 'bijjam-group' },
    { id: 2, name: 'Smt. Anitha Reddy', route: 'Route B - Banjara Hills', phone: '9848056789', sku: 'Buffalo Milk 0.5L', bill: 2100, recentDate: '2026-09-29', pending: 0, payments: [], companyId: 'bijjam-group' }
  ],
  dairyProcurement: [
    { id: 1, date: '2026-09-30', shift: 'Morning', farmer: 'Ramesh Kumar', qty: 15.0, fat: 6.5, snf: 8.5, rate: 48, total: 720, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-29', shift: 'Evening', farmer: 'Venkat Reddy', qty: 20.0, fat: 6.2, snf: 8.4, rate: 47, total: 940, companyId: 'bijjam-group' }
  ],
  dairyCattleExpenses: [
    { id: 1, date: '2026-09-30', category: 'Feed & Fodder', desc: 'Cotton Cake Feed', amount: 1200, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-28', category: 'Feed & Fodder', desc: '5 Bags Cotton Cake Cattle Feed', amount: 3500, companyId: 'bijjam-group' }
  ],
  farmsPurchases: [
    { id: 1, date: '2026-09-30', supplier: 'Organic Agro', sku: 'Organic Turmeric', qty: '10 Packets', amount: 1500, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-25', supplier: 'Organic Mill Agro', sku: '50kg Organic Millet Flour', qty: '50 Packets', amount: 4500, companyId: 'bijjam-group' }
  ],
  farmsSales: [
    { id: 1, date: '2026-09-30', customer: 'Rahul', sku: 'Honey 500g', status: 'Paid', amount: 450, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-29', customer: 'Sunitha', sku: 'Millet Flour 2kg, Honey 500g', status: 'Paid', amount: 680, companyId: 'bijjam-group' }
  ],
  plantrixPurchases: [
    { id: 1, date: '2026-09-30', supplier: 'ChemCo', sku: 'Disinfectant Base 10L', qty: '2 Jars', amount: 1100, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-22', supplier: 'GreenChem Lab', sku: 'Herbal Floor Cleaner 5L Jars', qty: '20 Jars', amount: 3200, companyId: 'bijjam-group' }
  ],
  plantrixSales: [
    { id: 1, date: '2026-09-30', customer: 'Villas Society', sku: 'Floor Cleaner 5L', status: 'Paid', amount: 950, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-29', customer: 'Apex Apartments', sku: 'Dishwash 1L, Floor Cleaner 5L', status: 'Paid', amount: 1250, companyId: 'bijjam-group' }
  ],
  mixedExpenses: [
    { id: 1, date: '2026-09-30', category: 'Utilities', desc: 'Electricity Bill', amount: 3200, companyId: 'bijjam-group' },
    { id: 2, date: '2026-09-01', category: 'Salaries & Wages', desc: 'Monthly Staff Salaries', amount: 45000, companyId: 'bijjam-group' },
    { id: 3, date: '2026-09-05', category: 'Office Rent', desc: 'Godown & Office Rent', amount: 25000, companyId: 'bijjam-group' }
  ],
  customersByBrand: {
    dairy: [
      { id: 1, name: 'Dr. Srinivas Rao', phone: '9848012345', area: 'Jubilee Hills', regDate: '2026-09-01', companyId: 'bijjam-group' },
      { id: 2, name: 'Smt. Anitha Reddy', phone: '9848056789', area: 'Banjara Hills', regDate: '2026-09-05', companyId: 'bijjam-group' }
    ],
    farms: [
      { id: 1, name: 'Rahul', phone: '9848099881', area: 'Madhapur', regDate: '2026-09-10', companyId: 'bijjam-group' },
      { id: 2, name: 'Sunitha', phone: '9848088772', area: 'Kondapur', regDate: '2026-09-12', companyId: 'bijjam-group' }
    ],
    plantrix: [
      { id: 1, name: 'Villas Society', phone: '9848077663', area: 'Gachibowli', regDate: '2026-09-15', companyId: 'bijjam-group' },
      { id: 2, name: 'Apex Apartments', phone: '9848066554', area: 'Hitec City', regDate: '2026-09-18', companyId: 'bijjam-group' }
    ],
    mixed: []
  },
  sellingItemsByBrand: {
    dairy: [
      { id: 1, name: 'Cow Milk 1L Pack', category: 'Dairy', mrp: 75, price: 70, stock: 240, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' },
      { id: 2, name: 'Buffalo Milk 1L Pack', category: 'Dairy', mrp: 85, price: 80, stock: 180, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' },
      { id: 3, name: 'Pure Desi Ghee 500ml', category: 'Dairy', mrp: 450, price: 420, stock: 65, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' }
    ],
    farms: [
      { id: 1, name: 'Organic Millet Flour 1kg', category: 'Food Products', mrp: 120, price: 100, stock: 150, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' },
      { id: 2, name: 'Wild Forest Honey 500g', category: 'Food Products', mrp: 380, price: 340, stock: 85, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' },
      { id: 3, name: 'Organic Turmeric Powder 200g', category: 'Food Products', mrp: 90, price: 80, stock: 120, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' }
    ],
    plantrix: [
      { id: 1, name: 'Eco Floor Cleaner 5L Can', category: 'Cleaning', mrp: 550, price: 480, stock: 90, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' },
      { id: 2, name: 'Herbal Dishwash Gel 1L', category: 'Cleaning', mrp: 180, price: 150, stock: 140, status: 'In Stock', companyId: 'bijjam-group', outletId: 'bijjam-group' }
    ],
    mixed: []
  }
};

/**
 * Strict Multi-Tenant Data Scoper & Matcher
 * Determines if a given entity record belongs to target company.
 * Untagged demo records strictly belong ONLY to Bijjam Group (Outlet 101).
 */
export const isItemForCompany = (item, targetCompId, companyObj) => {
  if (!item) return false;
  const itemCId = item.companyId ?? item.company_id ?? item.outletId;

  // Untagged demo entries belong exclusively to Bijjam Group (Outlet 101)
  if (!itemCId) {
    const isBijjam = 
      targetCompId === 'bijjam-group' || 
      targetCompId === '101' || 
      targetCompId === 101 ||
      companyObj?.id === 'bijjam-group' ||
      companyObj?.companyId === 101 ||
      companyObj?.code === 101;
    return isBijjam;
  }

  const strItemCId = String(itemCId).toLowerCase().trim();
  const strTarget = String(targetCompId || '').toLowerCase().trim();

  if (strItemCId === strTarget) return true;

  // Bijjam group synonyms (bijjam-group, 101)
  const isItemBijjam = strItemCId === 'bijjam-group' || strItemCId === '101';
  const isTargetBijjam = 
    strTarget === 'bijjam-group' || 
    strTarget === '101' || 
    companyObj?.id === 'bijjam-group' || 
    companyObj?.companyId === 101 || 
    companyObj?.code === 101;

  if (isItemBijjam && isTargetBijjam) return true;

  // Match against target company's other identifiers
  if (companyObj) {
    if (companyObj.id && String(companyObj.id).toLowerCase().trim() === strItemCId) return true;
    if (companyObj.companyId && String(companyObj.companyId).toLowerCase().trim() === strItemCId) return true;
    if (companyObj.code && String(companyObj.code).toLowerCase().trim() === strItemCId) return true;
  }

  return false;
};

/**
 * Sanitizes and tags legacy database state so untagged historical records
 * are explicitly anchored to bijjam-group and cannot leak to other tenants.
 */
export const sanitizeAndTagLegacyData = (state) => {
  if (!state) return state;
  const defaultTenant = 'bijjam-group';
  const tagList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(item => {
      if (!item) return item;
      const cid = item.companyId ?? item.company_id ?? item.outletId;
      if (!cid) {
        return { ...item, companyId: defaultTenant };
      }
      return item;
    });
  };

  state.dairyFarmers = tagList(state.dairyFarmers || initialDB.dairyFarmers);
  state.deliveryRoutes = tagList(state.deliveryRoutes || initialDB.deliveryRoutes);
  state.dairyCustomers = tagList(state.dairyCustomers || initialDB.dairyCustomers);
  state.dairyProcurement = tagList(state.dairyProcurement || initialDB.dairyProcurement);
  state.dairyCattleExpenses = tagList(state.dairyCattleExpenses || initialDB.dairyCattleExpenses);
  state.farmsPurchases = tagList(state.farmsPurchases || initialDB.farmsPurchases);
  state.farmsSales = tagList(state.farmsSales || initialDB.farmsSales);
  state.plantrixPurchases = tagList(state.plantrixPurchases || initialDB.plantrixPurchases);
  state.plantrixSales = tagList(state.plantrixSales || initialDB.plantrixSales);
  state.mixedExpenses = tagList(state.mixedExpenses || initialDB.mixedExpenses);

  if (state.customersByBrand) {
    Object.keys(state.customersByBrand).forEach(b => {
      state.customersByBrand[b] = tagList(state.customersByBrand[b]);
    });
  } else {
    state.customersByBrand = initialDB.customersByBrand;
  }

  if (state.sellingItemsByBrand) {
    Object.keys(state.sellingItemsByBrand).forEach(b => {
      state.sellingItemsByBrand[b] = (state.sellingItemsByBrand[b] || []).map((item, idx) => {
        const cid = item.companyId ?? item.company_id ?? item.outletId;
        return {
          ...item,
          companyId: cid || defaultTenant,
          outletId: cid || defaultTenant,
          skuCode: item.skuCode || (item.id && typeof item.id === 'string' && item.id.startsWith('SKU-') ? item.id : `SKU-${101 + idx}`)
        };
      });
    });
  } else {
    state.sellingItemsByBrand = initialDB.sellingItemsByBrand;
  }

  return state;
};

export const ERPProvider = ({ children }) => {
  const isRemoteSyncRef = useRef(false);
  const isCloudInitializedRef = useRef(false);
  const hasLocalMutationRef = useRef(false);
  const syncDebounceTimerRef = useRef(null);

  const [db, setDbInternal] = useState(() => {
    try {
      const saved = localStorage.getItem('bijjam_multibrand_erp');
      if (saved) {
        let parsed = JSON.parse(saved);
        // Ensure critical fields exist
        if (!parsed.companies || parsed.companies.length === 0) {
          parsed.companies = initialDB.companies;
        } else {
          // Merge initialDB companies so newly added default companies (e.g. Murali & Co.) are never missing from an old localStorage
          const existingKeys = new Set(parsed.companies.map(c => String(c.id || c.companyId || c.code)));
          initialDB.companies.forEach(initComp => {
            const key = String(initComp.id || initComp.companyId || initComp.code);
            if (!existingKeys.has(key)) {
              parsed.companies.push(initComp);
            }
          });
        }
        if (!parsed.customersByBrand) parsed.customersByBrand = initialDB.customersByBrand;
        if (!parsed.sellingItemsByBrand) parsed.sellingItemsByBrand = initialDB.sellingItemsByBrand;
        if (!parsed.brandModules) parsed.brandModules = initialDB.brandModules;
        if (!parsed.dairyFarmers) parsed.dairyFarmers = initialDB.dairyFarmers;
        if (!parsed.deliveryRoutes) parsed.deliveryRoutes = initialDB.deliveryRoutes;
        if (!parsed.dairyCustomers) parsed.dairyCustomers = initialDB.dairyCustomers;
        if (!parsed.admin?.password) parsed.admin = { ...parsed.admin, password: 'admin123' };

        // Sanitize and tag any legacy untagged demo entries to 'bijjam-group'
        parsed = sanitizeAndTagLegacyData(parsed);

        // Guarantee sequential 101+ company IDs on all restored companies
        if (parsed.companies) {
          parsed.companies = parsed.companies.map((c, idx) => {
            const parsedNum = parseInt(c.companyId || c.code, 10);
            return {
              ...c,
              companyId: !isNaN(parsedNum) ? parsedNum : (101 + idx),
              code: !isNaN(parsedNum) ? parsedNum : (101 + idx)
            };
          });
        }

        // Guarantee unique SKU codes on restored items
        if (parsed.sellingItemsByBrand) {
          Object.keys(parsed.sellingItemsByBrand).forEach(brandId => {
            parsed.sellingItemsByBrand[brandId] = (parsed.sellingItemsByBrand[brandId] || []).map((item, idx) => ({
              ...item,
              skuCode: item.skuCode || (item.id && typeof item.id === 'string' && item.id.startsWith('SKU-') ? item.id : `SKU-${101 + idx}`)
            }));
          });
        }

        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse stored ERP database', e);
    }
    return initialDB;
  });

  const setDb = (action) => {
    if (!isRemoteSyncRef.current) {
      hasLocalMutationRef.current = true;
    }
    setDbInternal(action);
  };

  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('bijjam_erp_session');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.role?.includes('Platform Admin') || u.isPlatformAdmin) {
          u.isPlatformAdmin = true;
          if (!u.name || u.name === 'Super ERP Platform Employee' || u.name === 'Blip ERP Platform Employee') {
            if (u.email?.includes('karthik')) u.name = 'Karthik Reddy';
            else if (u.email?.includes('admin')) u.name = 'Blip Admin';
            else if (u.email?.includes('priya')) u.name = 'Priya Sharma';
            else if (u.email?.includes('rahul')) u.name = 'Rahul Verma';
            else u.name = 'Blip Admin';
          }
        }
        return u;
      }
    } catch (e) {
      console.error('Failed to load ERP user session', e);
    }
    return null;
  });

  const isPlatformAdmin = Boolean(
    currentUser?.isPlatformAdmin || 
    currentUser?.role === 'Blip ERP Platform Admin' ||
    currentUser?.role === 'Super ERP Platform Admin' ||
    currentUser?.role?.toLowerCase().includes('platform') ||
    currentUser?.email?.endsWith('@bliperp.com')
  );

  const isAuthenticated = Boolean(currentUser);

  const login = (identifier, password) => {
    let cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      return { success: false, error: 'Please enter your registered username or email address.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Auto-normalize common typos like 'abmin@' -> 'admin@'
    if (cleanId.startsWith('abmin@')) {
      cleanId = 'admin@' + cleanId.slice(6);
    }

    // 0. Blip ERP Platform Admin Login (Via Standard Company Sign In)
    const isPlatformAdmin = 
      cleanId.endsWith('@bliperp.com') ||
      cleanId === 'admin@bliperp.com' || 
      cleanId === 'karthik@bliperp.com' ||
      cleanId === 'superadmin@bliperp.com' || 
      cleanId === 'priya@bliperp.com' ||
      cleanId === 'rahul@bliperp.com' ||
      cleanId === 'platform@bliperp.com' || 
      cleanId === 'super@bliperp.com' ||
      cleanId === 'superadmin@supererp.com' || 
      cleanId === 'admin@supererp.com';

    if (isPlatformAdmin) {
      if (cleanPass === 'blip123' || cleanPass === 'admin123' || cleanPass === 'super123' || cleanPass === DEFAULT_INITIAL_PASSWORD) {
        const teamList = (db.platformTeam && db.platformTeam.length > 0) ? db.platformTeam : [
          { id: 'pt-1', name: 'Karthik Reddy', email: 'karthik@bliperp.com', role: 'Platform Director & Founder', phone: '+91 9848012345' },
          { id: 'pt-2', name: 'Blip Admin', email: 'admin@bliperp.com', role: 'Lead Platform Administrator', phone: '+91 9000011223' },
          { id: 'pt-3', name: 'Priya Sharma', email: 'priya@bliperp.com', role: 'Platform Operations Manager', phone: '+91 9848055443' },
          { id: 'pt-4', name: 'Rahul Verma', email: 'rahul@bliperp.com', role: 'Cloud Infrastructure & DevOps Lead', phone: '+91 9848077665' },
          { id: 'pt-5', name: 'Master Admin', email: 'superadmin@bliperp.com', role: 'Super Platform Administrator', phone: '+91 9000099887' }
        ];

        const member = teamList.find(m => m.email.toLowerCase() === cleanId) || {
          id: 'pt-' + Date.now(),
          name: cleanId.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: cleanId,
          role: 'Blip ERP Platform Admin',
          phone: '+91 9848012345'
        };

        const user = {
          id: member.id,
          name: member.name,
          email: cleanId,
          phone: member.phone || '+91 9848012345',
          role: member.role || 'Blip ERP Platform Admin',
          brand: 'All Platforms',
          company: 'Blip ERP Cloud Inc. (Platform HQ)',
          isPlatformAdmin: true
        };
        setCurrentUser(user);
        localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
        localStorage.setItem('bijjam_erp_active_tab', 'super-admin-portal');
        setActiveTabState('super-admin-portal');
        syncBrowserUrl('/platform-dashboard', true);
        return { success: true, user };
      } else {
        return { success: false, error: 'Incorrect password for Blip ERP platform administrator account.' };
      }
    }

    // 1. Check Client Companies Owners/Admins
    const foundCompany = (db.companies || []).find(c => {
      const cEmail = (c.email || '').toLowerCase().trim();
      const cUser = (c.username || c.email?.split('@')[0] || '').toLowerCase().trim();
      const cCode = String(c.companyId || c.code || '').trim();
      const cId = (c.id || '').toLowerCase().trim();

      // Exact matches on email, username, serial code, or slug ID
      if (cEmail === cleanId || cUser === cleanId || cCode === cleanId || cId === cleanId) return true;

      // Email prefix match (e.g. 'murali' for 'murali@muralico.com')
      if (cEmail && cEmail.split('@')[0] === cleanId) return true;

      // Smart Bijjam / Bijjam Farms alias matching
      const isBijjam = cId === 'bijjam-group' || cCode === '101';
      if (isBijjam) {
        if (
          cleanId.includes('bijjam') ||
          cleanId.includes('farms') ||
          cleanId === 'admin@bijjamfarms' ||
          cleanId === 'admin@bijjamfarms.com' ||
          cleanId === 'admin@bijjam.com' ||
          cleanId === 'admin@bijjamenterprises.com' ||
          cleanId === 'bijjamfarms'
        ) {
          return true;
        }
      }

      // Smart Murali alias matching
      if (cleanId.includes('murali') && (c.name?.toLowerCase().includes('murali') || cEmail.includes('murali') || cId.includes('murali'))) {
        return true;
      }

      // Smart Sri Krishna Dairy matching
      if (cleanId.includes('krishna') && (c.name?.toLowerCase().includes('krishna') || cEmail.includes('krishna') || cId.includes('krishna'))) {
        return true;
      }

      // Smart Green Agro FMCG matching
      if ((cleanId.includes('green') || cleanId.includes('agro')) && (c.name?.toLowerCase().includes('agro') || cEmail.includes('agro') || cId.includes('agro'))) {
        return true;
      }

      return false;
    });

    if (foundCompany) {
      if (foundCompany.status === 'Suspended') {
        return { success: false, error: `The portal for ${foundCompany.name} is currently suspended. Please contact platform administration.` };
      }

      const expectedPass = foundCompany.password || DEFAULT_INITIAL_PASSWORD;
      const isDefaultInitial = (
        cleanPass === DEFAULT_INITIAL_PASSWORD ||
        cleanPass === 'admin123' ||
        cleanPass === 'user123'
      );
      const isBijjamSpecialPass = (
        foundCompany.id === 'bijjam-group' && 
        (cleanPass === 'admin@bijjam.com' || cleanPass === 'admin123' || cleanPass === DEFAULT_INITIAL_PASSWORD)
      );

      const isPasswordMatch = 
        cleanPass === expectedPass || 
        ((foundCompany.requiresPasswordChange || foundCompany.isFirstTimeLogin) && isDefaultInitial) ||
        isBijjamSpecialPass;
      
      if (isPasswordMatch) {
        // If first-time login requires changing password
        if (foundCompany.requiresPasswordChange || foundCompany.isFirstTimeLogin) {
          return {
            success: true,
            requiresPasswordChange: true,
            accountType: 'company',
            targetId: foundCompany.id,
            companyId: foundCompany.id,
            company: foundCompany,
            owner: foundCompany.owner || 'Company Admin',
            companyName: foundCompany.name,
            email: foundCompany.email,
            username: foundCompany.username || foundCompany.email?.split('@')[0]
          };
        }

        const user = {
          id: foundCompany.id,
          name: foundCompany.owner || 'Company Administrator',
          email: foundCompany.email,
          username: foundCompany.username || foundCompany.email?.split('@')[0],
          role: 'Company Administrator',
          brand: 'All Brands',
          company: foundCompany.name,
          companyId: foundCompany.id,
          avatar: foundCompany.avatar
        };
        switchActiveCompany(foundCompany.id);
        setCurrentUser(user);
        localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
        const browserLanding = parseRouteFromBrowser(db.brands || []);
        const landingTab = (browserLanding?.tab && !browserLanding.isRoot) ? browserLanding.tab : 'dashboard';
        setActiveTab(landingTab);
        return { success: true, user, company: foundCompany };
      } else {
        return { success: false, error: 'Incorrect password for this company portal account.' };
      }
    }

    // 2. Check Primary Default Admin
    const adminEmail = (db.admin?.email || 'admin@bijjamenterprises.com').toLowerCase();
    if (cleanId === adminEmail || cleanId === 'admin' || cleanId === 'superadmin') {
      const adminPass = db.admin?.password || 'admin123';
      if (cleanPass === adminPass || cleanPass === 'admin123' || cleanPass === DEFAULT_INITIAL_PASSWORD || cleanPass === 'admin@bijjam.com') {
        const defaultComp = (db.companies || []).find(c => c.id === 'bijjam-group') || (db.companies || [])[0];
        const user = {
          id: 'admin',
          name: db.admin?.name || 'Bijjam Enterprises Admin',
          email: db.admin?.email || 'admin@bijjamenterprises.com',
          role: 'Super Administrator',
          brand: 'All Brands',
          company: defaultComp?.name || 'Bijjam Enterprises Group',
          companyId: defaultComp?.id || 'bijjam-group'
        };
        if (defaultComp) {
          switchActiveCompany(defaultComp.id);
        }
        setCurrentUser(user);
        localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
        const browserLandingAdmin = parseRouteFromBrowser(db.brands || []);
        const landingTabAdmin = (browserLandingAdmin?.tab && !browserLandingAdmin.isRoot) ? browserLandingAdmin.tab : 'dashboard';
        setActiveTab(landingTabAdmin);
        return { success: true, user, company: defaultComp };
      } else {
        return { success: false, error: 'Incorrect password for admin account.' };
      }
    }

    // 3. Check System Users (Employees/Staff)
    const foundUser = (db.users || []).find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uUser = (u.username || u.email?.split('@')[0] || '').toLowerCase().trim();
      return uEmail === cleanId || uUser === cleanId;
    });

    if (foundUser) {
      if (foundUser.status && foundUser.status !== 'Active') {
        return { success: false, error: 'Your user account is inactive. Please contact your company administrator.' };
      }

      const expectedUserPass = foundUser.password || DEFAULT_INITIAL_PASSWORD;
      const isDefaultInitial = (
        cleanPass === DEFAULT_INITIAL_PASSWORD ||
        cleanPass === 'admin123' ||
        cleanPass === 'user123'
      );
      const isPasswordMatch = 
        cleanPass === expectedUserPass || 
        ((foundUser.requiresPasswordChange || foundUser.isFirstTimeLogin) && isDefaultInitial);

      if (isPasswordMatch) {
        const targetCompanyId = foundUser.companyId || 'bijjam-group';
        const userComp = (db.companies || []).find(c => c.id === targetCompanyId) || (db.companies || []).find(c => c.name === foundUser.company) || (db.companies || [])[0];

        if (userComp && userComp.status === 'Suspended') {
          return { success: false, error: `The portal for ${userComp.name} is currently suspended.` };
        }

        // First-Time Login check for Employees / Staff
        if (foundUser.requiresPasswordChange || foundUser.isFirstTimeLogin) {
          return {
            success: true,
            requiresPasswordChange: true,
            accountType: 'user',
            targetId: foundUser.id,
            userId: foundUser.id,
            user: foundUser,
            owner: foundUser.name,
            companyName: userComp?.name || 'Company Portal',
            email: foundUser.email,
            username: foundUser.username || foundUser.email?.split('@')[0]
          };
        }

        if (userComp) {
          switchActiveCompany(userComp.id);
        }

        const user = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          username: foundUser.username || foundUser.email?.split('@')[0],
          role: foundUser.role || 'Staff',
          brand: foundUser.brand || 'All Brands',
          company: userComp?.name || 'Company Portal',
          companyId: userComp?.id || targetCompanyId
        };
        setCurrentUser(user);
        localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
        const browserLandingUser = parseRouteFromBrowser(db.brands || []);
        const landingTabUser = (browserLandingUser?.tab && !browserLandingUser.isRoot) ? browserLandingUser.tab : 'dashboard';
        setActiveTab(landingTabUser);
        return { success: true, user, company: userComp };
      } else {
        return { success: false, error: 'Incorrect password for user account.' };
      }
    }

    return { 
      success: false, 
      error: 'No account found with this username or email ID. Please check your credentials or contact your administrator.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bijjam_erp_session');
    localStorage.removeItem('bijjam_erp_active_tab');
    setActiveTabState('dashboard');
    syncBrowserUrl('/', true);
  };

  // Multi-Company & Tenant State
  const [activeCompanyId, setActiveCompanyId] = useState(() => {
    try {
      const saved = localStorage.getItem('bijjam_active_company_id');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'bijjam-group';
  });

  const activeCompany = useMemo(() => {
    const list = db.companies || [];
    return list.find(c => c.id === activeCompanyId || String(c.companyId) === String(activeCompanyId) || String(c.code) === String(activeCompanyId)) || list[0] || {
      id: 'bijjam-group',
      companyId: 101,
      code: 101,
      name: db.company?.name || 'Bijjam Enterprises Group',
      gst: db.company?.gst || '36AABCB1234F1Z5',
      plan: 'Enterprise',
      status: 'Active',
      subscribedModules: ['dairy', 'fmcg', 'mixed']
    };
  }, [db.companies, activeCompanyId, db.company]);

  const companyModules = useMemo(() => {
    return activeCompany?.subscribedModules || ['dairy', 'fmcg', 'mixed'];
  }, [activeCompany]);

  const isBrandSubscribed = useCallback((brandId) => {
    if (!companyModules) return true;
    if (brandId === 'dairy') return companyModules.includes('dairy');
    if (brandId === 'farms' || brandId === 'plantrix') return companyModules.includes('fmcg');
    if (brandId === 'mixed') return companyModules.includes('mixed');
    return companyModules.includes('fmcg');
  }, [companyModules]);

  // Multi-Tenant Data Scoping: Guarantee 100% strict isolation between company outlets
  const scopedDb = useMemo(() => {
    const matchesCurrent = (item) => isItemForCompany(item, activeCompanyId, activeCompany);
    const isBijjam = activeCompanyId === 'bijjam-group' || activeCompanyId === '101' || activeCompany?.companyId === 101;

    const scopedBrands = (db.brands || []).map(b => {
      if (isBijjam) return b;
      let dynamicName = b.name;
      if (b.id === 'dairy') {
        dynamicName = activeCompany?.name ? `${activeCompany.name} Dairy` : 'Dairy Operations';
      } else if (b.id === 'farms') {
        dynamicName = activeCompany?.name ? `${activeCompany.name} Farms` : 'Farms & Retail';
      } else if (b.id === 'plantrix') {
        dynamicName = 'Eco Plantrix Products';
      } else if (b.id === 'mixed') {
        dynamicName = 'Company Spends & Overheads';
      }
      return {
        ...b,
        name: dynamicName
      };
    });

    return {
      ...db,
      brands: scopedBrands,
      companies: db.companies || [],
      platformTeam: db.platformTeam || [],
      company: activeCompany ? {
        name: activeCompany.name,
        gst: activeCompany.gst,
        phone: activeCompany.phone,
        address: activeCompany.address
      } : db.company,
      dairyFarmers: (db.dairyFarmers || []).filter(matchesCurrent),
      deliveryRoutes: (db.deliveryRoutes || []).filter(matchesCurrent),
      dairyCustomers: (db.dairyCustomers || []).filter(matchesCurrent),
      dairyProcurement: (db.dairyProcurement || []).filter(matchesCurrent),
      dairyCattleExpenses: (db.dairyCattleExpenses || []).filter(matchesCurrent),
      farmsPurchases: (db.farmsPurchases || []).filter(matchesCurrent),
      farmsSales: (db.farmsSales || []).filter(matchesCurrent),
      plantrixPurchases: (db.plantrixPurchases || []).filter(matchesCurrent),
      plantrixSales: (db.plantrixSales || []).filter(matchesCurrent),
      mixedExpenses: (db.mixedExpenses || []).filter(matchesCurrent),
      customersByBrand: {
        dairy: (db.customersByBrand?.dairy || []).filter(matchesCurrent),
        farms: (db.customersByBrand?.farms || []).filter(matchesCurrent),
        plantrix: (db.customersByBrand?.plantrix || []).filter(matchesCurrent),
        mixed: (db.customersByBrand?.mixed || []).filter(matchesCurrent)
      },
      sellingItemsByBrand: {
        dairy: (db.sellingItemsByBrand?.dairy || []).filter(matchesCurrent),
        farms: (db.sellingItemsByBrand?.farms || []).filter(matchesCurrent),
        plantrix: (db.sellingItemsByBrand?.plantrix || []).filter(matchesCurrent),
        mixed: (db.sellingItemsByBrand?.mixed || []).filter(matchesCurrent)
      },
      users: (db.users || []).filter(u => isPlatformAdmin ? true : matchesCurrent(u))
    };
  }, [db, activeCompanyId, activeCompany, isPlatformAdmin]);

  const switchActiveCompany = (companyId) => {
    setActiveCompanyId(companyId);
    try {
      localStorage.setItem('bijjam_active_company_id', companyId);
    } catch (e) {
      console.error(e);
    }
    if (!isPlatformAdmin) {
      setActiveTab('dashboard');
    }
  };

  const createCompany = (companyData) => {
    const cleanEmail = (companyData.email || '').trim().toLowerCase();
    
    // Check if email already exists across companies, admin, users, or platform admins
    const emailExists = 
      (db.companies || []).some(c => (c.email || '').toLowerCase() === cleanEmail) ||
      (db.admin?.email || '').toLowerCase() === cleanEmail ||
      (db.users || []).some(u => (u.email || '').toLowerCase() === cleanEmail) ||
      cleanEmail === 'admin@bliperp.com' ||
      cleanEmail === 'superadmin@bliperp.com' ||
      cleanEmail === 'platform@bliperp.com' ||
      cleanEmail === 'superadmin@supererp.com';

    if (emailExists) {
      return { 
        success: false, 
        error: 'An account with this email address already exists. Each email can belong to only 1 company portal.' 
      };
    }

    // Feature 1: Sequential unique company ID starting from 101
    const existingNumbers = (db.companies || []).map(c => {
      const parsed = parseInt(c.companyId || c.code || c.id, 10);
      return isNaN(parsed) ? 0 : parsed;
    });
    const maxSerial = Math.max(100, ...existingNumbers);
    const nextCompanyId = maxSerial + 1; // 101, 102, 103, 104...

    const slugId = (companyData.name || 'company')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-') + '-' + nextCompanyId;

    const baseUsername = (companyData.username || companyData.owner || companyData.name || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const generatedUsername = companyData.username 
      ? companyData.username.toLowerCase().trim()
      : `${baseUsername}${nextCompanyId}`;

    const newComp = {
      id: slugId,
      companyId: nextCompanyId,
      code: nextCompanyId,
      name: companyData.name,
      gst: companyData.gst || '36AAAAA0000A1Z0',
      owner: companyData.owner || 'Company Admin',
      username: generatedUsername,
      email: cleanEmail,
      password: DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: true,
      isFirstTimeLogin: true,
      phone: companyData.phone || '+91 9000000000',
      address: companyData.address || 'Corporate Park, Hyderabad',
      plan: companyData.plan || 'Professional',
      status: 'Active',
      renewalDate: companyData.renewalDate || '2027-09-30',
      monthlyFee: Number(companyData.monthlyFee) || (companyData.plan === 'Enterprise' ? 15000 : companyData.plan === 'Starter' ? 4500 : 8500),
      subscribedModules: companyData.subscribedModules || ['dairy', 'fmcg'],
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updatedCompanies = [newComp, ...(db.companies || []).filter(c => c.id !== slugId)];
    const nextDb = {
      ...db,
      companies: updatedCompanies
    };

    hasLocalMutationRef.current = true;
    setDb(prev => ({
      ...prev,
      companies: [newComp, ...(prev.companies || []).filter(c => c.id !== slugId)]
    }));

    try {
      localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
    } catch (e) {
      console.error('Error saving new company to localStorage:', e);
    }

    // Row-level insert into relational PostgreSQL table (~1KB payload)
    insertCompanyToDB(newComp).catch(err => console.warn('Row-level insertCompany note:', err));

    // Fallback sync to erp_state
    pushLocalERPState(nextDb);

    return { success: true, company: newComp };
  };

  const updateCompany = (companyId, updatedData) => {
    if (updatedData.email) {
      const cleanEmail = updatedData.email.trim().toLowerCase();
      const emailConflict = 
        (db.companies || []).some(c => c.id !== companyId && (c.email || '').toLowerCase() === cleanEmail) ||
        (db.admin?.email || '').toLowerCase() === cleanEmail ||
        (db.users || []).some(u => (u.email || '').toLowerCase() === cleanEmail) ||
        cleanEmail === 'admin@bliperp.com' ||
        cleanEmail === 'superadmin@bliperp.com' ||
        cleanEmail === 'superadmin@supererp.com';

      if (emailConflict) {
        return { success: false, error: 'This email is already in use by another company or user account.' };
      }
    }

    hasLocalMutationRef.current = true;
    const updatedCompanies = (db.companies || []).map(c => c.id === companyId ? { ...c, ...updatedData } : c);
    const nextDb = {
      ...db,
      companies: updatedCompanies
    };

    setDb(prev => ({
      ...prev,
      companies: (prev.companies || []).map(c => c.id === companyId ? { ...c, ...updatedData } : c)
    }));

    try {
      localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
    } catch (e) {
      console.error(e);
    }

    // Row-level update into relational PostgreSQL table
    updateCompanyInDB(companyId, updatedData).catch(err => console.warn('Row-level updateCompany note:', err));

    pushLocalERPState(nextDb);
    return { success: true };
  };

  const completeFirstTimePasswordSetup = (targetId, newPassword, accountType = 'company') => {
    const cleanNewPass = (newPassword || '').trim();
    
    // Enforce Enterprise Security Password Policy
    const validation = validatePasswordPolicy(cleanNewPass);
    if (!validation.isValid) {
      return { success: false, error: validation.errorMessage };
    }

    if (accountType === 'user') {
      const currentUsers = db.users || [];
      const targetUser = currentUsers.find(u => String(u.id) === String(targetId));
      if (!targetUser) {
        return { success: false, error: 'Employee account record not found.' };
      }

      const updatedUser = {
        ...targetUser,
        password: cleanNewPass,
        requiresPasswordChange: false,
        isFirstTimeLogin: false,
        passwordUpdatedAt: new Date().toISOString()
      };

      const updatedUsers = currentUsers.map(u => String(u.id) === String(targetId) ? updatedUser : u);
      const nextDb = {
        ...db,
        users: updatedUsers
      };

      hasLocalMutationRef.current = true;
      setDb(prev => ({
        ...prev,
        users: (prev.users || []).map(u => String(u.id) === String(targetId) ? updatedUser : u)
      }));

      try {
        localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
      } catch (e) {
        console.error('Error saving updated user password to localStorage:', e);
      }

      pushLocalERPState(nextDb);

      const targetCompanyId = targetUser.companyId || 'bijjam-group';
      const userComp = (db.companies || []).find(c => c.id === targetCompanyId) || (db.companies || [])[0];
      if (userComp) {
        switchActiveCompany(userComp.id);
      }

      const sessionUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username || updatedUser.email?.split('@')[0],
        role: updatedUser.role || 'Staff',
        brand: updatedUser.brand || 'All Brands',
        company: userComp?.name || 'Company Portal',
        companyId: userComp?.id || targetCompanyId,
        requiresPasswordChange: false
      };

      setCurrentUser(sessionUser);
      localStorage.setItem('bijjam_erp_session', JSON.stringify(sessionUser));
      setActiveTabState('dashboard');
      return { success: true, user: sessionUser, company: userComp };
    }

    // Default: Company account
    const currentCompanies = db.companies || [];
    const targetCompany = currentCompanies.find(c => 
      c.id === targetId || 
      String(c.companyId) === String(targetId) || 
      String(c.code) === String(targetId)
    );

    if (!targetCompany) {
      return { success: false, error: 'Company outlet record not found.' };
    }

    const updatedComp = {
      ...targetCompany,
      password: cleanNewPass,
      requiresPasswordChange: false,
      isFirstTimeLogin: false,
      passwordUpdatedAt: new Date().toISOString()
    };

    hasLocalMutationRef.current = true;
    const updatedCompanies = (db.companies || []).map(c => 
      (c.id === targetCompany.id || String(c.companyId) === String(targetCompany.companyId)) 
        ? updatedComp 
        : c
    );
    const nextDb = {
      ...db,
      companies: updatedCompanies
    };

    setDb(prev => ({
      ...prev,
      companies: (prev.companies || []).map(c => 
        (c.id === targetCompany.id || String(c.companyId) === String(targetCompany.companyId)) 
          ? updatedComp 
          : c
      )
    }));

    try {
      localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
    } catch (e) {
      console.error('Error saving updated company password to localStorage:', e);
    }

    // Row-level update into relational PostgreSQL table
    updateCompanyInDB(targetCompany.id, {
      password: cleanNewPass,
      requiresPasswordChange: false,
      isFirstTimeLogin: false
    }).catch(err => console.warn('Row-level updatePassword note:', err));

    pushLocalERPState(nextDb);

    const user = {
      id: updatedComp.id,
      name: updatedComp.owner || 'Company Administrator',
      email: updatedComp.email,
      username: updatedComp.username || updatedComp.email?.split('@')[0],
      role: 'Company Administrator',
      brand: 'All Brands',
      company: updatedComp.name || 'Company Portal',
      companyId: updatedComp.id,
      avatar: updatedComp.avatar,
      requiresPasswordChange: false
    };

    switchActiveCompany(updatedComp.id);
    setCurrentUser(user);
    localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
    setActiveTabState('dashboard');
    return { success: true, user, company: updatedComp };
  };

  const toggleCompanyStatus = (companyId) => {
    hasLocalMutationRef.current = true;
    let nextDb = null;
    let nextStatus = 'Active';
    setDb(prev => {
      const updatedCompanies = (prev.companies || []).map(c => {
        if (c.id === companyId) {
          nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      });
      nextDb = {
        ...prev,
        companies: updatedCompanies
      };
      try {
        localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
      } catch (e) {
        console.error(e);
      }
      return nextDb;
    });

    updateCompanyInDB(companyId, { status: nextStatus }).catch(err => console.warn('Row-level toggleStatus note:', err));

    if (nextDb) {
      pushLocalERPState(nextDb);
    }
  };

  const deleteCompany = (companyId) => {
    hasLocalMutationRef.current = true;
    let nextDb = null;
    setDb(prev => {
      const deletedIds = Array.from(new Set([...(prev.deletedCompanyIds || []), String(companyId)]));
      const updatedCompanies = (prev.companies || []).filter(c => c.id !== companyId && String(c.companyId) !== String(companyId));
      nextDb = {
        ...prev,
        companies: updatedCompanies,
        deletedCompanyIds: deletedIds
      };
      try {
        localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
      } catch (e) {
        console.error(e);
      }
      return nextDb;
    });

    deleteCompanyFromDB(companyId).catch(err => console.warn('Row-level deleteCompany note:', err));

    if (nextDb) {
      pushLocalERPState(nextDb);
    }
    return { success: true };
  };

  // Navigation State with smart persistence across refresh and dynamic URL routing
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('bijjam_erp_session');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const isPlatform = Boolean(
        savedUser?.isPlatformAdmin || 
        savedUser?.role === 'Blip ERP Platform Admin' ||
        savedUser?.role === 'Super ERP Platform Admin' ||
        savedUser?.role?.toLowerCase().includes('platform') ||
        savedUser?.email?.endsWith('@bliperp.com')
      );

      // Check current browser URL first!
      const initialRoute = parseRouteFromBrowser();
      if (initialRoute && initialRoute.tab) {
        if (isPlatform) {
          if (initialRoute.tab === 'account' || initialRoute.tab === 'core-modules' || initialRoute.tab === 'modules-management' || initialRoute.tab === 'tenant-companies-management' || initialRoute.tab === 'outlet-companies-management' || initialRoute.tab === 'company-dashboard') {
            return initialRoute.tab;
          }
          return 'super-admin-portal';
        }
        return initialRoute.tab;
      }

      const savedTab = localStorage.getItem('bijjam_erp_active_tab');

      if (isPlatform) {
        // Platform admin only restores 'account' or 'core-modules' if that was active.
        // Refresh must ALWAYS return to the platform console, never to a client tenant view.
        if (savedTab === 'account' || savedTab === 'core-modules' || savedTab === 'modules-management' || savedTab === 'tenant-companies-management' || savedTab === 'outlet-companies-management' || savedTab === 'company-dashboard') {
          return savedTab;
        }
        return 'super-admin-portal';
      }

      return savedTab || 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  });

  const setActiveTab = (tab, options = {}) => {
    setActiveTabState(tab);
    try {
      if (isPlatformAdmin) {
        // For platform admin, never persist tenant views (company-dashboard, dairy, etc.) across refresh
        if (tab === 'account' || tab === 'core-modules' || tab === 'modules-management' || tab === 'tenant-companies-management' || tab === 'outlet-companies-management') {
          localStorage.setItem('bijjam_erp_active_tab', tab);
        } else {
          localStorage.setItem('bijjam_erp_active_tab', 'super-admin-portal');
        }
      } else {
        localStorage.setItem('bijjam_erp_active_tab', tab);
      }
    } catch (e) {
      console.error('Failed to save activeTab', e);
    }

    if (isAuthenticated) {
      const targetUrl = getUrlFromTab(tab, {
        currentManageBrandId: options.brandId || currentManageBrandId,
        activeFinancialBrandId: options.financialBrandId || activeFinancialBrandId,
        activeFinancialType: options.financialType || activeFinancialType,
        activeCustomerObj: options.customerObj || activeCustomerObj,
        activeBrandDetail
      });
      syncBrowserUrl(targetUrl, options.replace || false);
    }
  };

  const [currentManageBrandId, setCurrentManageBrandId] = useState(() => {
    try {
      const initialRoute = parseRouteFromBrowser();
      if (initialRoute?.params?.brand) return initialRoute.params.brand;
    } catch (e) {}
    return 'dairy';
  });

  const [activeCustomerObj, setActiveCustomerObj] = useState(null);

  const [activeFinancialBrandId, setActiveFinancialBrandId] = useState(() => {
    try {
      const initialRoute = parseRouteFromBrowser();
      if (initialRoute?.params?.brand) return initialRoute.params.brand;
    } catch (e) {}
    return 'dairy';
  });

  const [activeFinancialType, setActiveFinancialType] = useState(() => {
    try {
      const initialRoute = parseRouteFromBrowser();
      if (initialRoute?.params?.type) return initialRoute.params.type;
    } catch (e) {}
    return 'sales';
  });

  // Sidebar collapsible state (persisted across sessions)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('blip_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('blip_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Customer subpage detail state
  const [activeBrandDetail, setActiveBrandDetail] = useState({ brandId: 'dairy', brandName: 'Bijjam Dairy' });

  // Handle browser Back / Forward history navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated) return;
      const route = parseRouteFromBrowser(db.brands || []);
      if (route && route.tab) {
        if (isPlatformAdmin) {
          if (route.tab === 'account' || route.tab === 'core-modules' || route.tab === 'modules-management' || route.tab === 'tenant-companies-management' || route.tab === 'outlet-companies-management' || route.tab === 'company-dashboard') {
            setActiveTabState(route.tab);
          } else {
            setActiveTabState('super-admin-portal');
          }
        } else {
          setActiveTabState(route.tab);
        }

        if (route.params.brand) {
          setCurrentManageBrandId(route.params.brand);
          setActiveFinancialBrandId(route.params.brand);
        }
        if (route.params.type) {
          setActiveFinancialType(route.params.type);
        }
        if (route.params.id) {
          const allCusts = [
            ...(db.customers || []),
            ...(db.dairyCustomers || []),
            ...(db.farmsCustomers || []),
            ...(db.plantrixCustomers || [])
          ];
          const found = allCusts.find(c => 
            String(c.id) === String(route.params.id) || 
            c.name?.toLowerCase().trim() === String(route.params.id).toLowerCase().trim()
          );
          if (found) {
            setActiveCustomerObj(found);
          }
        }
      } else if (route.isRoot) {
        const defaultTab = isPlatformAdmin ? 'super-admin-portal' : 'dashboard';
        setActiveTabState(defaultTab);
        const url = getUrlFromTab(defaultTab);
        syncBrowserUrl(url, true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    isAuthenticated, 
    isPlatformAdmin, 
    db.brands, 
    db.customers, 
    db.dairyCustomers, 
    db.farmsCustomers, 
    db.plantrixCustomers
  ]);

  // Keep browser URL synchronized whenever activeTab or view context parameters change
  useEffect(() => {
    if (!isAuthenticated) return;

    const targetUrl = getUrlFromTab(activeTab, {
      currentManageBrandId,
      activeFinancialBrandId,
      activeFinancialType,
      activeCustomerObj,
      activeBrandDetail
    });

    syncBrowserUrl(targetUrl);
  }, [
    isAuthenticated,
    activeTab,
    currentManageBrandId,
    activeFinancialBrandId,
    activeFinancialType,
    activeCustomerObj?.id,
    activeCustomerObj?.name,
    activeBrandDetail?.brandId
  ]);

  // Date Filtering State
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const [customRange, setCustomRange] = useState({ start: '2026-09-01', end: '2026-09-30' });

  // Modals state
  const [modalState, setModalState] = useState({
    brandModal: false,
    deleteBrandModal: false,
    addCustomerModal: false,
    editCustomerData: null,
    sellingItemModal: false,
    editSellingItemData: null,
    addUserModal: false,
    dairyProcurementModal: false,
    dairyFarmerModal: false,
    dairyCustomerModal: false,
    deliveryRouteModal: false,
    farmsPurchaseModal: false,
    farmsSaleModal: false,
    plantrixPurchaseModal: false,
    plantrixSaleModal: false,
    mixedModal: false,
    customDateModal: false,
    startDeliveriesModal: false,
    reportsModal: false
  });

  const openModal = (name, extraData = null) => {
    setModalState(prev => ({
      ...prev,
      [name]: true,
      ...(name === 'addCustomerModal' ? { editCustomerData: extraData } : {}),
      ...(name === 'sellingItemModal' ? { editSellingItemData: extraData } : {})
    }));
  };

  const closeModal = (name) => {
    setModalState(prev => ({
      ...prev,
      [name]: false,
      ...(name === 'addCustomerModal' ? { editCustomerData: null } : {}),
      ...(name === 'sellingItemModal' ? { editSellingItemData: null } : {})
    }));
  };

  // Helper to merge local and remote ERP databases without ever losing tenant companies or records
  const mergeERPStates = (localState, remoteState) => {
    if (!remoteState) return localState;
    if (!localState) return remoteState;

    const deletedIds = new Set([
      ...(localState.deletedCompanyIds || []),
      ...(remoteState.deletedCompanyIds || [])
    ]);

    // Merge companies: map by identifier (id, companyId, or code)
    const companyMap = new Map();

    // Add remote companies first (unless deleted)
    (remoteState.companies || []).forEach(comp => {
      if (!comp) return;
      const key = String(comp.id || comp.companyId || comp.code);
      if (!deletedIds.has(key) && !deletedIds.has(String(comp.id)) && !deletedIds.has(String(comp.companyId))) {
        companyMap.set(key, comp);
      }
    });

    // Merge local companies: any locally created company that is not in remote is PRESERVED!
    (localState.companies || []).forEach(localComp => {
      if (!localComp) return;
      const key = String(localComp.id || localComp.companyId || localComp.code);
      if (deletedIds.has(key) || deletedIds.has(String(localComp.id)) || deletedIds.has(String(localComp.companyId))) {
        return;
      }

      if (!companyMap.has(key)) {
        companyMap.set(key, localComp);
      } else {
        const existing = companyMap.get(key);
        // If either side completed first-time password setup, preserve the completed setup!
        const requiresPasswordChange = (existing.requiresPasswordChange === false || localComp.requiresPasswordChange === false)
          ? false
          : (localComp.requiresPasswordChange ?? existing.requiresPasswordChange ?? true);

        const isFirstTimeLogin = (existing.isFirstTimeLogin === false || localComp.isFirstTimeLogin === false)
          ? false
          : (localComp.isFirstTimeLogin ?? existing.isFirstTimeLogin ?? true);

        const password = (localComp.password && localComp.password !== 'admin123') 
          ? localComp.password 
          : (existing.password || localComp.password || 'admin123');

        companyMap.set(key, {
          ...existing,
          ...localComp,
          password,
          requiresPasswordChange,
          isFirstTimeLogin,
          passwordUpdatedAt: localComp.passwordUpdatedAt || existing.passwordUpdatedAt,
          subscribedModules: localComp.subscribedModules?.length ? localComp.subscribedModules : existing.subscribedModules
        });
      }
    });

    const mergeArrayById = (localArr = [], remoteArr = [], idKey = 'id') => {
      const map = new Map();
      (remoteArr || []).forEach(item => {
        if (item && item[idKey]) map.set(String(item[idKey]), item);
      });
      (localArr || []).forEach(item => {
        if (item && item[idKey]) {
          const key = String(item[idKey]);
          if (!map.has(key)) map.set(key, item);
          else map.set(key, { ...map.get(key), ...item });
        }
      });
      return Array.from(map.values());
    };

    const mergeBrandRecordObjects = (localObj = {}, remoteObj = {}, idKey = 'id') => {
      const res = { ...(localObj || {}), ...(remoteObj || {}) };
      const allKeys = new Set([...Object.keys(localObj || {}), ...Object.keys(remoteObj || {})]);
      allKeys.forEach(k => {
        res[k] = mergeArrayById(localObj?.[k] || [], remoteObj?.[k] || [], idKey);
      });
      return res;
    };

    const mergedCompanies = Array.from(companyMap.values());

    const mergedState = {
      ...localState,
      ...remoteState,
      companies: mergedCompanies.length > 0 ? mergedCompanies : (remoteState.companies || localState.companies || initialDB.companies),
      deletedCompanyIds: Array.from(deletedIds),
      platformTeam: (remoteState.platformTeam && remoteState.platformTeam.length > 0) ? remoteState.platformTeam : (localState.platformTeam || initialDB.platformTeam),
      brandModules: remoteState.brandModules || localState.brandModules || initialDB.brandModules,
      brands: remoteState.brands || localState.brands || initialDB.brands,
      customersByBrand: mergeBrandRecordObjects(localState.customersByBrand, remoteState.customersByBrand, 'phone'),
      sellingItemsByBrand: mergeBrandRecordObjects(localState.sellingItemsByBrand, remoteState.sellingItemsByBrand, 'skuCode'),
      dairyFarmers: mergeArrayById(localState.dairyFarmers, remoteState.dairyFarmers, 'id'),
      deliveryRoutes: mergeArrayById(localState.deliveryRoutes, remoteState.deliveryRoutes, 'id'),
      dairyCustomers: mergeArrayById(localState.dairyCustomers, remoteState.dairyCustomers, 'phone'),
      dairyProcurement: mergeArrayById(localState.dairyProcurement, remoteState.dairyProcurement, 'id'),
      dairyCattleExpenses: mergeArrayById(localState.dairyCattleExpenses, remoteState.dairyCattleExpenses, 'id'),
      farmsPurchases: mergeArrayById(localState.farmsPurchases, remoteState.farmsPurchases, 'id'),
      farmsSales: mergeArrayById(localState.farmsSales, remoteState.farmsSales, 'id'),
      plantrixPurchases: mergeArrayById(localState.plantrixPurchases, remoteState.plantrixPurchases, 'id'),
      plantrixSales: mergeArrayById(localState.plantrixSales, remoteState.plantrixSales, 'id'),
      mixedExpenses: mergeArrayById(localState.mixedExpenses, remoteState.mixedExpenses, 'id')
    };

    return sanitizeAndTagLegacyData(mergedState);
  };

  // Supabase Cloud Sync State
  const [cloudStatus, setCloudStatus] = useState(() => isSupabaseConfigured() ? 'syncing' : 'offline');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncError, setSyncError] = useState('');

  const dbRef = useRef(db);
  useEffect(() => {
    dbRef.current = db;
  }, [db]);

  // Initialize Supabase sync & Realtime listener
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    let activeChannel = null;

    const initCloud = async () => {
      setCloudStatus('syncing');
      setSyncError('');
      try {
        const testRes = await testSupabaseConnection();
        if (!testRes.success) {
          setCloudStatus('error');
          setSyncError(testRes.message || 'Failed to connect to Supabase');
          return;
        }

        // Fetch remote data
        const remoteData = await fetchRemoteERPState();
        if (remoteData) {
          // Robust Two-Way Merge: Combine remote data with any newly created local companies
          const merged = mergeERPStates(dbRef.current, remoteData);
          isRemoteSyncRef.current = true;
          isCloudInitializedRef.current = true;
          setDb(merged);
          try {
            localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(merged));
          } catch (e) {
            console.error(e);
          }
          setLastSyncedAt(new Date().toLocaleTimeString());
          setCloudStatus('connected');

          // If local had newly created companies that were missing in remote, push the merged state back to remote
          const remoteCount = (remoteData.companies || []).length;
          const mergedCount = (merged.companies || []).length;
          if (mergedCount > remoteCount) {
            await pushLocalERPState(merged);
          }
        } else if (!testRes.hasRecord) {
          // Only seed if the Supabase table has genuinely 0 records in database
          const pushRes = await pushLocalERPState(dbRef.current);
          isCloudInitializedRef.current = true;
          if (pushRes.success) {
            setLastSyncedAt(new Date().toLocaleTimeString());
            setCloudStatus('connected');
          } else {
            setCloudStatus('error');
            setSyncError(pushRes.message);
          }
        } else {
          // Table exists but read had a transient network issue: do NOT overwrite remote data!
          console.warn('Supabase table exists but fetch returned null. Retaining local data without overwriting remote.');
          isCloudInitializedRef.current = true;
          setCloudStatus('connected');
        }

        // Check relational companies table
        try {
          const relRes = await fetchCompaniesFromDB();
          if (relRes.success && relRes.data?.length > 0) {
            setDb(prev => {
              const companyMap = new Map();
              relRes.data.forEach(c => companyMap.set(c.id, c));
              (prev.companies || []).forEach(c => {
                if (!companyMap.has(c.id)) companyMap.set(c.id, c);
              });
              return {
                ...prev,
                companies: Array.from(companyMap.values())
              };
            });
          }
        } catch (e) {
          console.warn('Note on relational fetch:', e);
        }

        // Setup Realtime subscription for both granular relational changes and erp_state
        const client = getSupabaseClient();
        if (client) {
          activeChannel = client
            .channel('erp_combined_realtime')
            .on('postgres_changes', {
              event: '*',
              schema: 'public',
              table: 'companies'
            }, (payload) => {
              if (payload.new) {
                const comp = payload.new;
                const formatted = {
                  id: comp.id,
                  companyId: comp.serial_number,
                  code: comp.serial_number,
                  name: comp.name,
                  gst: comp.gst,
                  owner: comp.owner,
                  email: comp.email,
                  password: comp.password,
                  requiresPasswordChange: comp.requires_password_change,
                  isFirstTimeLogin: comp.is_first_time_login,
                  phone: comp.phone,
                  address: comp.address,
                  plan: comp.plan,
                  status: comp.status,
                  renewalDate: comp.renewal_date,
                  monthlyFee: Number(comp.monthly_fee),
                  subscribedModules: comp.subscribed_modules || ['dairy', 'fmcg'],
                  avatar: comp.avatar
                };
                setDb(prev => {
                  const existing = (prev.companies || []).filter(c => c.id !== formatted.id);
                  return {
                    ...prev,
                    companies: [formatted, ...existing]
                  };
                });
              }
            })
            .on('postgres_changes', {
              event: '*',
              schema: 'public',
              table: 'erp_state',
              filter: 'id=eq.bijjam_group_default'
            }, (payload) => {
              if (payload.new && payload.new.data) {
                const incomingData = payload.new.data;
                const merged = mergeERPStates(dbRef.current, incomingData);
                isRemoteSyncRef.current = true;
                setDb(merged);
                try {
                  localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(merged));
                } catch (e) {
                  console.error(e);
                }
                setLastSyncedAt(new Date().toLocaleTimeString());
                setCloudStatus('connected');
              }
            })
            .subscribe();
        }
      } catch (err) {
        setCloudStatus('error');
        setSyncError(err.message || 'Error initializing Supabase');
      }
    };

    initCloud();

    return () => {
      if (activeChannel) {
        const client = getSupabaseClient();
        if (client) client.removeChannel(activeChannel);
      }
    };
  }, []);

  // Persist db locally and debounced sync to Supabase ONLY on explicit user mutations
  useEffect(() => {
    try {
      localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    if (isRemoteSyncRef.current) {
      isRemoteSyncRef.current = false;
      return;
    }

    if (!isCloudInitializedRef.current) {
      // CRITICAL: NEVER auto-push initial / stale local state before fetching and merging remote state!
      return;
    }

    if (!hasLocalMutationRef.current) {
      // CRITICAL: NEVER auto-push on passive component renders, mount, tab switches, or logouts!
      return;
    }

    if (!isSupabaseConfigured()) return;

    if (syncDebounceTimerRef.current) {
      clearTimeout(syncDebounceTimerRef.current);
    }

    syncDebounceTimerRef.current = setTimeout(async () => {
      hasLocalMutationRef.current = false;
      setCloudStatus('syncing');
      const res = await pushLocalERPState(dbRef.current);
      if (res.success) {
        setCloudStatus('connected');
        setLastSyncedAt(new Date().toLocaleTimeString());
        setSyncError('');
      } else {
        setCloudStatus('error');
        setSyncError(res.message);
      }
    }, 800);

    return () => {
      if (syncDebounceTimerRef.current) {
        clearTimeout(syncDebounceTimerRef.current);
      }
    };
  }, [db]);

  const uploadToSupabase = async () => {
    setCloudStatus('syncing');
    const res = await pushLocalERPState(db);
    if (res.success) {
      setCloudStatus('connected');
      setLastSyncedAt(new Date().toLocaleTimeString());
      setSyncError('');
      return { success: true };
    } else {
      setCloudStatus('error');
      setSyncError(res.message);
      return { success: false, message: res.message };
    }
  };

  const downloadFromSupabase = async () => {
    setCloudStatus('syncing');
    const remoteData = await fetchRemoteERPState();
    if (remoteData) {
      isRemoteSyncRef.current = true;
      setDb(remoteData);
      setLastSyncedAt(new Date().toLocaleTimeString());
      setCloudStatus('connected');
      setSyncError('');
      return { success: true };
    } else {
      setCloudStatus('error');
      const msg = 'No data found in Supabase or connection failed.';
      setSyncError(msg);
      return { success: false, message: msg };
    }
  };

  // Date in range checking function
  const isDateInRange = React.useCallback((dateStr) => {
    if (!dateStr) return true;
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return dateStr === '2026-09-30';
    if (dateFilter === 'thisWeek') return dateStr >= '2026-09-28' && dateStr <= '2026-09-30';
    if (dateFilter === 'lastWeek') return dateStr >= '2026-09-21' && dateStr <= '2026-09-27';
    if (dateFilter === 'thisMonth') return dateStr >= '2026-09-01' && dateStr <= '2026-09-30';
    if (dateFilter === 'lastMonth') return dateStr >= '2026-08-01' && dateStr <= '2026-08-31';
    if (dateFilter === 'custom') {
      return (!customRange.start || dateStr >= customRange.start) &&
             (!customRange.end || dateStr <= customRange.end);
    }
    return true;
  }, [dateFilter, customRange]);

  const dateFilterLabel = useMemo(() => {
    switch (dateFilter) {
      case 'today': return 'Today (30 Sep 2026)';
      case 'thisWeek': return 'This Week (28 Sep – 30 Sep 2026)';
      case 'lastWeek': return 'Last Week (21 Sep – 27 Sep 2026)';
      case 'thisMonth': return 'This Month (1 Sep – 30 Sep 2026)';
      case 'lastMonth': return 'Last Month (1 Aug – 31 Aug 2026)';
      case 'custom': return `Custom Range (${customRange.start} – ${customRange.end})`;
      case 'all': return 'All Time (Complete Records)';
      default: return 'This Month (1 Sep – 30 Sep 2026)';
    }
  }, [dateFilter, customRange]);

  // Financial calculations per brand - strictly scoped to active company outlet
  const getBrandFinancials = React.useCallback((brandId) => {
    let sales = 0;
    let purchases = 0;
    let expenses = 0;
    let salary = 0;

    if (brandId === 'dairy') {
      if (scopedDb.dairyCustomers) {
        sales = scopedDb.dairyCustomers.reduce((acc, c) => acc + (Number(c.bill) || 0), 0);
      }
      if (scopedDb.dairyProcurement) {
        purchases = scopedDb.dairyProcurement.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.total) || 0), 0);
      }
      if (scopedDb.dairyCattleExpenses) {
        expenses = scopedDb.dairyCattleExpenses.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    } else if (brandId === 'farms') {
      if (scopedDb.farmsSales) {
        sales = scopedDb.farmsSales.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
      if (scopedDb.farmsPurchases) {
        purchases = scopedDb.farmsPurchases.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    } else if (brandId === 'plantrix') {
      if (scopedDb.plantrixSales) {
        sales = scopedDb.plantrixSales.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
      if (scopedDb.plantrixPurchases) {
        purchases = scopedDb.plantrixPurchases.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    } else if (brandId === 'mixed') {
      if (scopedDb.mixedExpenses) {
        expenses = scopedDb.mixedExpenses.filter(x => isDateInRange(x.date) && x.category !== 'Salaries & Wages')
          .reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
        salary = scopedDb.mixedExpenses.filter(x => isDateInRange(x.date) && x.category === 'Salaries & Wages')
          .reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    }

    const netPL = sales - (purchases + expenses + salary);
    return { sales, purchases, expenses, salary, netPL };
  }, [scopedDb, isDateInRange]);

  // Group financials consolidated across all active & subscribed brands of this company
  const groupFinancials = useMemo(() => {
    let totSales = 0;
    let totPurchases = 0;
    let totExpenses = 0;
    let totSalary = 0;

    const activeBrands = (scopedDb.brands || []).filter(b => b.active && isBrandSubscribed(b.id));
    activeBrands.forEach(b => {
      const fin = getBrandFinancials(b.id);
      totSales += fin.sales;
      totPurchases += fin.purchases;
      totExpenses += fin.expenses;
      totSalary += fin.salary;
    });

    const netProfitOrLoss = totSales - (totPurchases + totExpenses + totSalary);
    const isProfit = netProfitOrLoss >= 0;
    const totalActivity = totSales + totPurchases + totExpenses + totSalary;

    return {
      totSales,
      totPurchases,
      totExpenses,
      totSalary,
      netProfitOrLoss,
      isProfit,
      totalActivity
    };
  }, [scopedDb, getBrandFinancials, isBrandSubscribed]);

  // Customer Financials across brands - strictly scoped to active company
  const getCustomerFinancials = (customerName, brandId = currentManageBrandId) => {
    let totalPurchasesSum = 0;
    let pendingPaymentSum = 0;
    const cleanName = customerName?.toLowerCase().trim();

    if (brandId === 'dairy') {
      const dc = (scopedDb.dairyCustomers || []).find(c => c.name?.toLowerCase().trim() === cleanName);
      if (dc) {
        totalPurchasesSum = Number(dc.bill) || 0;
        const paid = dc.payments ? dc.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) : 0;
        pendingPaymentSum = Math.max(0, totalPurchasesSum - paid);
      }
    } else if (brandId === 'farms') {
      (scopedDb.farmsSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach(s => {
        totalPurchasesSum += Number(s.amount) || 0;
        if (s.status === 'Pending') pendingPaymentSum += Number(s.amount) || 0;
      });
    } else if (brandId === 'plantrix') {
      (scopedDb.plantrixSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach(s => {
        totalPurchasesSum += Number(s.amount) || 0;
        if (s.status === 'Pending') pendingPaymentSum += Number(s.amount) || 0;
      });
    }

    return { totalPurchasesSum, pendingPaymentSum };
  };

  // Helper actions
  const saveCompanyDetails = (data) => {
    setDb(prev => ({
      ...prev,
      company: { ...prev.company, ...data }
    }));
  };

  const saveAdminProfile = (data) => {
    setDb(prev => ({
      ...prev,
      admin: { ...prev.admin, ...data }
    }));
  };

  const saveNewUser = (user) => {
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const baseUsername = (user.username || user.name || user.email?.split('@')[0] || 'staff')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const cleanUsername = (user.username || `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`).toLowerCase().trim();
    
    // Check if email or username already taken anywhere in the system
    const conflict = 
      (db.companies || []).some(c => (c.email || '').toLowerCase() === cleanEmail || (c.username || '').toLowerCase() === cleanUsername) ||
      (db.admin?.email || '').toLowerCase() === cleanEmail ||
      (db.users || []).some(u => (u.email || '').toLowerCase() === cleanEmail || (u.username || '').toLowerCase() === cleanUsername) ||
      cleanEmail === 'admin@bliperp.com' ||
      cleanEmail === 'superadmin@bliperp.com' ||
      cleanEmail === 'superadmin@supererp.com';

    if (conflict) {
      return { 
        success: false, 
        error: 'An account with this email address or username already exists. Each account must have unique credentials.' 
      };
    }

    const newUserObj = { 
      ...user, 
      id: Date.now(), 
      companyId: activeCompanyId, 
      username: cleanUsername,
      password: DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: true,
      isFirstTimeLogin: true,
      status: 'Active' 
    };

    const nextDb = {
      ...db,
      users: [...(db.users || []), newUserObj]
    };

    hasLocalMutationRef.current = true;
    setDb(prev => ({
      ...prev,
      users: [...(prev.users || []), newUserObj]
    }));

    try {
      localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
    } catch (e) {
      console.error('Error saving new user to localStorage:', e);
    }

    pushLocalERPState(nextDb);

    return { success: true, user: newUserObj };
  };

  const deleteUser = (id) => {
    const nextUsers = (db.users || []).filter(u => u.id !== id);
    const nextDb = { ...db, users: nextUsers };
    hasLocalMutationRef.current = true;
    setDb(prev => ({
      ...prev,
      users: (prev.users || []).filter(u => u.id !== id)
    }));
    try {
      localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(nextDb));
    } catch (e) {
      console.error(e);
    }
    pushLocalERPState(nextDb);
  };

  const saveBrand = (brandData) => {
    const { id, name, subtitle, icon, color } = brandData;
    const idKey = id || name.toLowerCase().replace(/\s+/g, '_');

    setDb(prev => {
      const existing = (prev.brands || []).find(b => b.id === idKey);
      let updatedBrands;
      if (existing) {
        updatedBrands = prev.brands.map(b => b.id === idKey ? { ...b, name, subtitle, icon, color } : b);
      } else {
        updatedBrands = [...prev.brands, { id: idKey, name, subtitle, icon, color, active: true }];
      }

      const updatedModules = { ...prev.brandModules };
      if (!updatedModules[idKey]) {
        updatedModules[idKey] = [
          { id: 'sales', name: 'Sales Management Hub', icon: 'fa-solid fa-cash-register', color: 'emerald', desc: 'Record sales & customer bills' },
          { id: 'purchases', name: 'Purchases Management Hub', icon: 'fa-solid fa-cart-shopping', color: 'blue', desc: 'Record inventory purchases' },
          { id: 'expenses', name: 'Expenses Management Hub', icon: 'fa-solid fa-receipt', color: 'amber', desc: 'Operational costs' },
          { id: 'salary', name: 'Salary Management Hub', icon: 'fa-solid fa-wallet', color: 'purple', desc: 'Staff wages & pay' }
        ];
      }

      const updatedCustomers = { ...prev.customersByBrand };
      if (!updatedCustomers[idKey]) updatedCustomers[idKey] = [];

      const updatedItems = { ...prev.sellingItemsByBrand };
      if (!updatedItems[idKey]) updatedItems[idKey] = [];

      return {
        ...prev,
        brands: updatedBrands,
        brandModules: updatedModules,
        customersByBrand: updatedCustomers,
        sellingItemsByBrand: updatedItems
      };
    });
  };

  const toggleBrandStatus = (brandId) => {
    setDb(prev => ({
      ...prev,
      brands: prev.brands.map(b => b.id === brandId ? { ...b, active: !b.active } : b)
    }));
  };

  const deleteBrand = (brandId, password) => {
    const adminPass = db.admin?.password || 'admin123';
    if (password !== adminPass) {
      return { success: false, message: 'Incorrect ERP user password.' };
    }
    const brand = db.brands.find(b => b.id === brandId);
    setDb(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b.id !== brandId)
    }));
    return { success: true, message: `Brand "${brand ? brand.name : brandId}" deleted successfully.` };
  };

  const moveBrandModule = (brandId, idx, direction) => {
    setDb(prev => {
      const modules = [...(prev.brandModules[brandId] || [])];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= modules.length) return prev;
      const temp = modules[idx];
      modules[idx] = modules[targetIdx];
      modules[targetIdx] = temp;
      return {
        ...prev,
        brandModules: {
          ...prev.brandModules,
          [brandId]: modules
        }
      };
    });
  };

  // Customers CRUD
  // Feature 2: Customers CRUD - Mobile Number is Unique ID at Company Level
  const saveBrandCustomer = (brandId, customer) => {
    const rawPhone = (customer.phone || customer.id || '').toString().trim();
    const cleanMobile = rawPhone.replace(/[^0-9+]/g, '');

    if (!cleanMobile || cleanMobile.replace(/[^0-9]/g, '').length < 7) {
      return { 
        success: false, 
        error: 'A valid mobile number is required as the Customer Unique ID.' 
      };
    }

    const currentBrandCusts = scopedDb.customersByBrand?.[brandId] || [];

    // Check duplicate mobile at company / brand level
    const duplicate = currentBrandCusts.find(c => {
      const existingClean = (c.phone || c.id || '').toString().replace(/[^0-9+]/g, '');
      const isSelf = customer.originalId ? c.id === customer.originalId : (customer.id && c.id === customer.id);
      return existingClean === cleanMobile && !isSelf;
    });

    if (duplicate) {
      return { 
        success: false, 
        error: `Customer with Mobile ID "${cleanMobile}" already exists in this company.` 
      };
    }

    const updatedCustomer = {
      ...customer,
      id: cleanMobile,
      phone: cleanMobile,
      companyId: activeCompanyId,
      regDate: customer.regDate || new Date().toISOString().split('T')[0]
    };

    setDb(prev => {
      const brandCusts = [...(prev.customersByBrand?.[brandId] || [])];
      let updated;
      const matchIndex = brandCusts.findIndex(c => 
        (c.id === updatedCustomer.id || (customer.originalId && c.id === customer.originalId)) &&
        isItemForCompany(c, activeCompanyId, activeCompany)
      );

      if (matchIndex >= 0) {
        updated = brandCusts.map((c, idx) => idx === matchIndex ? { ...c, ...updatedCustomer } : c);
      } else {
        updated = [...brandCusts, updatedCustomer];
      }

      return {
        ...prev,
        customersByBrand: {
          ...prev.customersByBrand,
          [brandId]: updated
        }
      };
    });

    // Row-level insert into relational PostgreSQL table (~300 bytes payload)
    insertCustomerToDB({ ...updatedCustomer, brandId, companyId: activeCompanyId }).catch(err => console.warn('Row-level insertCustomer note:', err));

    return { success: true, customer: updatedCustomer };
  };

  const deleteBrandCustomer = (brandId, customerId) => {
    setDb(prev => ({
      ...prev,
      customersByBrand: {
        ...prev.customersByBrand,
        [brandId]: (prev.customersByBrand[brandId] || []).filter(c => c.id !== customerId)
      }
    }));
  };

  // Feature 3: Selling Items (SKUs) CRUD - Unique SKU ID at Outlet Level
  const saveSellingItem = (brandId, item) => {
    const currentItems = scopedDb.sellingItemsByBrand?.[brandId] || [];
    
    // Auto-generate or sanitize SKU Code
    let skuCode = (item.skuCode || item.sku || item.id || '').toString().trim().toUpperCase();
    if (!skuCode || skuCode === 'UNDEFINED') {
      const existingNums = currentItems.map(i => {
        const match = (i.skuCode || i.id || '').toString().match(/SKU-?(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      });
      const nextNum = Math.max(100, ...existingNums) + 1;
      skuCode = `SKU-${nextNum}`;
    }

    // Check duplicate SKU ID in this outlet
    const duplicate = currentItems.find(i => {
      const existingSku = (i.skuCode || i.id || '').toString().trim().toUpperCase();
      const isSelf = item.originalSkuCode ? (i.skuCode === item.originalSkuCode || i.id === item.originalSkuCode) : (item.id && i.id === item.id);
      return existingSku === skuCode && !isSelf;
    });

    if (duplicate) {
      return {
        success: false,
        error: `An item with SKU ID "${skuCode}" already exists in this outlet.`
      };
    }

    const updatedItem = {
      ...item,
      id: item.id || skuCode,
      skuCode: skuCode,
      companyId: activeCompanyId,
      outletId: activeCompanyId,
      status: item.status || 'In Stock'
    };

    setDb(prev => {
      const items = [...(prev.sellingItemsByBrand?.[brandId] || [])];
      let updated;
      const matchIndex = items.findIndex(i => 
        (i.id === updatedItem.id || (item.originalSkuCode && (i.skuCode === item.originalSkuCode || i.id === item.originalSkuCode))) &&
        isItemForCompany(i, activeCompanyId, activeCompany)
      );

      if (matchIndex >= 0) {
        updated = items.map((i, idx) => idx === matchIndex ? { ...i, ...updatedItem } : i);
      } else {
        updated = [...items, updatedItem];
      }

      return {
        ...prev,
        sellingItemsByBrand: {
          ...prev.sellingItemsByBrand,
          [brandId]: updated
        }
      };
    });

    // Row-level insert into relational PostgreSQL table (~250 bytes payload)
    insertItemToDB({ ...updatedItem, brandId, companyId: activeCompanyId }).catch(err => console.warn('Row-level insertItem note:', err));

    return { success: true, item: updatedItem };
  };

  const deleteSellingItem = (brandId, itemId) => {
    setDb(prev => ({
      ...prev,
      sellingItemsByBrand: {
        ...prev.sellingItemsByBrand,
        [brandId]: (prev.sellingItemsByBrand[brandId] || []).filter(i => i.id !== itemId && i.skuCode !== itemId)
      }
    }));
  };

  // Generic item deletion from named DB array (e.g. dairyProcurement, farmsPurchases)
  const deleteNamedRecord = (collectionKey, id) => {
    setDb(prev => ({
      ...prev,
      [collectionKey]: (prev[collectionKey] || []).filter(x => x.id !== id)
    }));
  };

  // Specific entity adders - strictly attached to activeCompanyId
  const addDairyProcurement = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    // Row-level insert into relational PostgreSQL table (~200 bytes payload)
    insertProcurementToDB(record).catch(err => console.warn('Row-level insertProcurement note:', err));
    setDb(prev => ({ ...prev, dairyProcurement: [...(prev.dairyProcurement || []), record] }));
  };
  const addDairyFarmer = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, dairyFarmers: [...(prev.dairyFarmers || []), record] }));
  };
  const addDairyCustomer = (item) => {
    const record = {
      ...item,
      id: Date.now(),
      companyId: activeCompanyId,
      recentDate: item.recentDate || new Date().toISOString().split('T')[0],
      pending: item.pending !== undefined ? Number(item.pending) : 0,
      payments: item.payments || []
    };
    setDb(prev => ({
      ...prev,
      dairyCustomers: [...(prev.dairyCustomers || []), record]
    }));
  };
  const addDeliveryRoute = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, deliveryRoutes: [...(prev.deliveryRoutes || []), record] }));
  };
  const addDairyCattleExpense = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, dairyCattleExpenses: [...(prev.dairyCattleExpenses || []), record] }));
  };
  const addFarmsPurchase = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, farmsPurchases: [...(prev.farmsPurchases || []), record] }));
  };
  const addFarmsSale = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, farmsSales: [...(prev.farmsSales || []), record] }));
  };
  const addPlantrixPurchase = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, plantrixPurchases: [...(prev.plantrixPurchases || []), record] }));
  };
  const addPlantrixSale = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, plantrixSales: [...(prev.plantrixSales || []), record] }));
  };
  const addMixedExpense = (item) => {
    const record = { ...item, id: Date.now(), companyId: activeCompanyId };
    setDb(prev => ({ ...prev, mixedExpenses: [...(prev.mixedExpenses || []), record] }));
  };

  // Export CSV Report Helper - strictly scoped to active company
  const exportCSVReport = (reportType) => {
    let filename = 'report.csv';
    let csvContent = '';

    if (reportType === 'pnl') {
      filename = `Consolidated_PNL_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Brand Name,Sales (INR),Purchases (INR),Expenses (INR),Salaries (INR),Net P&L (INR)\n';
      scopedDb.brands.filter(b => b.active && isBrandSubscribed(b.id)).forEach(b => {
        const fin = getBrandFinancials(b.id);
        csvContent += `"${b.name}",${fin.sales},${fin.purchases},${fin.expenses},${fin.salary},${fin.netPL}\n`;
      });
      csvContent += `\nTotal Consolidated,${groupFinancials.totSales},${groupFinancials.totPurchases},${groupFinancials.totExpenses},${groupFinancials.totSalary},${groupFinancials.netProfitOrLoss}\n`;
    } else if (reportType === 'dues') {
      filename = `Customer_Outstanding_Dues_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Customer Name,Route / Area,Contact Phone,Total Purchases (INR),Pending Dues (INR)\n';
      (scopedDb.dairyCustomers || []).forEach(c => {
        csvContent += `"${c.name}","${c.route || ''}","${c.phone || ''}",${c.bill || 0},${c.pending !== undefined ? c.pending : 0}\n`;
      });
    } else if (reportType === 'procurement') {
      filename = `Dairy_Milk_Procurement_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Date,Shift,Farmer Name,Quantity (L),Fat (%),SNF (%),Rate (INR),Total (INR)\n';
      (scopedDb.dairyProcurement || []).forEach(p => {
        csvContent += `"${p.date}","${p.shift}","${p.farmer}",${p.qty},${p.fat},${p.snf},${p.rate},${p.total}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ERPContext.Provider
      value={{
        db: scopedDb,
        rawDb: db,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        currentManageBrandId,
        setCurrentManageBrandId,
        activeCustomerObj,
        setActiveCustomerObj,
        activeFinancialBrandId,
        setActiveFinancialBrandId,
        activeFinancialType,
        setActiveFinancialType,
        activeBrandDetail,
        setActiveBrandDetail,
        dateFilter,
        setDateFilter,
        dateFilterLabel,
        customRange,
        setCustomRange,
        isDateInRange,
        getBrandFinancials,
        groupFinancials,
        getCustomerFinancials,
        modalState,
        openModal,
        closeModal,
        saveCompanyDetails,
        saveAdminProfile,
        saveNewUser,
        deleteUser,
        saveBrand,
        toggleBrandStatus,
        deleteBrand,
        moveBrandModule,
        saveBrandCustomer,
        deleteBrandCustomer,
        saveSellingItem,
        deleteSellingItem,
        deleteNamedRecord,
        addDairyProcurement,
        addDairyFarmer,
        addDairyCustomer,
        addDeliveryRoute,
        addDairyCattleExpense,
        addFarmsPurchase,
        addFarmsSale,
        addPlantrixPurchase,
        addPlantrixSale,
        addMixedExpense,
        exportCSVReport,
        cloudStatus,
        lastSyncedAt,
        syncError,
        uploadToSupabase,
        downloadFromSupabase,
        currentUser,
        login,
        logout,
        isAuthenticated: Boolean(currentUser),
        isPlatformAdmin,
        activeCompanyId,
        activeCompany,
        companyModules,
        isBrandSubscribed,
        switchActiveCompany,
        createCompany,
        updateCompany,
        toggleCompanyStatus,
        deleteCompany,
        completeFirstTimePasswordSetup,
        platformTeam: db.platformTeam || [
          { id: 'pt-1', name: 'Karthik Reddy', email: 'karthik@bliperp.com', role: 'Platform Director & Founder', phone: '+91 9848012345', status: 'Active', joinedDate: '2026-01-01', lastLogin: 'Today, 05:00 PM' },
          { id: 'pt-2', name: 'Blip Admin', email: 'admin@bliperp.com', role: 'Lead Platform Administrator', phone: '+91 9000011223', status: 'Active', joinedDate: '2026-01-15', lastLogin: 'Today, 04:45 PM' },
          { id: 'pt-3', name: 'Priya Sharma', email: 'priya@bliperp.com', role: 'Platform Operations Manager', phone: '+91 9848055443', status: 'Active', joinedDate: '2026-02-10', lastLogin: 'Yesterday' },
          { id: 'pt-4', name: 'Rahul Verma', email: 'rahul@bliperp.com', role: 'Cloud Infrastructure & DevOps Lead', phone: '+91 9848077665', status: 'Active', joinedDate: '2026-03-01', lastLogin: '3 days ago' },
          { id: 'pt-5', name: 'Master Admin', email: 'superadmin@bliperp.com', role: 'Super Platform Administrator', phone: '+91 9000099887', status: 'Active', joinedDate: '2026-01-01', lastLogin: 'Today' }
        ],
        addPlatformTeamMember: (memberData) => {
          const cleanEmail = (memberData.email || '').trim().toLowerCase();
          const list = db.platformTeam || [];
          if (list.some(m => m.email.toLowerCase() === cleanEmail)) {
            return { success: false, error: 'A platform team member with this email already exists.' };
          }
          const newMember = {
            ...memberData,
            id: 'pt-' + Date.now(),
            email: cleanEmail,
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0],
            lastLogin: 'Never'
          };
          setDb(prev => ({
            ...prev,
            platformTeam: [...(prev.platformTeam || []), newMember]
          }));
          return { success: true, member: newMember };
        },
        deletePlatformTeamMember: (id) => {
          setDb(prev => ({
            ...prev,
            platformTeam: (prev.platformTeam || []).filter(m => m.id !== id)
          }));
        },
        updateUserProfile: (updatedData) => {
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updatedData };
            setCurrentUser(updatedUser);
            localStorage.setItem('bijjam_erp_session', JSON.stringify(updatedUser));
            
            setDb(prev => ({
              ...prev,
              admin: (prev.admin && (!updatedUser.email || prev.admin.email?.toLowerCase() === updatedUser.email?.toLowerCase()))
                ? { ...prev.admin, ...updatedData }
                : prev.admin,
              platformTeam: (prev.platformTeam || []).map(m => 
                (m.email && updatedUser.email && m.email.toLowerCase() === updatedUser.email.toLowerCase()) 
                  ? { ...m, ...updatedData } 
                  : m
              ),
              users: (prev.users || []).map(u => 
                (u.email && updatedUser.email && u.email.toLowerCase() === updatedUser.email.toLowerCase())
                  ? { ...u, ...updatedData }
                  : u
              )
            }));
            return updatedUser;
          }
        },
        updatePlatformUserProfile: (updatedData) => {
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updatedData };
            setCurrentUser(updatedUser);
            localStorage.setItem('bijjam_erp_session', JSON.stringify(updatedUser));
            setDb(prev => ({
              ...prev,
              platformTeam: (prev.platformTeam || []).map(m => m.email.toLowerCase() === updatedUser.email.toLowerCase() ? { ...m, ...updatedData } : m)
            }));
          }
        },
        uploadProfilePicture: (file) => {
          return new Promise((resolve, reject) => {
            if (!file) return reject('No file provided');
            if (!file.type.startsWith('image/')) return reject('Please select an image file');
            
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64Data = e.target.result;
              if (currentUser) {
                const updatedUser = { ...currentUser, avatar: base64Data, profilePic: base64Data };
                setCurrentUser(updatedUser);
                localStorage.setItem('bijjam_erp_session', JSON.stringify(updatedUser));
                
                setDb(prev => ({
                  ...prev,
                  admin: (prev.admin && (!updatedUser.email || prev.admin.email?.toLowerCase() === updatedUser.email?.toLowerCase()))
                    ? { ...prev.admin, avatar: base64Data }
                    : prev.admin,
                  platformTeam: (prev.platformTeam || []).map(m => 
                    (m.email && updatedUser.email && m.email.toLowerCase() === updatedUser.email.toLowerCase()) 
                      ? { ...m, avatar: base64Data } 
                      : m
                  ),
                  users: (prev.users || []).map(u => 
                    (u.email && updatedUser.email && u.email.toLowerCase() === updatedUser.email.toLowerCase())
                      ? { ...u, avatar: base64Data }
                      : u
                  )
                }));
              }
              resolve(base64Data);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });
        }
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

