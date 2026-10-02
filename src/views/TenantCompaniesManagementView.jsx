import React, { useState, useMemo } from 'react';
import { useERP } from '../context/useERP';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Layers, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  Milk, 
  Boxes, 
  Briefcase, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  TrendingUp, 
  Trash2, 
  Check, 
  X
} from 'lucide-react';
import { DEFAULT_INITIAL_PASSWORD } from '../utils/passwordPolicy';

export default function TenantCompaniesManagementView() {
  const { 
    db, 
    activeCompanyId, 
    switchActiveCompany, 
    createCompany, 
    updateCompany, 
    deleteCompany,
    toggleCompanyStatus,
    setActiveTab 
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showModalPassword, setShowModalPassword] = useState(false);

  // Form State for Onboarding / Editing Company
  const [formData, setFormData] = useState({
    name: '',
    gst: '',
    owner: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: DEFAULT_INITIAL_PASSWORD,
    requiresPasswordChange: true,
    plan: 'Professional',
    monthlyFee: 8500,
    renewalDate: '2027-09-30',
    subscribedModules: ['dairy', 'fmcg']
  });

  const companies = useMemo(() => db.companies || [], [db.companies]);

  // KPI Calculations
  const totalCompanies = companies.length;
  const activeCompaniesCount = companies.filter(c => c.status === 'Active').length;
  const totalMRR = companies
    .filter(c => c.status === 'Active')
    .reduce((acc, c) => acc + (Number(c.monthlyFee) || 0), 0);

  const dairyCount = companies.filter(c => c.subscribedModules?.includes('dairy')).length;
  const fmcgCount = companies.filter(c => c.subscribedModules?.includes('fmcg')).length;
  const mixedCount = companies.filter(c => c.subscribedModules?.includes('mixed')).length;

  const nextCompanyId = useMemo(() => {
    const existingNumbers = (companies || []).map(c => {
      const parsed = parseInt(c.companyId || c.code || c.id, 10);
      return isNaN(parsed) ? 0 : parsed;
    });
    return Math.max(100, ...existingNumbers) + 1;
  }, [companies]);

  const handleOpenCreateModal = () => {
    setEditingCompany(null);
    setShowModalPassword(false);
    setFormData({
      name: '',
      gst: '',
      owner: '',
      username: '',
      email: '',
      phone: '',
      address: '',
      password: DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: true,
      plan: 'Professional',
      monthlyFee: 8500,
      renewalDate: '2027-09-30',
      subscribedModules: ['dairy', 'fmcg']
    });
    setCompanyModalOpen(true);
  };

  const handleOpenEditModal = (comp) => {
    setEditingCompany(comp);
    setShowModalPassword(false);
    setFormData({
      name: comp.name || '',
      gst: comp.gst || '',
      owner: comp.owner || '',
      username: comp.username || comp.email?.split('@')[0] || '',
      email: comp.email || '',
      phone: comp.phone || '',
      address: comp.address || '',
      password: comp.password || DEFAULT_INITIAL_PASSWORD,
      requiresPasswordChange: Boolean(comp.requiresPasswordChange),
      plan: comp.plan || 'Professional',
      monthlyFee: comp.monthlyFee || 8500,
      renewalDate: comp.renewalDate || '2027-09-30',
      subscribedModules: comp.subscribedModules || ['dairy']
    });
    setCompanyModalOpen(true);
  };

  const handleModuleCheckboxToggle = (modKey) => {
    setFormData(prev => {
      const current = prev.subscribedModules || [];
      if (current.includes(modKey)) {
        if (current.length === 1) {
          alert('A company must have at least one subscribed module.');
          return prev;
        }
        return { ...prev, subscribedModules: current.filter(m => m !== modKey) };
      } else {
        return { ...prev, subscribedModules: [...current, modKey] };
      }
    });
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a company name.');
      return;
    }
    if (!formData.email.trim()) {
      alert('Please enter an admin email address.');
      return;
    }

    const autoUsername = formData.username?.trim() || formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (editingCompany) {
      updateCompany(editingCompany.id, {
        name: formData.name.trim(),
        gst: formData.gst.trim(),
        owner: formData.owner.trim(),
        username: autoUsername,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        password: formData.password || DEFAULT_INITIAL_PASSWORD,
        requiresPasswordChange: formData.requiresPasswordChange,
        plan: formData.plan,
        monthlyFee: Number(formData.monthlyFee) || 0,
        renewalDate: formData.renewalDate,
        subscribedModules: formData.subscribedModules
      });
    } else {
      createCompany({
        name: formData.name.trim(),
        gst: formData.gst.trim() || '36AAACB0000Z1Z1',
        owner: formData.owner.trim() || 'Managing Director',
        username: autoUsername,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || '+91 9848011223',
        address: formData.address.trim() || 'Hyderabad, Telangana',
        password: formData.password || DEFAULT_INITIAL_PASSWORD,
        requiresPasswordChange: true,
        plan: formData.plan,
        monthlyFee: Number(formData.monthlyFee) || 8500,
        renewalDate: formData.renewalDate,
        subscribedModules: formData.subscribedModules
      });
    }

    setCompanyModalOpen(false);
  };

  const handleDeleteCompany = (comp) => {
    if (comp.id === 'bijjam-group') {
      alert('The primary flagship enterprise (Bijjam Enterprises Group) cannot be removed.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete and un-onboard "${comp.name}"? This action removes all tenant records.`)) {
      if (deleteCompany) {
        deleteCompany(comp.id);
      }
    }
  };

  const handleLaunchConsole = (companyId) => {
    switchActiveCompany(companyId);
    setActiveTab('company-dashboard');
  };

  // Filtered Companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.name?.toLowerCase().includes(q) ||
        String(c.companyId || c.code || '').includes(q) ||
        c.owner?.toLowerCase().includes(q) ||
        c.username?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.gst?.toLowerCase().includes(q);

      const matchesModule = selectedModuleFilter === 'all' || 
        (c.subscribedModules || []).includes(selectedModuleFilter);

      const matchesPlan = selectedPlanFilter === 'all' || c.plan === selectedPlanFilter;

      const matchesStatus = selectedStatusFilter === 'all' || c.status === selectedStatusFilter;

      return matchesSearch && matchesModule && matchesPlan && matchesStatus;
    });
  }, [companies, searchQuery, selectedModuleFilter, selectedPlanFilter, selectedStatusFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30 flex items-center space-x-1">
                <Sparkles size={10} className="text-blue-400" />
                <span>Multi-Tenant Enterprise Hub</span>
              </span>
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              <span>Tenant Companies Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Complete directory of all business enterprises and tenant companies onboarded onto Blip ERP. Inspect portals, customize module subscriptions, and onboard new organizations.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
            >
              <PlusCircle size={18} />
              <span>Onboard New Company</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Companies</span>
            <span className="text-2xl font-black text-slate-900">{totalCompanies}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active Portals</span>
            <span className="text-2xl font-black text-emerald-600">{activeCompaniesCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Monthly Revenue</span>
            <span className="text-2xl font-black text-slate-900">₹{totalMRR.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active Deployments</span>
            <span className="text-2xl font-black text-slate-900">{dairyCount + fmcgCount + mixedCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, code, owner, @username, email, or GSTIN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Module */}
            <select
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Modules</option>
              <option value="dairy">Dairy Farm + Booth + Delivery</option>
              <option value="fmcg">FMCG Company Management</option>
              <option value="mixed">Mixed Overheads Module</option>
            </select>

            {/* Filter by Plan */}
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Professional">Professional</option>
              <option value="Starter">Starter</option>
            </select>

            {/* Filter by Status */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Portals</option>
              <option value="Suspended">Suspended</option>
            </select>

            {(searchQuery || selectedModuleFilter !== 'all' || selectedPlanFilter !== 'all' || selectedStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModuleFilter('all');
                  setSelectedPlanFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center space-x-1"
              >
                <X size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing <strong>{filteredCompanies.length}</strong> of <strong>{totalCompanies}</strong> onboarded companies</span>
          <span className="text-[11px] font-mono text-slate-400">Next Code: #{nextCompanyId}</span>
        </div>
      </div>

      {/* 4. Onboarded Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCompanies.map((c) => {
          const isCurrentActive = c.id === activeCompanyId;
          const isSuspended = c.status === 'Suspended';
          const subMods = c.subscribedModules || [];

          return (
            <div
              key={c.id}
              className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                isCurrentActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90'
              }`}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100/90 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white font-black text-base flex items-center justify-center shadow-sm shrink-0">
                      {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          #{c.code || c.companyId || c.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                          c.plan === 'Professional' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {c.plan}
                        </span>
                        {isCurrentActive && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active Session
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 truncate mt-1">
                        {c.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 truncate">
                        GST: {c.gst || 'Not Specified'}
                      </p>
                    </div>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleCompanyStatus(c.id)}
                    className={`shrink-0 flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition border ${
                      isSuspended
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={isSuspended ? 'Click to activate portal' : 'Click to suspend portal'}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                    <span>{c.status || 'Active'}</span>
                  </button>
                </div>

                {/* Owner & Contact Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 truncate">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{c.owner || 'Admin'}</span>
                    {c.username && (
                      <span className="text-[11px] text-blue-600 font-mono">@{c.username}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span>{c.phone || '+91 9848012345'}</span>
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{c.address || 'Hyderabad, Telangana'}</span>
                  </div>
                </div>

                {/* Subscribed Modules Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Subscribed Operational Modules:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {subMods.includes('dairy') && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                        <Milk size={12} className="text-amber-600" />
                        <span>Dairy Farm + Booth + Delivery</span>
                      </span>
                    )}
                    {subMods.includes('fmcg') && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                        <Boxes size={12} className="text-emerald-600" />
                        <span>FMCG Company Management</span>
                      </span>
                    )}
                    {subMods.includes('mixed') && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
                        <Briefcase size={12} className="text-purple-600" />
                        <span>Mixed Overheads Module</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Subscription</span>
                  <span className="font-extrabold text-slate-900">₹{(Number(c.monthlyFee) || 0).toLocaleString('en-IN')}/mo</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-2xs"
                    title="Edit Company Details"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={() => handleDeleteCompany(c)}
                    disabled={c.id === 'bijjam-group'}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 transition shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed"
                    title={c.id === 'bijjam-group' ? 'Primary flagship enterprise' : 'Delete Company'}
                  >
                    <Trash2 size={15} />
                  </button>

                  <button
                    onClick={() => handleLaunchConsole(c.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Inspect Portal</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">No Tenant Companies Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No companies match your current search or filter criteria. Try resetting filters or onboard a new enterprise.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition"
          >
            Onboard Company Now
          </button>
        </div>
      )}

      {/* 5. Company Onboarding & Editing Modal */}
      {companyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingCompany ? 'Edit Tenant Company' : 'Onboard New Tenant Company'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingCompany ? `Updating details for ${editingCompany.name}` : `Assigning Code #${nextCompanyId} onto Blip ERP`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setCompanyModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCompany} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Company / Enterprise Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Organic Foods Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* GSTIN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
                    placeholder="36AABCB1234F1Z5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Owner Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Managing Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Portal Username Handle */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Portal Username Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">@</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      placeholder="e.g. royalorganic"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Primary Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@royalorganic.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9848012345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Password Setup */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Initial Temporary Password</label>
                  <div className="relative">
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Admin@123"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showModalPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Defaults to Admin@123. First login requires change.</p>
                </div>

                {/* Plan Tier */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subscription Plan Tier</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="Enterprise">Enterprise Tier (₹15,000/mo)</option>
                    <option value="Professional">Professional Tier (₹8,500/mo)</option>
                    <option value="Starter">Starter Tier (₹4,500/mo)</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Registered Office Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Plot No 12, Industrial Area, Hyderabad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Subscribed Operational Modules Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Assign Operational Modules:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => handleModuleCheckboxToggle('dairy')}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center space-x-2.5 ${
                      formData.subscribedModules.includes('dairy')
                        ? 'bg-amber-50/80 border-amber-300 text-amber-900 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border flex items-center justify-center bg-white">
                      {formData.subscribedModules.includes('dairy') && <Check size={12} className="text-amber-600 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Dairy Module</span>
                      <span className="text-[10px] text-slate-500">Farm + Booth + Delivery</span>
                    </div>
                  </div>

                  <div
                    onClick={() => handleModuleCheckboxToggle('fmcg')}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center space-x-2.5 ${
                      formData.subscribedModules.includes('fmcg')
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border flex items-center justify-center bg-white">
                      {formData.subscribedModules.includes('fmcg') && <Check size={12} className="text-emerald-600 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">FMCG Module</span>
                      <span className="text-[10px] text-slate-500">Retail, POS & Barcodes</span>
                    </div>
                  </div>

                  <div
                    onClick={() => handleModuleCheckboxToggle('mixed')}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center space-x-2.5 ${
                      formData.subscribedModules.includes('mixed')
                        ? 'bg-purple-50/80 border-purple-300 text-purple-900 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md border flex items-center justify-center bg-white">
                      {formData.subscribedModules.includes('mixed') && <Check size={12} className="text-purple-600 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Mixed Module</span>
                      <span className="text-[10px] text-slate-500">Shared Wages & Fleet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCompanyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                >
                  {editingCompany ? 'Save Changes' : 'Confirm & Onboard Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
