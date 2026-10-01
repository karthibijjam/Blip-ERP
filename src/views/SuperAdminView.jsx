import React, { useState } from 'react';
import { useERP } from '../context/useERP';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  ExternalLink, 
  Edit3, 
  Power, 
  CheckCircle2, 
  PackageCheck,
  Milk,
  Boxes,
  Briefcase
} from 'lucide-react';

export default function SuperAdminView() {
  const { 
    db, 
    currentUser,
    activeCompanyId, 
    switchActiveCompany, 
    createCompany, 
    updateCompany, 
    toggleCompanyStatus,
    setActiveTab 
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const adminDisplayName = currentUser?.name || 'Administrator';

  // Form State for Onboarding / Editing Company
  const [formData, setFormData] = useState({
    name: '',
    gst: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    plan: 'Professional',
    monthlyFee: 8500,
    renewalDate: '2027-09-30',
    subscribedModules: ['dairy', 'fmcg']
  });

  const companies = db.companies || [];

  // KPI Calculations
  const totalCompanies = companies.length;
  const activeCompaniesCount = companies.filter(c => c.status === 'Active').length;
  const totalMRR = companies
    .filter(c => c.status === 'Active')
    .reduce((acc, c) => acc + (Number(c.monthlyFee) || 0), 0);

  const dairyCount = companies.filter(c => c.subscribedModules?.includes('dairy')).length;
  const fmcgCount = companies.filter(c => c.subscribedModules?.includes('fmcg')).length;
  const mixedCount = companies.filter(c => c.subscribedModules?.includes('mixed')).length;

  const nextCompanyId = React.useMemo(() => {
    const existingNumbers = (companies || []).map(c => {
      const parsed = parseInt(c.companyId || c.code || c.id, 10);
      return isNaN(parsed) ? 0 : parsed;
    });
    return Math.max(100, ...existingNumbers) + 1;
  }, [companies]);

  const handleOpenCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      gst: '',
      owner: '',
      email: '',
      phone: '',
      address: '',
      plan: 'Professional',
      monthlyFee: 8500,
      renewalDate: '2027-09-30',
      subscribedModules: ['dairy', 'fmcg']
    });
    setCompanyModalOpen(true);
  };

  const handleOpenEditModal = (comp) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      gst: comp.gst,
      owner: comp.owner,
      email: comp.email,
      phone: comp.phone,
      address: comp.address || '',
      plan: comp.plan || 'Professional',
      monthlyFee: comp.monthlyFee || 8500,
      renewalDate: comp.renewalDate || '2027-09-30',
      subscribedModules: comp.subscribedModules || ['dairy']
    });
    setCompanyModalOpen(true);
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (editingCompany) {
      const res = updateCompany(editingCompany.id, formData);
      if (res && !res.success) {
        alert(res.error);
        return;
      }
    } else {
      const res = createCompany(formData);
      if (res && !res.success) {
        alert(res.error);
        return;
      }
    }
    setCompanyModalOpen(false);
  };

  const handleLaunchCompanyPortal = (companyId) => {
    switchActiveCompany(companyId);
    setActiveTab('company-dashboard');
  };

  const toggleModuleSelection = (modId) => {
    const current = [...(formData.subscribedModules || [])];
    if (current.includes(modId)) {
      if (current.length === 1) {
        alert('A company must have at least one subscribed module.');
        return;
      }
      setFormData({ ...formData, subscribedModules: current.filter(m => m !== modId) });
    } else {
      setFormData({ ...formData, subscribedModules: [...current, modId] });
    }
  };

  // Filtered Companies
  const filteredCompanies = companies.filter(comp => {
    const matchesSearch = 
      comp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.gst?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = 
      selectedModuleFilter === 'all' || comp.subscribedModules?.includes(selectedModuleFilter);

    const matchesPlan = 
      selectedPlanFilter === 'all' || comp.plan === selectedPlanFilter;

    return matchesSearch && matchesModule && matchesPlan;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-wrap justify-between items-center gap-6">
        <div className="space-y-2.5">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Blip ERP Cloud • Platform Headquarters</span>
            </div>
          </div>

          {/* Hello (User) greeting & Role */}
          <div className="pt-0.5">
            <p className="text-base sm:text-lg font-medium text-emerald-400 flex items-center gap-2">
              <span>Hello, <span className="text-white font-black tracking-tight">{adminDisplayName}</span></span>
              <span className="text-xl inline-block transition-transform hover:scale-125 cursor-default">👋</span>
            </p>
            {currentUser?.role && (
              <div className="mt-1">
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/90 text-emerald-300 border border-emerald-500/30">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Client Companies & Subscriptions Management
          </h2>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Onboard New Company</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Companies */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Client Companies</p>
            <h3 className="text-2xl font-black text-slate-800">{totalCompanies}</h3>
            <span className="text-[11px] text-emerald-600 font-bold">{activeCompaniesCount} Active Tenants</span>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Platform MRR</p>
            <h3 className="text-2xl font-black text-slate-800">₹{totalMRR.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Monthly SaaS billing</span>
          </div>
        </div>

        {/* Subscribed Module Licenses */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Active Module Deployments</p>
            <h3 className="text-2xl font-black text-slate-800">{dairyCount + fmcgCount + mixedCount}</h3>
            <span className="text-[11px] text-purple-600 font-bold">Dairy: {dairyCount} | FMCG: {fmcgCount} | Mixed: {mixedCount}</span>
          </div>
        </div>

        {/* Platform Cloud Sync Status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Multi-Tenant Status</p>
            <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Operational</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Database Synced</span>
          </div>
        </div>

      </div>


      {/* Companies Directory & Subscriptions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-4">
        
        {/* Table Filters & Search */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies, GSTIN, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Filter by Module */}
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Modules</option>
              <option value="dairy">Dairy Farm Module</option>
              <option value="fmcg">FMCG Module</option>
              <option value="mixed">Mixed Overheads Module</option>
            </select>

            {/* Filter by Plan */}
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Professional">Professional</option>
              <option value="Starter">Starter</option>
            </select>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-800 font-bold">{filteredCompanies.length}</span> companies
          </div>

        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-24 text-center">Company ID</th>
                <th className="py-3.5 px-5">Company & GSTIN</th>
                <th className="py-3.5 px-4">Primary Contact</th>
                <th className="py-3.5 px-4">Subscribed Brand Modules</th>
                <th className="py-3.5 px-4">Subscription Plan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Renewal Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCompanies.map((comp) => {
                const isActiveCompany = comp.id === activeCompanyId;
                const isSubscribedToDairy = comp.subscribedModules?.includes('dairy');
                const isSubscribedToFmcg = comp.subscribedModules?.includes('fmcg');
                const isSubscribedToMixed = comp.subscribedModules?.includes('mixed');

                return (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Unique Company Serial ID */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-900 text-emerald-400 border border-slate-700 shadow-sm inline-block">
                        #{comp.companyId || comp.code || 101}
                      </span>
                    </td>

                    {/* Company Identity */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {comp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                            {isActiveCompany && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Active Context
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            GST: {comp.gst}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Primary Contact */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{comp.owner}</p>
                      <p className="text-[11px] text-slate-500">{comp.email}</p>
                      <p className="text-[11px] text-slate-400">{comp.phone}</p>
                    </td>

                    {/* Subscribed Modules */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {isSubscribedToDairy && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                            <Milk className="w-3 h-3 text-amber-600" />
                            <span>Dairy Farm</span>
                          </span>
                        )}
                        {isSubscribedToFmcg && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                            <Boxes className="w-3 h-3 text-emerald-600" />
                            <span>FMCG Suite</span>
                          </span>
                        )}
                        {isSubscribedToMixed && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold text-[10px]">
                            <Briefcase className="w-3 h-3 text-purple-600" />
                            <span>Mixed Overheads</span>
                          </span>
                        )}
                        {(!comp.subscribedModules || comp.subscribedModules.length === 0) && (
                          <span className="text-slate-400 text-[11px]">No active modules</span>
                        )}
                      </div>
                    </td>

                    {/* Plan & Fee */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">
                        {comp.plan || 'Professional'}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        ₹{(comp.monthlyFee || 8500).toLocaleString('en-IN')}/mo
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        comp.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${comp.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{comp.status}</span>
                      </span>
                    </td>

                    {/* Renewal Date */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      {comp.renewalDate || '2027-09-30'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        
                        {/* Launch ERP Portal button */}
                        <button
                          onClick={() => handleLaunchCompanyPortal(comp.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition flex items-center space-x-1.5"
                          title="Open this company's ERP portal view"
                        >
                          <span>Launch Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Company & Subscriptions */}
                        <button
                          onClick={() => handleOpenEditModal(comp)}
                          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
                          title="Configure Subscriptions & Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Toggle Active / Suspended Status */}
                        <button
                          onClick={() => toggleCompanyStatus(comp.id)}
                          className={`p-1.5 rounded-xl border transition ${
                            comp.status === 'Active' 
                              ? 'hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200' 
                              : 'hover:bg-emerald-50 text-rose-500 hover:text-emerald-600 border-slate-200'
                          }`}
                          title={comp.status === 'Active' ? 'Suspend Company' : 'Activate Company'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Onboard / Edit Company Modal */}
      {companyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden animate-modal-pop">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">
                      {editingCompany ? 'Manage Company & Subscriptions' : 'Onboard New Client Company'}
                    </h3>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      ID: #{editingCompany ? (editingCompany.companyId || editingCompany.code || 101) : nextCompanyId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {editingCompany ? 'Configure company details and assign brand modules.' : `New company will be assigned Unique Serial ID #${nextCompanyId}.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCompanyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCompany} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Company Registered Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Krishna Dairy Farms"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    placeholder="36AABCB1234F1Z5"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-medium focus:border-emerald-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Owner & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Primary Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Krishna Murthy"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Admin Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="krishna@skdairy.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9848099887"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Operating Address
                </label>
                <input
                  type="text"
                  placeholder="Plot No. 42, Dairy Farm Road, Jubilee Hills, Hyderabad"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Subscribed Brand Modules Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Subscribed Brand Modules *
                </label>
                <p className="text-xs text-slate-500">
                  Select which modules this company has paid for and will have access to in their ERP portal:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  
                  {/* Module 1: Dairy */}
                  <div 
                    onClick={() => toggleModuleSelection('dairy')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                      formData.subscribedModules?.includes('dairy')
                        ? 'border-amber-500 bg-amber-50/60'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                        <Milk className="w-4 h-4" />
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.subscribedModules?.includes('dairy')}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                      />
                    </div>
                    <h5 className="font-bold text-xs text-slate-800">1. Dairy Farm Module</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Procurement, FAT/SNF, routes, delivery checklists
                    </p>
                  </div>

                  {/* Module 2: FMCG */}
                  <div 
                    onClick={() => toggleModuleSelection('fmcg')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                      formData.subscribedModules?.includes('fmcg')
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.subscribedModules?.includes('fmcg')}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                      />
                    </div>
                    <h5 className="font-bold text-xs text-slate-800">2. FMCG Company Module</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Bulk foods, cleaning supplies, SKU catalog, wholesale bills
                    </p>
                  </div>

                  {/* Module 3: Mixed */}
                  <div 
                    onClick={() => toggleModuleSelection('mixed')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                      formData.subscribedModules?.includes('mixed')
                        ? 'border-purple-500 bg-purple-50/60'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.subscribedModules?.includes('mixed')}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-0"
                      />
                    </div>
                    <h5 className="font-bold text-xs text-slate-800">3. Mixed Module</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Shared overheads, salaries, multi-brand rent & utilities
                    </p>
                  </div>

                </div>
              </div>

              {/* Subscription Plan & Billing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Starter">Starter Plan</option>
                    <option value="Professional">Professional Plan</option>
                    <option value="Enterprise">Enterprise Custom Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Monthly Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    value={formData.renewalDate}
                    onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCompanyModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCompany ? 'Save Changes' : 'Provision Company'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
