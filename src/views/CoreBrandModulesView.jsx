import React, { useState, useRef } from 'react';
import { useERP } from '../context/useERP';
import { 
  PackageCheck, 
  Milk, 
  Boxes, 
  Briefcase, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Users, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Store,
  Truck,
  Tractor,
  ShoppingCart,
  Pill,
  Fuel,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Activity,
  FileText,
  Clock,
  Check,
  SlidersHorizontal,
  Info,
  BadgeAlert
} from 'lucide-react';

export default function CoreBrandModulesView() {
  const { db, setActiveTab, switchActiveCompany } = useERP();
  
  // Default to Mixed Parent System as requested (First: Mixed, then Dairy, then Retail/FMCG, etc.)
  const [activeSystemId, setActiveSystemId] = useState('mixed-system');
  const scrollContainerRef = useRef(null);

  const companies = db.companies || [];

  const dairyCompanies = companies.filter(c => (c.subscribedModules || []).includes('dairy'));
  const fmcgCompanies = companies.filter(c => (c.subscribedModules || []).includes('fmcg'));
  const mixedCompanies = companies.filter(c => (c.subscribedModules || []).includes('mixed'));

  const handleInspectCompany = (companyId) => {
    switchActiveCompany(companyId);
    setActiveTab('company-dashboard');
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 5 Parent Systems in strict user requested order:
  // 1. Mixed Parent System
  // 2. Dairy Management Parent System
  // 3. Retail, FMCG & Distribution Management Parent System
  // 4. Pharmacy Management Parent System
  // 5. Fuel Station Management Parent System
  const parentSystems = [
    {
      id: 'mixed-system',
      name: 'Mixed Parent System',
      shortName: 'Mixed System',
      category: 'Holding Group Infrastructure',
      tag: 'Common Overheads',
      badge: '1 Core Module',
      icon: Briefcase,
      color: 'purple',
      accentBg: 'bg-purple-600',
      lightBg: 'bg-purple-50',
      borderAccent: 'border-purple-200',
      textColor: 'text-purple-700',
      pillBg: 'bg-purple-100 text-purple-800',
      status: 'Active in Production',
      statusType: 'active',
      description: 'Dedicated parent system engineered for multi-brand holding groups, shared enterprise infrastructure, godowns, inter-brand staff salaries, and consolidated balance sheets.',
      subscribedCount: mixedCompanies.length,
      subscribedTenants: mixedCompanies,
      modules: [
        {
          id: 'mod-mixed-overheads',
          name: 'Mixed Overheads Module',
          type: 'Module for Mixed Parent System',
          typeBadge: 'Module',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          desc: 'Centralized administrative module managing common operational expenses, cross-brand staffing, inter-outlet vehicles, and group-wide financial consolidation.',
          capabilities: [
            {
              title: 'Unified Staff Wages & Central Payroll',
              desc: 'Cross-brand staff salary calculation for shared drivers, operational managers, security, and accountants.',
              icon: Users
            },
            {
              title: 'Shared Facilities & Godown Rents',
              desc: 'Common cost attribution and rent allocation for shared warehouses, processing sheds, and cold storage units.',
              icon: Building2
            },
            {
              title: 'Inter-Outlet Fleet Logistics & Fuel',
              desc: 'Central vehicle maintenance logs, multi-brand fuel expenditure tracking, and inter-outlet logistics dispatch.',
              icon: Truck
            },
            {
              title: 'Consolidated Executive Balance Sheet',
              desc: 'Combined enterprise-wide financial health ledger integrating all outlet revenues with shared overhead costs.',
              icon: CheckCircle2
            }
          ],
          features: [
            'Shared Employee Directory & Unified Wage Slips',
            'Cross-Brand Cost Center Allocation',
            'Fleet Vehicle Logbook & Fuel Expense Hub',
            'Consolidated Multi-Outlet P&L Statements'
          ]
        }
      ]
    },
    {
      id: 'dairy-system',
      name: 'Dairy Management Parent System',
      shortName: 'Dairy System',
      category: 'Dairy Operations & Supply Chain',
      tag: 'Farm, Booth & Delivery',
      badge: '1 Core Module',
      icon: Milk,
      color: 'amber',
      accentBg: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      borderAccent: 'border-amber-200',
      textColor: 'text-amber-700',
      pillBg: 'bg-amber-100 text-amber-800',
      status: 'Active in Production',
      statusType: 'active',
      description: 'Comprehensive agri-dairy management system powering farm procurement, chilling center testing, booth counter billing, and door-to-door morning residential subscription deliveries.',
      subscribedCount: dairyCompanies.length,
      subscribedTenants: dairyCompanies,
      modules: [
        {
          id: 'mod-dairy-farm-booth-delivery',
          name: 'Dairy Farm + Booth + Delivery Management',
          type: 'Module for Dairy Management Parent System',
          typeBadge: 'Module',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'End-to-end specialized module covering morning/evening farmer collections with live Fat % and SNF %, retail dairy booth counters, and daily delivery route run sheets.',
          capabilities: [
            {
              title: 'Dairy Farm & Milk Procurement Hub',
              desc: 'Morning & evening shift milk collections from registered farmers with automated Fat % and SNF % rate chart calculations.',
              icon: Tractor
            },
            {
              title: 'Dairy Booth & Counter POS Sales',
              desc: 'Over-the-counter billing for fresh milk pouches (Cow / Buffalo), curd, ghee, paneer, and butter with instant UPI/cash billing.',
              icon: Store
            },
            {
              title: 'Door-to-Door Delivery Route Dispatch',
              desc: 'Morning line dispatch for delivery personnel with route-wise run sheets, customer drop locations, and bottle counts.',
              icon: Truck
            },
            {
              title: 'Customer Subscriptions & Farmer Settlement',
              desc: 'Recurring daily milk subscriptions, customer advance wallets, and bi-weekly automated farmer payment batches.',
              icon: CheckCircle2
            }
          ],
          features: [
            'Live Fat% & SNF% Dynamic Price Multiplier',
            'Farmer Advance Deduction & Weekly Bill Payouts',
            'Delivery Boy Mobile Run Sheet Integration',
            'Customer Daily Packet Subscription Pausing/Resuming'
          ]
        }
      ]
    },
    {
      id: 'fmcg-system',
      name: 'Retail, FMCG & Distribution Management Parent System',
      shortName: 'Retail & FMCG',
      category: 'Retail, CPG & Supply Chain',
      tag: 'Store & Distribution',
      badge: '1 Core Module',
      icon: Boxes,
      color: 'emerald',
      accentBg: 'bg-emerald-600',
      lightBg: 'bg-emerald-50',
      borderAccent: 'border-emerald-200',
      textColor: 'text-emerald-700',
      pillBg: 'bg-emerald-100 text-emerald-800',
      status: 'Active in Production',
      statusType: 'active',
      description: 'High-speed retail, packaged goods, and wholesale distribution engine equipped with SKU barcode catalogs, customer phone directories, POS invoicing, and inventory replenishment.',
      subscribedCount: fmcgCompanies.length,
      subscribedTenants: fmcgCompanies,
      modules: [
        {
          id: 'mod-fmcg-company',
          name: 'FMCG Company Management',
          type: 'Module for Retail, FMCG & Distribution Management Parent System',
          typeBadge: 'Module',
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          desc: 'Streamlined commercial module for retail outlets, wholesale distributors, organic foods, and packaged consumer brands with SKU barcodes and credit tracking.',
          capabilities: [
            {
              title: 'SKU Catalog & Barcode Serials',
              desc: 'Per-outlet SKU serial numbers (#SKU-101+), barcode tagging, unit packaging, and batch-level categorization.',
              icon: Boxes
            },
            {
              title: 'Customer Mobile Directory & Credit Ledger',
              desc: 'Unique mobile phone identification, credit limit enforcement, and customer purchase history with payment tracking.',
              icon: Users
            },
            {
              title: 'Retail POS & Wholesale Invoicing',
              desc: 'Rapid cash, UPI, and credit billing with automated GST calculation, printable thermal receipts, and tax invoices.',
              icon: ShoppingCart
            },
            {
              title: 'Inventory Procurement & Vendor Inward',
              desc: 'Vendor purchase order management, inward stock logging, and automated minimum inventory reorder warnings.',
              icon: CheckCircle2
            }
          ],
          features: [
            'SKU Barcode Scanner & Thermal POS Billing',
            'Customer Phone Directory with Outstanding Dues',
            'Vendor Purchase Inward & Stock Audit Trail',
            'Multi-Pricing: Retail MRP vs Wholesale Trade Rate'
          ]
        }
      ]
    },
    {
      id: 'pharmacy-system',
      name: 'Pharmacy Management Parent System',
      shortName: 'Pharmacy System',
      category: 'Healthcare & Clinical Retail',
      tag: 'Dispensary & Drugs',
      badge: '1 Core Module',
      icon: Pill,
      color: 'teal',
      accentBg: 'bg-teal-600',
      lightBg: 'bg-teal-50',
      borderAccent: 'border-teal-200',
      textColor: 'text-teal-700',
      pillBg: 'bg-teal-100 text-teal-800',
      status: 'Ready for Deployment',
      statusType: 'ready',
      description: 'Specialized healthcare and pharmaceutical retail engine designed for chemist stores, hospital pharmacies, and medical dispensaries with batch expiry controls and regulatory registers.',
      subscribedCount: 0,
      subscribedTenants: [],
      modules: [
        {
          id: 'mod-pharmacy-dispensary',
          name: 'Pharmacy Retail & Dispensary Management',
          type: 'Module for Pharmacy Management Parent System',
          typeBadge: 'Module',
          badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
          desc: 'Regulatory-compliant pharmaceutical dispensary module managing medicine batches, expiry tracking, prescription counter sales, and doctor referrals.',
          capabilities: [
            {
              title: 'Batch-Wise Inventory & Expiry Control',
              desc: 'Automated alerts for near-expiry and expired medicines, batch numbers, manufacturer codes, and shelf rack locations.',
              icon: Pill
            },
            {
              title: 'Prescription POS & Salt Search Billing',
              desc: 'Fast medicine lookup by brand name or generic chemical composition, doctor prescription logging, and patient billing.',
              icon: ShoppingCart
            },
            {
              title: 'Schedule H / H1 Regulatory Registers',
              desc: 'Mandatory statutory register tracking restricted antibiotic and narcotic drugs with doctor registration details.',
              icon: FileText
            },
            {
              title: 'Pharma Distributor Orders & Expiry Returns',
              desc: 'Automated purchase orders to stockists, inward batch acceptance, and return-to-vendor (RTV) expiry credit notes.',
              icon: CheckCircle2
            }
          ],
          features: [
            'Generic Salt Formulation Substitute Lookup',
            'Automated 30/60/90-Day Expiry Date Alerts',
            'Schedule H/H1 Narcotic Prescription Audit Log',
            'Stockist Purchase Inward & Expiry Return Notes'
          ]
        }
      ]
    },
    {
      id: 'fuel-system',
      name: 'Fuel Station Management Parent System',
      shortName: 'Fuel Station',
      category: 'Petroleum & Fleet Refueling',
      tag: 'Pumps & Tank Dips',
      badge: '1 Core Module',
      icon: Fuel,
      color: 'rose',
      accentBg: 'bg-rose-600',
      lightBg: 'bg-rose-50',
      borderAccent: 'border-rose-200',
      textColor: 'text-rose-700',
      pillBg: 'bg-rose-100 text-rose-800',
      status: 'Ready for Deployment',
      statusType: 'ready',
      description: 'Comprehensive petroleum bunk automation engine for retail fuel stations, dispensing nozzles, underground storage tank dip reconciliation, attendant cash shifts, and fleet credit billing.',
      subscribedCount: 0,
      subscribedTenants: [],
      modules: [
        {
          id: 'mod-fuel-bunk',
          name: 'Fuel Station & Petroleum Bunk Management',
          type: 'Module for Fuel Station Management Parent System',
          typeBadge: 'Module',
          badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
          desc: 'High-precision petroleum bunk operations module managing underground storage tank dips, fuel nozzles, attendant shift cash settlements, and commercial fleet vehicle credit.',
          capabilities: [
            {
              title: 'Underground Tank (UST) Dip Readings',
              desc: 'Daily opening & closing dip tape readings, water paste checks, density measurements, and tanker delivery inward logging.',
              icon: Activity
            },
            {
              title: 'Dispenser Nozzle Totalizer Meters',
              desc: 'Shift-wise mechanical and electronic nozzle meter tracking (Petrol, Diesel, CNG, Premium) with variance calculation.',
              icon: Fuel
            },
            {
              title: 'Attendant Shift Handover & Cash Log',
              desc: 'Pump boy shift-end cash, UPI, POS card reconciliation, credit slips, and automated shortage/excess deduction tracking.',
              icon: Clock
            },
            {
              title: 'Commercial Fleet Credit & Vehicle Tagging',
              desc: 'Corporate fleet owner credit accounts, vehicle registration number logging, driver signatures, and monthly invoicing.',
              icon: Truck
            }
          ],
          features: [
            'Tank Dip-to-Liters Calibration Chart Integration',
            'Shift-Wise Attendant Cash & Digital Reconciliation',
            'Vehicle Number Barcode / RFID Tag Fleet Billing',
            'Lube Oil (2T/4T/Engine Oil) Retail Counter Inventory'
          ]
        }
      ]
    }
  ];

  const currentSystem = parentSystems.find(s => s.id === activeSystemId) || parentSystems[0];
  const CurrentIcon = currentSystem.icon;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* 1. Header Navigation Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('super-admin-portal')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1.5 text-xs font-semibold"
                title="Back to Platform Console"
              >
                <ArrowLeft size={14} />
                <span>Back to Platform Console</span>
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                <Sparkles size={10} className="text-emerald-400" />
                <span>Modules Architecture</span>
              </span>
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <PackageCheck className="w-8 h-8 text-emerald-400" />
              <span>Modules Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Select any Parent System below to inspect its dedicated modules, operational domains, capabilities, and subscribed tenant companies.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Parent Systems</span>
              <span className="text-xl font-black text-emerald-400">5 Systems</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Deployments</span>
              <span className="text-xl font-black text-white">
                {dairyCompanies.length + fmcgCompanies.length + mixedCompanies.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SLIDING NAVIGATION BAR FOR PARENT SYSTEMS                              */}
      {/* ========================================================================= */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-200/90">
        
        {/* Navigation Bar Top Label & Controls Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 px-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Select Parent System:
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
              (Click any system to display its modules)
            </span>
          </div>

          {/* Left / Right Sliding Controls */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition flex items-center justify-center shadow-xs"
              title="Slide Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition flex items-center justify-center shadow-xs"
              title="Slide Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable / Sliding Parent Systems Tabs Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none scroll-smooth focus:outline-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {parentSystems.map((system, idx) => {
            const Icon = system.icon;
            const isSelected = activeSystemId === system.id;

            return (
              <button
                key={system.id}
                onClick={() => setActiveSystemId(system.id)}
                className={`flex-shrink-0 group text-left transition-all duration-200 rounded-2xl px-4 py-3 border flex items-center space-x-3.5 cursor-pointer relative min-w-[240px] sm:min-w-[270px] ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* System Icon in Custom Container */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm ${
                    isSelected
                      ? `${system.accentBg} text-white shadow-md`
                      : `${system.lightBg} ${system.textColor} border ${system.borderAccent}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* System Title and Hierarchy Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : `${system.lightBg} ${system.textColor}`
                      }`}
                    >
                      System #{idx + 1}
                    </span>
                    {system.statusType === 'ready' && (
                      <span className="text-[9px] font-bold text-amber-500">
                        New
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-xs sm:text-sm font-bold truncate leading-tight ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-emerald-700'
                    }`}
                  >
                    {system.name}
                  </h4>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {system.badge}
                  </p>
                </div>

                {/* Active Indicator Dot */}
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC MODULES VIEW (COMES WHEN PARENT SYSTEM IS CLICKED)              */}
      {/* ========================================================================= */}
      <div className="space-y-6 animate-fade-in">
        
        {/* Parent System Overview Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl ${currentSystem.accentBg} text-white flex items-center justify-center font-bold shadow-lg shrink-0`}>
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentSystem.pillBg} border ${currentSystem.borderAccent} font-mono`}>
                  {currentSystem.category}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  currentSystem.statusType === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  ● {currentSystem.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentSystem.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                {currentSystem.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-start md:self-center">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Modules</span>
              <span className="text-lg font-black text-slate-900">
                {currentSystem.modules.length} Module
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tenants</span>
              <span className="text-lg font-black text-emerald-600">
                {currentSystem.subscribedCount} Active
              </span>
            </div>
          </div>
        </div>

        {/* Modules Showcase Cards */}
        <div className="grid grid-cols-1 gap-6">
          {currentSystem.modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Module Header */}
              <div className={`p-6 bg-gradient-to-br from-${currentSystem.color}-500/10 via-${currentSystem.color}-500/5 to-transparent border-b ${currentSystem.borderAccent} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border font-mono ${mod.badgeColor}`}>
                      {mod.typeBadge}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Under: {currentSystem.name}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {mod.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                    {mod.desc}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                    System ID: <code className="font-mono text-slate-900">{currentSystem.id}</code>
                  </span>
                </div>
              </div>

              {/* Module Capabilities & Features Grid */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* 4 Core Operational Domains */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-1.5">
                    <SlidersHorizontal size={14} className="text-slate-500" />
                    <span>Module Operational Scope & Workflows</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mod.capabilities.map((cap, cIdx) => {
                      const CapIcon = cap.icon;
                      return (
                        <div
                          key={cIdx}
                          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition flex items-start space-x-3.5"
                        >
                          <div className={`p-2.5 rounded-xl ${currentSystem.lightBg} ${currentSystem.textColor} shrink-0 mt-0.5 border ${currentSystem.borderAccent}`}>
                            <CapIcon size={16} />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-900">
                              {cap.title}
                            </h5>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {cap.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Feature Highlights */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                    <Sparkles size={14} className="text-emerald-500" />
                    <span>Specialized Module Capabilities</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {mod.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100/90 flex items-start space-x-2 text-xs text-slate-700"
                      >
                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscribed Tenant Companies List */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                      <Building2 size={14} className={currentSystem.textColor} />
                      <span>Subscribed Tenant Outlets ({currentSystem.subscribedCount})</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Multi-Tenant Assignment
                    </span>
                  </div>

                  {currentSystem.subscribedTenants && currentSystem.subscribedTenants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSystem.subscribedTenants.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-900 block truncate">{c.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Code #{c.code || c.companyId}</span>
                          </div>
                          <button
                            onClick={() => handleInspectCompany(c.id)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-slate-300 ${currentSystem.textColor} flex items-center space-x-1 shrink-0 shadow-2xs`}
                          >
                            <span>Inspect</span>
                            <ExternalLink size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <p className="text-xs text-slate-400 italic">
                        No tenant companies subscribed yet. Available for assignment in the Platform Console.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 4. Bottom Platform Action Banner */}
      <div className="p-6 bg-slate-100/90 rounded-3xl border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <span>Modules Management Ready for Full Expansion</span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Parent Systems Active
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            You can customize which Parent Systems and Modules are enabled for each company tenant from the Platform Console.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('super-admin-portal')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-2"
          >
            <ShieldCheck size={16} />
            <span>Manage Company Outlets</span>
          </button>
        </div>
      </div>

    </div>
  );
}
