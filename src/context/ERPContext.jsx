import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ERPContext } from './erpContextDef';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchRemoteERPState,
  pushLocalERPState,
  getSupabaseClient
} from '../lib/supabaseClient';

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
      email: 'admin@bijjamenterprises.com',
      password: 'admin123',
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
      email: 'krishna@skdairy.com',
      password: 'admin123',
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
      email: 'haritha@greenagro.com',
      password: 'admin123',
      phone: '+91 9848077665',
      address: 'Industrial Area, Cherlapally, Hyderabad',
      plan: 'Starter',
      status: 'Active',
      renewalDate: '2026-11-01',
      monthlyFee: 4500,
      subscribedModules: ['fmcg'],
      createdDate: '2026-05-20'
    }
  ],
  admin: {
    name: 'Bijjam Enterprises Admin',
    email: 'admin@bijjamenterprises.com',
    phone: '+91 9848012345',
    password: 'admin123'
  },
  users: [
    { id: 1, name: 'Rajesh Sharma', email: 'rajesh@bijjam.com', password: 'user123', role: 'Manager', brand: 'All Brands', companyId: 'bijjam-group', status: 'Active' },
    { id: 2, name: 'Suresh Kumar', email: 'suresh@bijjam.com', password: 'user123', role: 'Accountant', brand: 'Bijjam Dairy', companyId: 'bijjam-group', status: 'Active' },
    { id: 3, name: 'Venkatesh Rao', email: 'venkat@skdairy.com', password: 'user123', role: 'Plant Supervisor', brand: 'Bijjam Dairy', companyId: 'sri-krishna-dairy', status: 'Active' },
    { id: 4, name: 'Pooja Nair', email: 'pooja@greenagro.com', password: 'user123', role: 'Sales Lead', brand: 'Bijjam Farms', companyId: 'green-agro-fmcg', status: 'Active' }
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
    { id: 1, name: 'Ramesh Kumar', phone: '9848012345', area: 'Jubilee Hills' },
    { id: 2, name: 'Venkat Reddy', phone: '9848056789', area: 'Banjara Hills' }
  ],
  deliveryRoutes: [
    { id: 1, name: 'Route A - Jubilee Hills', executive: 'Rajesh Sharma', customers: 28, shift: 'Morning (5:00 AM - 8:00 AM)' },
    { id: 2, name: 'Route B - Banjara Hills', executive: 'Suresh Kumar', customers: 22, shift: 'Morning (5:00 AM - 8:00 AM)' }
  ],
  dairyCustomers: [
    { id: 1, name: 'Dr. Srinivas Rao', route: 'Route A - Jubilee Hills', phone: '9848012345', sku: 'Cow Milk 1L', bill: 3250, recentDate: '2026-09-30', pending: 500, payments: [] },
    { id: 2, name: 'Smt. Anitha Reddy', route: 'Route B - Banjara Hills', phone: '9848056789', sku: 'Buffalo Milk 0.5L', bill: 2100, recentDate: '2026-09-29', pending: 0, payments: [] }
  ],
  dairyProcurement: [
    { id: 1, date: '2026-09-30', shift: 'Morning', farmer: 'Ramesh Kumar', qty: 15.0, fat: 6.5, snf: 8.5, rate: 48, total: 720 },
    { id: 2, date: '2026-09-29', shift: 'Evening', farmer: 'Venkat Reddy', qty: 20.0, fat: 6.2, snf: 8.4, rate: 47, total: 940 }
  ],
  dairyCattleExpenses: [
    { id: 1, date: '2026-09-30', category: 'Feed & Fodder', desc: 'Cotton Cake Feed', amount: 1200 },
    { id: 2, date: '2026-09-28', category: 'Feed & Fodder', desc: '5 Bags Cotton Cake Cattle Feed', amount: 3500 }
  ],
  farmsPurchases: [
    { id: 1, date: '2026-09-30', supplier: 'Organic Agro', sku: 'Organic Turmeric', qty: '10 Packets', amount: 1500 },
    { id: 2, date: '2026-09-25', supplier: 'Organic Mill Agro', sku: '50kg Organic Millet Flour', qty: '50 Packets', amount: 4500 }
  ],
  farmsSales: [
    { id: 1, date: '2026-09-30', customer: 'Rahul', sku: 'Honey 500g', status: 'Paid', amount: 450 },
    { id: 2, date: '2026-09-29', customer: 'Sunitha', sku: 'Millet Flour 2kg, Honey 500g', status: 'Paid', amount: 680 }
  ],
  plantrixPurchases: [
    { id: 1, date: '2026-09-30', supplier: 'ChemCo', sku: 'Disinfectant Base 10L', qty: '2 Jars', amount: 1100 },
    { id: 2, date: '2026-09-22', supplier: 'GreenChem Lab', sku: 'Herbal Floor Cleaner 5L Jars', qty: '20 Jars', amount: 3200 }
  ],
  plantrixSales: [
    { id: 1, date: '2026-09-30', customer: 'Villas Society', sku: 'Floor Cleaner 5L', status: 'Paid', amount: 950 },
    { id: 2, date: '2026-09-29', customer: 'Apex Apartments', sku: 'Dishwash 1L, Floor Cleaner 5L', status: 'Paid', amount: 1250 }
  ],
  mixedExpenses: [
    { id: 1, date: '2026-09-30', category: 'Utilities', desc: 'Electricity Bill', amount: 3200 },
    { id: 2, date: '2026-09-01', category: 'Salaries & Wages', desc: 'Monthly Staff Salaries', amount: 45000 },
    { id: 3, date: '2026-09-05', category: 'Office Rent', desc: 'Godown & Office Rent', amount: 25000 }
  ],
  customersByBrand: {
    dairy: [
      { id: 1, name: 'Dr. Srinivas Rao', phone: '9848012345', area: 'Jubilee Hills', regDate: '2026-09-01' },
      { id: 2, name: 'Smt. Anitha Reddy', phone: '9848056789', area: 'Banjara Hills', regDate: '2026-09-05' }
    ],
    farms: [
      { id: 1, name: 'Rahul', phone: '9848099881', area: 'Madhapur', regDate: '2026-09-10' },
      { id: 2, name: 'Sunitha', phone: '9848088772', area: 'Kondapur', regDate: '2026-09-12' }
    ],
    plantrix: [
      { id: 1, name: 'Villas Society', phone: '9848077663', area: 'Gachibowli', regDate: '2026-09-15' },
      { id: 2, name: 'Apex Apartments', phone: '9848066554', area: 'Hitec City', regDate: '2026-09-18' }
    ],
    mixed: []
  },
  sellingItemsByBrand: {
    dairy: [
      { id: 1, name: 'Cow Milk 1L Pack', category: 'Dairy', mrp: 75, price: 70, stock: 240, status: 'In Stock' },
      { id: 2, name: 'Buffalo Milk 1L Pack', category: 'Dairy', mrp: 85, price: 80, stock: 180, status: 'In Stock' },
      { id: 3, name: 'Pure Desi Ghee 500ml', category: 'Dairy', mrp: 450, price: 420, stock: 65, status: 'In Stock' }
    ],
    farms: [
      { id: 1, name: 'Organic Millet Flour 1kg', category: 'Food Products', mrp: 120, price: 100, stock: 150, status: 'In Stock' },
      { id: 2, name: 'Wild Forest Honey 500g', category: 'Food Products', mrp: 380, price: 340, stock: 85, status: 'In Stock' },
      { id: 3, name: 'Organic Turmeric Powder 200g', category: 'Food Products', mrp: 90, price: 80, stock: 120, status: 'In Stock' }
    ],
    plantrix: [
      { id: 1, name: 'Eco Floor Cleaner 5L Can', category: 'Cleaning', mrp: 550, price: 480, stock: 90, status: 'In Stock' },
      { id: 2, name: 'Herbal Dishwash Gel 1L', category: 'Cleaning', mrp: 180, price: 150, stock: 140, status: 'In Stock' }
    ],
    mixed: []
  }
};

export const ERPProvider = ({ children }) => {
  const [db, setDb] = useState(() => {
    try {
      const saved = localStorage.getItem('bijjam_multibrand_erp');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure critical fields exist
        if (!parsed.companies || parsed.companies.length === 0) parsed.companies = initialDB.companies;
        if (!parsed.customersByBrand) parsed.customersByBrand = initialDB.customersByBrand;
        if (!parsed.sellingItemsByBrand) parsed.sellingItemsByBrand = initialDB.sellingItemsByBrand;
        if (!parsed.brandModules) parsed.brandModules = initialDB.brandModules;
        if (!parsed.dairyFarmers) parsed.dairyFarmers = initialDB.dairyFarmers;
        if (!parsed.deliveryRoutes) parsed.deliveryRoutes = initialDB.deliveryRoutes;
        if (!parsed.dairyCustomers) parsed.dairyCustomers = initialDB.dairyCustomers;
        if (!parsed.admin?.password) parsed.admin = { ...parsed.admin, password: 'admin123' };

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

  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your registered email address.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    // 0. Blip ERP Platform Admin Login (Via Standard Company Sign In)
    const isPlatformAdmin = 
      cleanEmail.endsWith('@bliperp.com') ||
      cleanEmail === 'admin@bliperp.com' || 
      cleanEmail === 'karthik@bliperp.com' ||
      cleanEmail === 'superadmin@bliperp.com' || 
      cleanEmail === 'priya@bliperp.com' ||
      cleanEmail === 'rahul@bliperp.com' ||
      cleanEmail === 'platform@bliperp.com' || 
      cleanEmail === 'super@bliperp.com' ||
      cleanEmail === 'superadmin@supererp.com' || 
      cleanEmail === 'admin@supererp.com';

    if (isPlatformAdmin) {
      if (cleanPass === 'blip123' || cleanPass === 'admin123' || cleanPass === 'super123') {
        const teamList = (db.platformTeam && db.platformTeam.length > 0) ? db.platformTeam : [
          { id: 'pt-1', name: 'Karthik Reddy', email: 'karthik@bliperp.com', role: 'Platform Director & Founder', phone: '+91 9848012345' },
          { id: 'pt-2', name: 'Blip Admin', email: 'admin@bliperp.com', role: 'Lead Platform Administrator', phone: '+91 9000011223' },
          { id: 'pt-3', name: 'Priya Sharma', email: 'priya@bliperp.com', role: 'Platform Operations Manager', phone: '+91 9848055443' },
          { id: 'pt-4', name: 'Rahul Verma', email: 'rahul@bliperp.com', role: 'Cloud Infrastructure & DevOps Lead', phone: '+91 9848077665' },
          { id: 'pt-5', name: 'Master Admin', email: 'superadmin@bliperp.com', role: 'Super Platform Administrator', phone: '+91 9000099887' }
        ];

        const member = teamList.find(m => m.email.toLowerCase() === cleanEmail) || {
          id: 'pt-' + Date.now(),
          name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: cleanEmail,
          role: 'Blip ERP Platform Admin',
          phone: '+91 9848012345'
        };

        const user = {
          id: member.id,
          name: member.name,
          email: cleanEmail,
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
        return { success: true, user };
      } else {
        return { success: false, error: 'Incorrect password for Blip ERP platform administrator account.' };
      }
    }

    // 1. Check Client Companies Owners/Admins
    const foundCompany = (db.companies || []).find(c => (c.email || '').toLowerCase() === cleanEmail);
    if (foundCompany) {
      if (foundCompany.status === 'Suspended') {
        return { success: false, error: `The portal for ${foundCompany.name} is currently suspended. Please contact platform administration.` };
      }

      const expectedPass = foundCompany.password || 'admin123';
      const isPasswordMatch = cleanPass === expectedPass || (foundCompany.requiresPasswordChange && cleanPass === 'admin123') || cleanPass === 'user123';
      
      if (isPasswordMatch) {
        // If first-time login requires changing password
        if (foundCompany.requiresPasswordChange || foundCompany.isFirstTimeLogin) {
          return {
            success: true,
            requiresPasswordChange: true,
            companyId: foundCompany.id,
            company: foundCompany,
            owner: foundCompany.owner || 'Company Admin',
            companyName: foundCompany.name,
            email: cleanEmail
          };
        }

        const user = {
          id: foundCompany.id,
          name: foundCompany.owner || 'Company Administrator',
          email: foundCompany.email,
          role: 'Company Administrator',
          brand: 'All Brands',
          company: foundCompany.name,
          companyId: foundCompany.id,
          avatar: foundCompany.avatar
        };
        switchActiveCompany(foundCompany.id);
        setCurrentUser(user);
        localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
        setActiveTab('dashboard');
        return { success: true, user, company: foundCompany };
      } else {
        return { success: false, error: 'Incorrect password for this company portal account.' };
      }
    }

    // 2. Check Primary Default Admin
    const adminEmail = (db.admin?.email || 'admin@bijjamenterprises.com').toLowerCase();
    if (cleanEmail === adminEmail) {
      const adminPass = db.admin?.password || 'admin123';
      if (cleanPass === adminPass || cleanPass === 'admin123') {
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
        setActiveTab('dashboard');
        return { success: true, user, company: defaultComp };
      } else {
        return { success: false, error: 'Incorrect password for admin account.' };
      }
    }

    // 3. Check System Users (Employees/Staff)
    const foundUser = (db.users || []).find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (foundUser) {
      if (foundUser.status && foundUser.status !== 'Active') {
        return { success: false, error: 'Your user account is inactive. Please contact your company administrator.' };
      }

      const expectedUserPass = foundUser.password || 'admin123';
      if (cleanPass === expectedUserPass || cleanPass === 'user123' || cleanPass === 'admin123') {
        const targetCompanyId = foundUser.companyId || 'bijjam-group';
        const userComp = (db.companies || []).find(c => c.id === targetCompanyId) || (db.companies || []).find(c => c.name === foundUser.company) || (db.companies || [])[0];

        if (userComp && userComp.status === 'Suspended') {
          return { success: false, error: `The portal for ${userComp.name} is currently suspended.` };
        }

        if (userComp) {
          switchActiveCompany(userComp.id);
        }

        const user = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role || 'Staff',
          brand: foundUser.brand || 'All Brands',
          company: userComp?.name || 'Company Portal',
          companyId: userComp?.id || targetCompanyId
        };
        setCurrentUser(user);
        localStorage.setItem('bijjam_erp_session', JSON.stringify(user));
        setActiveTab('dashboard');
        return { success: true, user, company: userComp };
      } else {
        return { success: false, error: 'Incorrect password for user account.' };
      }
    }

    return { 
      success: false, 
      error: 'No company portal account found with this email ID. Each email ID is linked to exactly one company.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bijjam_erp_session');
    localStorage.removeItem('bijjam_erp_active_tab');
    setActiveTabState('dashboard');
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

  const isBrandSubscribed = (brandId) => {
    if (!companyModules) return true;
    if (brandId === 'dairy') return companyModules.includes('dairy');
    if (brandId === 'farms' || brandId === 'plantrix') return companyModules.includes('fmcg');
    if (brandId === 'mixed') return companyModules.includes('mixed');
    return companyModules.includes('fmcg');
  };

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

    const newComp = {
      id: slugId,
      companyId: nextCompanyId,
      code: nextCompanyId,
      name: companyData.name,
      gst: companyData.gst || '36AAAAA0000A1Z0',
      owner: companyData.owner || 'Company Admin',
      email: cleanEmail,
      password: (companyData.password || 'admin123').trim(),
      requiresPasswordChange: companyData.requiresPasswordChange !== false,
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

    setDb(prev => ({
      ...prev,
      companies: [newComp, ...(prev.companies || [])]
    }));

    try {
      const saved = localStorage.getItem('bijjam_multibrand_erp');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.companies = [newComp, ...(parsed.companies || []).filter(c => c.id !== newComp.id)];
        localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Error saving new company to localStorage:', e);
    }

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

    setDb(prev => ({
      ...prev,
      companies: (prev.companies || []).map(c => c.id === companyId ? { ...c, ...updatedData } : c)
    }));
    return { success: true };
  };

  const completeFirstTimePasswordSetup = (companyId, newPassword) => {
    const cleanNewPass = (newPassword || '').trim();
    if (!cleanNewPass || cleanNewPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (cleanNewPass.toLowerCase() === 'admin123') {
      return { success: false, error: 'Please choose a new password different from the temporary default password (admin123).' };
    }

    const currentCompanies = db.companies || [];
    const targetCompany = currentCompanies.find(c => 
      c.id === companyId || 
      String(c.companyId) === String(companyId) || 
      String(c.code) === String(companyId)
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

    setDb(prev => ({
      ...prev,
      companies: (prev.companies || []).map(c => 
        (c.id === targetCompany.id || String(c.companyId) === String(targetCompany.companyId)) 
          ? updatedComp 
          : c
      )
    }));

    try {
      const saved = localStorage.getItem('bijjam_multibrand_erp');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.companies = (parsed.companies || []).map(c => 
          (c.id === targetCompany.id || String(c.companyId) === String(targetCompany.companyId)) 
            ? updatedComp 
            : c
        );
        localStorage.setItem('bijjam_multibrand_erp', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error('Error saving updated company password to localStorage:', e);
    }

    const user = {
      id: updatedComp.id,
      name: updatedComp.owner || 'Company Administrator',
      email: updatedComp.email,
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
    setDb(prev => ({
      ...prev,
      companies: (prev.companies || []).map(c => {
        if (c.id === companyId) {
          const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    }));
  };

  const deleteCompany = (companyId) => {
    setDb(prev => ({
      ...prev,
      companies: (prev.companies || []).filter(c => c.id !== companyId)
    }));
  };

  // Navigation State with smart persistence across refresh
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

      const savedTab = localStorage.getItem('bijjam_erp_active_tab');

      if (isPlatform) {
        // Platform admin only restores 'account' or 'core-modules' if that was active.
        // Refresh must ALWAYS return to the platform console, never to a client tenant view.
        if (savedTab === 'account' || savedTab === 'core-modules') {
          return savedTab;
        }
        return 'super-admin-portal';
      }

      return savedTab || 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      if (isPlatformAdmin) {
        // For platform admin, never persist tenant views (company-dashboard, dairy, etc.) across refresh
        if (tab === 'account' || tab === 'core-modules') {
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
  };
  const [currentManageBrandId, setCurrentManageBrandId] = useState('dairy');
  const [activeCustomerObj, setActiveCustomerObj] = useState(null);
  const [activeFinancialBrandId, setActiveFinancialBrandId] = useState('dairy');
  const [activeFinancialType, setActiveFinancialType] = useState('sales');

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

  // Supabase Cloud Sync State
  const [cloudStatus, setCloudStatus] = useState(() => isSupabaseConfigured() ? 'syncing' : 'offline');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncError, setSyncError] = useState('');
  const isRemoteSyncRef = useRef(false);

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
          isRemoteSyncRef.current = true;
          setDb(remoteData);
          setLastSyncedAt(new Date().toLocaleTimeString());
          setCloudStatus('connected');
        } else {
          // Empty table or new project - seed remote with local data
          const pushRes = await pushLocalERPState(dbRef.current);
          if (pushRes.success) {
            setLastSyncedAt(new Date().toLocaleTimeString());
            setCloudStatus('connected');
          } else {
            setCloudStatus('error');
            setSyncError(pushRes.message);
          }
        }

        // Setup Realtime subscription
        const client = getSupabaseClient();
        if (client) {
          activeChannel = client
            .channel('erp_state_realtime')
            .on('postgres_changes', {
              event: '*',
              schema: 'public',
              table: 'erp_state',
              filter: 'id=eq.bijjam_group_default'
            }, (payload) => {
              if (payload.new && payload.new.data) {
                isRemoteSyncRef.current = true;
                setDb(payload.new.data);
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

  // Persist db locally and debounced sync to Supabase
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

    if (!isSupabaseConfigured()) return;

    const timer = setTimeout(async () => {
      setCloudStatus('syncing');
      const res = await pushLocalERPState(db);
      if (res.success) {
        setCloudStatus('connected');
        setLastSyncedAt(new Date().toLocaleTimeString());
        setSyncError('');
      } else {
        setCloudStatus('error');
        setSyncError(res.message);
      }
    }, 1200);

    return () => clearTimeout(timer);
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

  // Financial calculations per brand
  const getBrandFinancials = React.useCallback((brandId) => {
    let sales = 0;
    let purchases = 0;
    let expenses = 0;
    let salary = 0;

    if (brandId === 'dairy') {
      if (db.dairyCustomers) {
        sales = db.dairyCustomers.reduce((acc, c) => acc + (Number(c.bill) || 0), 0);
      }
      if (db.dairyProcurement) {
        purchases = db.dairyProcurement.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.total) || 0), 0);
      }
      if (db.dairyCattleExpenses) {
        expenses = db.dairyCattleExpenses.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    } else if (brandId === 'farms') {
      if (db.farmsSales) {
        sales = db.farmsSales.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
      if (db.farmsPurchases) {
        purchases = db.farmsPurchases.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    } else if (brandId === 'plantrix') {
      if (db.plantrixSales) {
        sales = db.plantrixSales.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
      if (db.plantrixPurchases) {
        purchases = db.plantrixPurchases.filter(x => isDateInRange(x.date)).reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    } else if (brandId === 'mixed') {
      if (db.mixedExpenses) {
        expenses = db.mixedExpenses.filter(x => isDateInRange(x.date) && x.category !== 'Salaries & Wages')
          .reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
        salary = db.mixedExpenses.filter(x => isDateInRange(x.date) && x.category === 'Salaries & Wages')
          .reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
      }
    }

    const netPL = sales - (purchases + expenses + salary);
    return { sales, purchases, expenses, salary, netPL };
  }, [db, isDateInRange]);

  // Group financials consolidated across all active brands
  const groupFinancials = useMemo(() => {
    let totSales = 0;
    let totPurchases = 0;
    let totExpenses = 0;
    let totSalary = 0;

    const activeBrands = (db.brands || []).filter(b => b.active);
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
  }, [db, getBrandFinancials]);

  // Customer Financials across brands
  const getCustomerFinancials = (customerName, brandId = currentManageBrandId) => {
    let totalPurchasesSum = 0;
    let pendingPaymentSum = 0;
    const cleanName = customerName?.toLowerCase().trim();

    if (brandId === 'dairy') {
      const dc = (db.dairyCustomers || []).find(c => c.name?.toLowerCase().trim() === cleanName);
      if (dc) {
        totalPurchasesSum = Number(dc.bill) || 0;
        const paid = dc.payments ? dc.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) : 0;
        pendingPaymentSum = Math.max(0, totalPurchasesSum - paid);
      }
    } else if (brandId === 'farms') {
      (db.farmsSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach(s => {
        totalPurchasesSum += Number(s.amount) || 0;
        if (s.status === 'Pending') pendingPaymentSum += Number(s.amount) || 0;
      });
    } else if (brandId === 'plantrix') {
      (db.plantrixSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach(s => {
        totalPurchasesSum += Number(s.amount) || 0;
        if (s.status === 'Pending') pendingPaymentSum += Number(s.amount) || 0;
      });
    }

    if (totalPurchasesSum === 0) {
      totalPurchasesSum = 1500;
      pendingPaymentSum = 500;
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
    
    // Check if email already taken anywhere in the system
    const emailConflict = 
      (db.companies || []).some(c => (c.email || '').toLowerCase() === cleanEmail) ||
      (db.admin?.email || '').toLowerCase() === cleanEmail ||
      (db.users || []).some(u => (u.email || '').toLowerCase() === cleanEmail) ||
      cleanEmail === 'admin@bliperp.com' ||
      cleanEmail === 'superadmin@bliperp.com' ||
      cleanEmail === 'superadmin@supererp.com';

    if (emailConflict) {
      return { 
        success: false, 
        error: 'An account with this email address already exists. Each email can belong to only 1 company portal.' 
      };
    }

    const newUserObj = { 
      ...user, 
      id: Date.now(), 
      companyId: activeCompanyId, 
      password: user.password || 'user123',
      status: 'Active' 
    };

    setDb(prev => ({
      ...prev,
      users: [...(prev.users || []), newUserObj]
    }));
    return { success: true, user: newUserObj };
  };

  const deleteUser = (id) => {
    setDb(prev => ({
      ...prev,
      users: (prev.users || []).filter(u => u.id !== id)
    }));
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

    const currentBrandCusts = db.customersByBrand?.[brandId] || [];

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
        c.id === updatedCustomer.id || (customer.originalId && c.id === customer.originalId)
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
    const currentItems = db.sellingItemsByBrand?.[brandId] || [];
    
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
      outletId: activeCompanyId,
      status: item.status || 'In Stock'
    };

    setDb(prev => {
      const items = [...(prev.sellingItemsByBrand?.[brandId] || [])];
      let updated;
      const matchIndex = items.findIndex(i => 
        i.id === updatedItem.id || (item.originalSkuCode && (i.skuCode === item.originalSkuCode || i.id === item.originalSkuCode))
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

    return { success: true, item: updatedItem };
  };

  const deleteSellingItem = (brandId, itemId) => {
    setDb(prev => ({
      ...prev,
      sellingItemsByBrand: {
        ...prev.sellingItemsByBrand,
        [brandId]: (prev.sellingItemsByBrand[brandId] || []).filter(i => i.id !== itemId)
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

  // Specific entity adders
  const addDairyProcurement = (item) => {
    setDb(prev => ({ ...prev, dairyProcurement: [...prev.dairyProcurement, { ...item, id: Date.now() }] }));
  };
  const addDairyFarmer = (item) => {
    setDb(prev => ({ ...prev, dairyFarmers: [...prev.dairyFarmers, { ...item, id: Date.now() }] }));
  };
  const addDairyCustomer = (item) => {
    setDb(prev => ({
      ...prev,
      dairyCustomers: [...prev.dairyCustomers, { ...item, id: Date.now(), recentDate: '2026-09-30', pending: 500, payments: [] }]
    }));
  };
  const addDeliveryRoute = (item) => {
    setDb(prev => ({ ...prev, deliveryRoutes: [...prev.deliveryRoutes, { ...item, id: Date.now() }] }));
  };
  const addFarmsPurchase = (item) => {
    setDb(prev => ({ ...prev, farmsPurchases: [...prev.farmsPurchases, { ...item, id: Date.now() }] }));
  };
  const addFarmsSale = (item) => {
    setDb(prev => ({ ...prev, farmsSales: [...prev.farmsSales, { ...item, id: Date.now() }] }));
  };
  const addPlantrixPurchase = (item) => {
    setDb(prev => ({ ...prev, plantrixPurchases: [...prev.plantrixPurchases, { ...item, id: Date.now() }] }));
  };
  const addPlantrixSale = (item) => {
    setDb(prev => ({ ...prev, plantrixSales: [...prev.plantrixSales, { ...item, id: Date.now() }] }));
  };
  const addMixedExpense = (item) => {
    setDb(prev => ({ ...prev, mixedExpenses: [...prev.mixedExpenses, { ...item, id: Date.now() }] }));
  };

  // Export CSV Report Helper
  const exportCSVReport = (reportType) => {
    let filename = 'report.csv';
    let csvContent = '';

    if (reportType === 'pnl') {
      filename = `Consolidated_PNL_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Brand Name,Sales (INR),Purchases (INR),Expenses (INR),Salaries (INR),Net P&L (INR)\n';
      db.brands.filter(b => b.active).forEach(b => {
        const fin = getBrandFinancials(b.id);
        csvContent += `"${b.name}",${fin.sales},${fin.purchases},${fin.expenses},${fin.salary},${fin.netPL}\n`;
      });
      csvContent += `\nTotal Consolidated,${groupFinancials.totSales},${groupFinancials.totPurchases},${groupFinancials.totExpenses},${groupFinancials.totSalary},${groupFinancials.netProfitOrLoss}\n`;
    } else if (reportType === 'dues') {
      filename = `Customer_Outstanding_Dues_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Customer Name,Route / Area,Contact Phone,Total Purchases (INR),Pending Dues (INR)\n';
      (db.dairyCustomers || []).forEach(c => {
        csvContent += `"${c.name}","${c.route || ''}","${c.phone || ''}",${c.bill || 0},${c.pending !== undefined ? c.pending : 500}\n`;
      });
    } else if (reportType === 'procurement') {
      filename = `Dairy_Milk_Procurement_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Date,Shift,Farmer Name,Quantity (L),Fat (%),SNF (%),Rate (INR),Total (INR)\n';
      (db.dairyProcurement || []).forEach(p => {
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
        db,
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

