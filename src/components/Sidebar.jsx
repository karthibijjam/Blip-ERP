import React, { useState } from 'react';
import { useERP } from '../context/useERP';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  PanelLeft,
  PanelLeftClose, 
  PanelLeftOpen, 
  Milk, 
  Boxes, 
  Sparkles, 
  Wallet, 
  Users, 
  ShoppingCart, 
  Receipt, 
  Truck, 
  Tag, 
  SlidersHorizontal, 
  X, 
  Store,
  Layers,
  ChevronLeft,
  ChevronRightCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function Sidebar() {
  const { 
    db, 
    activeTab, 
    setActiveTab, 
    currentManageBrandId, 
    setCurrentManageBrandId,
    activeFinancialBrandId,
    setActiveFinancialBrandId,
    activeFinancialType,
    setActiveFinancialType,
    openModal,
    activeCompany,
    isBrandSubscribed,
    currentUser,
    isPlatformAdmin,
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useERP();

  // Collapsible Operations accordion section inside sidebar
  const [operationsExpanded, setOperationsExpanded] = useState(true);

  // Active brand context for operations (defaults to currentManageBrandId, or activeTab if it's a brand)
  const currentBrandContext = React.useMemo(() => {
    if (activeTab === 'dairy' || activeTab === 'farms' || activeTab === 'plantrix' || activeTab === 'mixed') {
      return activeTab;
    }
    if ((db.brands || []).some(b => b.id === activeTab)) {
      return activeTab;
    }
    if (activeTab === 'financial-subpage' && activeFinancialBrandId) {
      return activeFinancialBrandId;
    }
    return currentManageBrandId || 'dairy';
  }, [activeTab, activeFinancialBrandId, currentManageBrandId, db.brands]);

  // Handle switching brand/outlet from sidebar
  const handleSelectBrand = (brandId) => {
    setCurrentManageBrandId(brandId);
    setActiveFinancialBrandId(brandId);
    if (activeTab === 'financial-subpage') {
      // keep current financial type or default to sales
      setActiveFinancialType(activeFinancialType || 'sales');
    } else if (activeTab === 'brand-customers' || activeTab === 'brand-items' || activeTab === 'brand-manage' || activeTab === 'brand-modules-manage') {
      // stay on current outlet management page for the newly selected brand
    } else {
      setActiveTab(brandId);
    }
    setMobileSidebarOpen(false);
  };

  // Handle opening specific operations hub
  const handleOpenHub = (brandId, financialType) => {
    setCurrentManageBrandId(brandId);
    setActiveFinancialBrandId(brandId);
    setActiveFinancialType(financialType);
    setActiveTab('financial-subpage');
    setMobileSidebarOpen(false);
  };

  // Handle opening outlet directory/setup views
  const handleOpenOutletView = (brandId, viewTab) => {
    setCurrentManageBrandId(brandId);
    setActiveTab(viewTab);
    setMobileSidebarOpen(false);
  };

  const activeBrands = (db.brands || []).filter(b => b.active && isBrandSubscribed(b.id));
  const currentBrandObj = (db.brands || []).find(b => b.id === currentBrandContext) || activeBrands[0] || { id: 'dairy', name: 'Bijjam Dairy', color: 'amber' };

  // Helper to determine if a hub is currently active
  const isHubActive = (brandId, type) => {
    return activeTab === 'financial-subpage' && 
      (activeFinancialBrandId === brandId || currentManageBrandId === brandId) && 
      activeFinancialType === type;
  };

  const isOutletViewActive = (brandId, tab) => {
    return activeTab === tab && currentManageBrandId === brandId;
  };

  // Render Operations Subtree based on active Brand Module
  const renderBrandOperationsTree = () => {
    if (isPlatformAdmin) {
      return (
        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Platform Tenants & HQ
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-1">
              <button
                onClick={() => { setActiveTab('super-admin-portal'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  activeTab === 'super-admin-portal' || activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span className="truncate">Platform Console & Tenants</span>
              </button>
              <button
                onClick={() => { setActiveTab('core-modules'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  activeTab === 'core-modules' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Boxes size={14} className="text-amber-600 shrink-0" />
                <span className="truncate">Core Brand Modules (3)</span>
              </button>
              <button
                onClick={() => { setActiveTab('account'); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  activeTab === 'account' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users size={14} className="text-teal-600 shrink-0" />
                <span className="truncate">Platform Team & My Account</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentBrandContext === 'dairy') {
      return (
        <div className="space-y-3.5 pt-1">
          {/* Group 1: Sales & Delivery */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 flex items-center justify-between">
              <span>Sales & Delivery</span>
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('dairy', 'sales')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('dairy', 'sales') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-cash-register text-emerald-600 text-xs w-4"></i>
                <span className="truncate">Sales Management Hub</span>
              </button>
              <button
                onClick={() => handleOpenHub('dairy', 'delivery')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('dairy', 'delivery') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Truck size={13} className="text-cyan-600 shrink-0" />
                <span className="truncate">Milk Delivery Hub</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('dairy', 'brand-customers')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('dairy', 'brand-customers') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">Customers (Mobile ID)</span>
              </button>
            </div>
          </div>

          {/* Group 2: Farmers & Milk Procurement */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Farmers & Procurement
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('dairy', 'milk_purchases')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('dairy', 'milk_purchases') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-users text-amber-600 text-xs w-4"></i>
                <span className="truncate">Milk Farmers Hub</span>
              </button>
              <button
                onClick={() => handleOpenHub('dairy', 'purchases')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('dairy', 'purchases') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShoppingCart size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">Milk Procurement Records</span>
              </button>
            </div>
          </div>

          {/* Group 3: Expenses, Inventory & SKUs */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Inventory & Expenses
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('dairy', 'expenses')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('dairy', 'expenses') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Receipt size={13} className="text-amber-600 shrink-0" />
                <span className="truncate">Cattle Feed & Expenses</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('dairy', 'brand-items')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('dairy', 'brand-items') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Tag size={13} className="text-emerald-600 shrink-0" />
                <span className="truncate">Milk SKUs & Items (SKU ID)</span>
              </button>
              <button
                onClick={() => handleOpenHub('dairy', 'salary')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('dairy', 'salary') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Wallet size={13} className="text-purple-600 shrink-0" />
                <span className="truncate">Staff Salaries & Payroll</span>
              </button>
            </div>
          </div>

          {/* Group 4: Manage Outlet */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Manage Outlet
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenOutletView('dairy', 'brand-manage')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('dairy', 'brand-manage') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Store size={13} className="text-slate-600 shrink-0" />
                <span className="truncate">Dairy Outlet Setup</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('dairy', 'brand-modules-manage')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('dairy', 'brand-modules-manage') ? 'bg-amber-500/10 text-amber-900 font-bold border border-amber-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal size={13} className="text-slate-600 shrink-0" />
                <span className="truncate">Reorder Operations Hubs</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentBrandContext === 'farms') {
      return (
        <div className="space-y-3.5 pt-1">
          {/* Group 1: Retail & Customers */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Retail & Customers
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('farms', 'sales')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('farms', 'sales') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-cash-register text-emerald-600 text-xs w-4"></i>
                <span className="truncate">Retail Sales Hub</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('farms', 'brand-customers')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('farms', 'brand-customers') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">Farms Customers (Mobile ID)</span>
              </button>
            </div>
          </div>

          {/* Group 2: Inventory & SKUs */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Supplies & Inventory
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('farms', 'purchases')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('farms', 'purchases') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShoppingCart size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">Agro Supplies & Inventory</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('farms', 'brand-items')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('farms', 'brand-items') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Tag size={13} className="text-emerald-600 shrink-0" />
                <span className="truncate">Product SKUs & Items (SKU ID)</span>
              </button>
            </div>
          </div>

          {/* Group 3: Expenses & Payroll */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Costs & Payroll
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('farms', 'expenses')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('farms', 'expenses') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Receipt size={13} className="text-amber-600 shrink-0" />
                <span className="truncate">Operational Expenses Hub</span>
              </button>
              <button
                onClick={() => handleOpenHub('farms', 'salary')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('farms', 'salary') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Wallet size={13} className="text-purple-600 shrink-0" />
                <span className="truncate">Staff & Labor Wages</span>
              </button>
            </div>
          </div>

          {/* Group 4: Manage Outlet */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Manage Outlet
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenOutletView('farms', 'brand-manage')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('farms', 'brand-manage') ? 'bg-emerald-500/10 text-emerald-950 font-bold border border-emerald-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Store size={13} className="text-slate-600 shrink-0" />
                <span className="truncate">Farms Outlet Setup</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentBrandContext === 'plantrix') {
      return (
        <div className="space-y-3.5 pt-1">
          {/* Group 1: Commercial Sales */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Sales & Clients
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('plantrix', 'sales')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('plantrix', 'sales') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <i className="fa-solid fa-cash-register text-cyan-600 text-xs w-4"></i>
                <span className="truncate">Chemical Sales Hub</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('plantrix', 'brand-customers')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('plantrix', 'brand-customers') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">Clients (Mobile ID)</span>
              </button>
            </div>
          </div>

          {/* Group 2: Raw Materials & SKUs */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Materials & SKUs
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('plantrix', 'purchases')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('plantrix', 'purchases') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShoppingCart size={13} className="text-blue-600 shrink-0" />
                <span className="truncate">Raw Materials & Jars Hub</span>
              </button>
              <button
                onClick={() => handleOpenOutletView('plantrix', 'brand-items')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('plantrix', 'brand-items') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Tag size={13} className="text-cyan-600 shrink-0" />
                <span className="truncate">Product SKUs & Cans (SKU ID)</span>
              </button>
            </div>
          </div>

          {/* Group 3: Utility & Wages */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Lab Costs & Wages
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenHub('plantrix', 'expenses')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('plantrix', 'expenses') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Receipt size={13} className="text-amber-600 shrink-0" />
                <span className="truncate">Lab Utility & Packaging</span>
              </button>
              <button
                onClick={() => handleOpenHub('plantrix', 'salary')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive('plantrix', 'salary') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Wallet size={13} className="text-purple-600 shrink-0" />
                <span className="truncate">Technician Wages Hub</span>
              </button>
            </div>
          </div>

          {/* Group 4: Manage Outlet */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
              Manage Outlet
            </p>
            <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
              <button
                onClick={() => handleOpenOutletView('plantrix', 'brand-manage')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isOutletViewActive('plantrix', 'brand-manage') ? 'bg-cyan-500/10 text-cyan-950 font-bold border border-cyan-400/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Store size={13} className="text-slate-600 shrink-0" />
                <span className="truncate">Plantrix Outlet Setup</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default / Dynamic Brand
    const modules = db.brandModules?.[currentBrandContext] || [];
    return (
      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
            {currentBrandObj.name} Hubs
          </p>
          <div className="ml-3 pl-3 border-l-2 border-slate-100 space-y-0.5">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => handleOpenHub(currentBrandContext, m.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isHubActive(currentBrandContext, m.id) ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <i className={`${m.icon} text-${m.color}-600 text-xs w-4`}></i>
                <span className="truncate">{m.name}</span>
              </button>
            ))}
            <button
              onClick={() => handleOpenOutletView(currentBrandContext, 'brand-customers')}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                isOutletViewActive(currentBrandContext, 'brand-customers') ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users size={13} className="text-blue-600 shrink-0" />
              <span className="truncate">Customers (Mobile ID)</span>
            </button>
            <button
              onClick={() => handleOpenOutletView(currentBrandContext, 'brand-items')}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                isOutletViewActive(currentBrandContext, 'brand-items') ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Tag size={13} className="text-emerald-600 shrink-0" />
              <span className="truncate">Selling Items & SKUs</span>
            </button>
            <button
              onClick={() => handleOpenOutletView(currentBrandContext, 'brand-manage')}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                isOutletViewActive(currentBrandContext, 'brand-manage') ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Store size={13} className="text-slate-600 shrink-0" />
              <span className="truncate">Manage Outlet Setup</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = (isMobile = false) => {
    // Mobile drawer is NEVER collapsed; always show all text, brands, and operation hubs
    const isCollapsed = isMobile ? false : sidebarCollapsed;

    return (
      <div className="flex flex-col h-full bg-white select-none">
        {/* 1. Header: Logo + Collapse/Close Toggle */}
        <div className={`p-4 border-b border-slate-100 flex items-center ${isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'} shrink-0`}>
          {!isCollapsed ? (
            isPlatformAdmin && activeTab !== 'company-dashboard' ? (
              <div 
                onClick={() => setActiveTab('super-admin-portal')}
                className="flex items-center space-x-2.5 overflow-hidden cursor-pointer group"
                title="Blip ERP Platform Console"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20 shrink-0 group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-shield-halved text-sm"></i>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-slate-900 text-sm tracking-tight truncate">Blip ERP</span>
                    <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      HQ
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    Platform Management
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20 shrink-0">
                  <i className="fa-solid fa-layer-group text-sm"></i>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-slate-900 text-sm tracking-tight truncate">Blip ERP</span>
                    <span className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
                      #{activeCompany?.companyId || activeCompany?.code || 101}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {activeCompany?.name || 'Enterprise Suite'}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <i className="fa-solid fa-layer-group text-xs"></i>
              </div>
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              title={isCollapsed ? "Expand Navigation Sidebar" : "Collapse Side Navigation"}
              className={`hidden sm:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition items-center justify-center shrink-0 border border-slate-200/80 shadow-xs ${isCollapsed ? 'mt-1' : ''}`}
            >
              {isCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Close Menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* 2. Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
          
          {/* Top Primary Navigation (Costonomy Style) */}
          <div className="space-y-1">
            {isPlatformAdmin ? (
              <>
                {/* Platform Console & Tenants */}
                <button
                  onClick={() => {
                    setActiveTab('super-admin-portal');
                    setMobileSidebarOpen(false);
                  }}
                  title="Platform Console & Tenants"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                    activeTab === 'super-admin-portal' || activeTab === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/40 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck size={17} className={`${(activeTab === 'super-admin-portal' || activeTab === 'dashboard') ? 'text-emerald-600' : 'text-slate-500'} shrink-0`} />
                  {!isCollapsed && <span>Platform Console & Tenants</span>}
                </button>

                {/* Core Brand Modules (3) */}
                <button
                  onClick={() => {
                    setActiveTab('core-modules');
                    setMobileSidebarOpen(false);
                  }}
                  title="Core Brand Modules (3)"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                    activeTab === 'core-modules'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/40 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Boxes size={17} className={`${activeTab === 'core-modules' ? 'text-amber-600' : 'text-slate-500'} shrink-0`} />
                  {!isCollapsed && <span>Core Brand Modules (3)</span>}
                </button>

                {/* Platform Team & My Account */}
                <button
                  onClick={() => {
                    setActiveTab('account');
                    setMobileSidebarOpen(false);
                  }}
                  title="Platform Team & My Account"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    activeTab === 'account'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/40 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users size={17} className={`${activeTab === 'account' ? 'text-teal-600' : 'text-slate-500'} shrink-0`} />
                  {!isCollapsed && <span>Platform Team & My Account</span>}
                </button>
              </>
            ) : (
              <>
                {/* Master Dashboard Link for Outlets */}
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setMobileSidebarOpen(false);
                  }}
                  title="Master Dashboard"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/40 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard size={17} className={`${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'} shrink-0`} />
                  {!isCollapsed && <span>Master Dashboard</span>}
                </button>

                {/* Platform Team & My Account for Outlets */}
                <button
                  onClick={() => {
                    setActiveTab('account');
                    setMobileSidebarOpen(false);
                  }}
                  title="Platform Team & My Account"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    activeTab === 'account'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/40 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users size={17} className={`${activeTab === 'account' ? 'text-teal-600' : 'text-slate-500'} shrink-0`} />
                  {!isCollapsed && <span>Platform Team & My Account</span>}
                </button>

                {/* Financial Reports Modal Shortcut */}
                <button
                  onClick={() => { openModal('reportsModal'); setMobileSidebarOpen(false); }}
                  title="Financial Reports & Analytics"
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <FileSpreadsheet size={17} className="text-slate-500 shrink-0" />
                  {!isCollapsed && <span>Reports & Exports</span>}
                </button>
              </>
            )}
          </div>

          {/* 3. Outlet / Brand Module Switcher (When Expanded) */}
          {!isCollapsed && !isPlatformAdmin && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5 px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Active Outlet / Brand
                </span>
              </div>
              
              <div className="space-y-1">
                {activeBrands.map(b => {
                  const isSelected = currentBrandContext === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBrand(b.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isSelected 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <i className={`${b.icon} ${isSelected ? 'text-white' : `text-${b.color}-600`} text-xs`}></i>
                        <span className="truncate">{b.name}</span>
                      </div>
                      {isSelected && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">ACTIVE</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. OPERATIONS ACCORDION SECTION (Costonomy.ai Reference) */}
          {!isCollapsed ? (
            <div className="pt-3 border-t border-slate-100">
              {/* Operations Header with Toggle Chevron */}
              <div 
                onClick={() => setOperationsExpanded(!operationsExpanded)}
                className="flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer transition select-none"
              >
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-shapes text-emerald-600 text-xs"></i>
                  <span className="uppercase tracking-wider text-[11px]">Operations Hubs</span>
                </div>
                {operationsExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>

              {/* Tree Navigation when Operations is open */}
              {operationsExpanded && (
                <div className="mt-2 animate-fade-in">
                  {renderBrandOperationsTree()}
                </div>
              )}
            </div>
          ) : (
            /* Collapsed Mini Rail for Operations */
            <div className="pt-3 border-t border-slate-100 flex flex-col items-center space-y-2">
              {isPlatformAdmin ? (
                <>
                  <button
                    onClick={() => { setActiveTab('super-admin-portal'); setMobileSidebarOpen(false); }}
                    title="Platform Console & Tenants"
                    className={`p-2 rounded-xl transition ${
                      activeTab === 'super-admin-portal' || activeTab === 'dashboard'
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck size={18} className="text-emerald-600" />
                  </button>
                  <button
                    onClick={() => { setActiveTab('core-modules'); setMobileSidebarOpen(false); }}
                    title="Core Brand Modules (3)"
                    className={`p-2 rounded-xl transition ${
                      activeTab === 'core-modules'
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Boxes size={18} className="text-amber-600" />
                  </button>
                  <button
                    onClick={() => { setActiveTab('account'); setMobileSidebarOpen(false); }}
                    title="Platform Team & My Account"
                    className={`p-2 rounded-xl transition ${
                      activeTab === 'account'
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users size={18} className="text-teal-600" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
                    title="Master Dashboard"
                    className={`p-2 rounded-xl transition ${
                      activeTab === 'dashboard'
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard size={18} className="text-emerald-600" />
                  </button>
                  <button
                    onClick={() => { setActiveTab('account'); setMobileSidebarOpen(false); }}
                    title="Platform Team & My Account"
                    className={`p-2 rounded-xl transition ${
                      activeTab === 'account'
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users size={18} className="text-teal-600" />
                  </button>
                  <button
                    onClick={() => handleOpenHub('dairy', 'sales')}
                    title="Sales Management Hub"
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    <i className="fa-solid fa-cash-register text-emerald-600"></i>
                  </button>
                  <button
                    onClick={() => handleOpenHub('dairy', 'purchases')}
                    title="Procurement & Purchases Hub"
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    <ShoppingCart size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleOpenOutletView(currentBrandContext, 'brand-customers')}
                    title="Customers Directory (Mobile ID)"
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    <Users size={16} className="text-indigo-600" />
                  </button>
                  <button
                    onClick={() => handleOpenOutletView(currentBrandContext, 'brand-items')}
                    title="Selling Items & SKUs (SKU ID)"
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    <Tag size={16} className="text-amber-600" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 5. Footer: User Status & Quick Outlet Pill */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-semibold text-slate-700 truncate">
                  {isPlatformAdmin ? 'Platform HQ Cloud' : currentBrandObj.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isPlatformAdmin ? 'Global Admin' : 'Live Outlet'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Side Navigation Bar (Positioned Below Main Header) */}
      <aside 
        style={{
          top: 'var(--blip-header-height, 108px)',
          height: 'calc(100vh - var(--blip-header-height, 108px))'
        }}
        className={`hidden sm:block sticky shrink-0 border-r border-slate-200/80 bg-white transition-all duration-300 z-30 shadow-sm ${
          sidebarCollapsed ? 'w-18' : 'w-64 lg:w-72'
        }`}
      >
        {renderSidebar(false)}
      </aside>

      {/* Mobile Slide-Out Drawer Navigation Bar */}
      {mobileSidebarOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></div>

          {/* Drawer Content - Always fully expanded on mobile with labels & tree */}
          <div className="relative w-80 max-w-[88vw] h-full bg-white shadow-2xl z-10 animate-slide-right flex flex-col">
            {renderSidebar(true)}
          </div>
        </div>
      )}
    </>
  );
}
