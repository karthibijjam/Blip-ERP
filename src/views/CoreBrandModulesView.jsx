import React from 'react';
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
  ShieldCheck
} from 'lucide-react';

export default function CoreBrandModulesView() {
  const { db, setActiveTab, switchActiveCompany } = useERP();

  const companies = db.companies || [];

  const dairyCompanies = companies.filter(c => (c.subscribedModules || []).includes('dairy'));
  const fmcgCompanies = companies.filter(c => (c.subscribedModules || []).includes('fmcg'));
  const mixedCompanies = companies.filter(c => (c.subscribedModules || []).includes('mixed'));

  const handleInspectCompany = (companyId) => {
    switchActiveCompany(companyId);
    setActiveTab('company-dashboard');
  };

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
                <span>Back to Console</span>
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Platform Architecture
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2.5">
              <PackageCheck className="w-7 h-7 text-emerald-400" />
              <span>The 3 Core Multi-Brand Modules Offered by Blip ERP</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Blip ERP is architected around 3 foundational operational engines. Each company tenant can be assigned any combination of these specialized modules based on their subscription tier and business model.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active Modules</span>
              <span className="text-xl font-black text-emerald-400">3 Core</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Deployments</span>
              <span className="text-xl font-black text-white">
                {dairyCompanies.length + fmcgCompanies.length + mixedCompanies.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed 3 Core Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Module 1: Dairy Farm Management Module */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition">
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                <Milk className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                MODULE #01
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">1. Dairy Farm Management Module</h3>
              <p className="text-xs text-slate-500 mt-1">
                Optimized for dairy cooperatives, cattle farms, chilling centers, and milk distribution networks.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Capabilities & Features
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Farmer Milk Procurement:</strong> Morning & Evening shifts with live Fat % and SNF % rate auto-calculation.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Farmer Ledgers & Settlement:</strong> Weekly/bi-weekly payout batches with automated advance deduction.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Delivery Route Management:</strong> Door-to-door morning dispatch routes for delivery boys with live run sheets.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Customer Subscriptions:</strong> Daily packet subscriptions (Cow Milk, Buffalo Milk, Curd, Ghee).</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <Building2 size={14} className="text-amber-600" />
                  <span>Subscribed Tenants ({dairyCompanies.length})</span>
                </span>
                <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-mono">
                  Active
                </span>
              </div>
              <div className="space-y-1.5">
                {dairyCompanies.length > 0 ? (
                  dairyCompanies.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                      <button
                        onClick={() => handleInspectCompany(c.id)}
                        className="text-[10px] text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1"
                      >
                        <span>Launch</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No companies subscribed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: FMCG Company Management Module */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition">
          <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-b border-emerald-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-600/20">
                <Boxes className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                MODULE #02
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">2. FMCG Company Management Module</h3>
              <p className="text-xs text-slate-500 mt-1">
                Engineered for fast-moving consumer packaged goods, organic food, retail stores, and wholesale traders.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Capabilities & Features
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>SKU Catalog with Unique IDs:</strong> Per-outlet SKU serials (#SKU-101+), barcode tagging, and unit pricing.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Customer Mobile Directory:</strong> Unique phone number identification, credit tracking, and pending balances.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Retail POS & Sales Invoicing:</strong> Quick cash/UPI/credit billing with printable thermal and tax invoices.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Inventory & Vendor Procurement:</strong> Stock replenishment, minimum stock warnings, and vendor purchases.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <Building2 size={14} className="text-emerald-600" />
                  <span>Subscribed Tenants ({fmcgCompanies.length})</span>
                </span>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono">
                  Active
                </span>
              </div>
              <div className="space-y-1.5">
                {fmcgCompanies.length > 0 ? (
                  fmcgCompanies.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                      <button
                        onClick={() => handleInspectCompany(c.id)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
                      >
                        <span>Launch</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No companies subscribed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Mixed Module (Multi-Brand Overheads) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition">
          <div className="p-6 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-b border-purple-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                MODULE #03
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">3. Mixed Module (Multi-Brand Overheads)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tailored for multi-brand holding groups, shared enterprise infrastructure, and common operational expenses.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Capabilities & Features
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Centralized Staff Wages:</strong> Unified payroll distribution across common drivers, managers, and accountants.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Shared Facilities & Godown Rents:</strong> Cost attribution for common warehouses, processing plants, and cold storage.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Fleet & Logistics Overhead:</strong> Centralized vehicle maintenance, fuel expenses, and inter-outlet deliveries.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span><strong>Consolidated Group Balance Sheet:</strong> Enterprise-wide financial health view combining all brand revenue and shared expenses.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <Building2 size={14} className="text-purple-600" />
                  <span>Subscribed Tenants ({mixedCompanies.length})</span>
                </span>
                <span className="text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-mono">
                  Active
                </span>
              </div>
              <div className="space-y-1.5">
                {mixedCompanies.length > 0 ? (
                  mixedCompanies.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-800 truncate">{c.name}</span>
                      <button
                        onClick={() => handleInspectCompany(c.id)}
                        className="text-[10px] text-purple-700 hover:text-purple-800 font-bold flex items-center space-x-1"
                      >
                        <span>Launch</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No companies subscribed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Bottom Platform Quick Action */}
      <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Need to customize module subscriptions for a company?</h4>
          <p className="text-xs text-slate-500">You can assign any combination of Dairy, FMCG, and Mixed modules from the Multi-Tenant Outlets table.</p>
        </div>
        <button
          onClick={() => setActiveTab('super-admin-portal')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-2"
        >
          <ShieldCheck size={16} />
          <span>Manage Company Outlets</span>
        </button>
      </div>

    </div>
  );
}
