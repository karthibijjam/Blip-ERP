import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../context/useERP';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { 
    db, 
    activeTab, 
    setActiveTab, 
    dateFilter, 
    setDateFilter, 
    dateFilterLabel, 
    openModal,
    currentUser,
    logout,
    activeCompanyId,
    activeCompany,
    isBrandSubscribed,
    switchActiveCompany,
    setMobileSidebarOpen,
    uploadProfilePicture
  } = useERP();

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accountRef = useRef(null);
  const headerRef = useRef(null);

  // Dynamically update CSS variable for header height so sidebar aligns perfectly
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--blip-header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [activeTab, activeCompanyId]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
  };

  const isPlatformAdmin = Boolean(
    currentUser?.isPlatformAdmin || 
    currentUser?.role === 'Blip ERP Platform Admin' ||
    currentUser?.role === 'Super ERP Platform Admin' ||
    currentUser?.role?.toLowerCase().includes('platform') ||
    currentUser?.email?.endsWith('@bliperp.com')
  );

  const adminName = currentUser?.name || (isPlatformAdmin ? 'Karthik Reddy Bijjam' : (db.admin?.name || 'Administrator'));
  const adminEmail = currentUser?.email || (isPlatformAdmin ? 'karthik@bliperp.com' : (db.admin?.email || 'admin@bijjamenterprises.com'));
  const adminRole = currentUser?.role || (isPlatformAdmin ? 'Platform Director & Founder' : 'Company Administrator');
  const userAvatar = currentUser?.avatar || currentUser?.profilePic || (isPlatformAdmin ? (db.platformTeam || []).find(m => m.email?.toLowerCase() === currentUser?.email?.toLowerCase())?.avatar : db.admin?.avatar);
  
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const adminInitials = getInitials(adminName);
  const adminFirstName = adminName.trim().split(/\s+/)[0] || 'User';

  const activeBrands = (db.brands || []).filter(b => b.active);

  return (
    <header ref={headerRef} className="bg-slate-900 text-white shadow-xl sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Banner / Mobile status bar clearance */}
      <div className="w-full px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-3">
        
        {/* Left Section: Sidebar Toggle + Brand Identity */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Sidebar Hamburger Button */}
          <button
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            title="Open Operations Menu"
            className="sm:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <Menu size={18} />
          </button>

          {/* Company Identity / Blip ERP Platform Brand */}
          {isPlatformAdmin ? (
            <div 
              onClick={() => setActiveTab('super-admin-portal')} 
              className="flex items-center space-x-3 cursor-pointer group"
              title="Blip ERP Platform Admin Console"
            >
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-2 rounded-2xl shadow-lg shadow-emerald-900/30 flex items-center justify-center w-10 h-10 transition-all group-hover:scale-105 group-hover:shadow-emerald-500/20 shrink-0">
                <img 
                  src="/blip-erp-logo.png" 
                  alt="Blip ERP" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.parentElement) {
                      e.target.parentElement.innerHTML = '<i class="fa-solid fa-shield-halved text-white text-lg"></i>';
                    }
                  }}
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    Blip ERP
                  </h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                    PLATFORM HQ
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium hidden md:block">
                  Platform Administration & Multi-Tenant Management
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setActiveTab('dashboard')} 
                className="bg-emerald-600 text-white p-2 rounded-2xl shadow-lg shadow-emerald-900/30 font-bold text-lg flex items-center justify-center w-10 h-10 transition-transform hover:scale-105 cursor-pointer shrink-0"
              >
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                    {activeCompany?.name || db.company?.name || 'Bijjam Enterprises Group'}
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                    {activeCompany?.plan || 'Enterprise'}
                  </span>
                  {activeCompany?.serialNumber && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      #{activeCompany.serialNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium hidden md:block">
                  Unified ERP: {activeCompany?.subscribedModules?.join(' • ')?.toUpperCase() || 'MULTI-BRAND'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: Account Dropdown + Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Account Dropdown showing Logged In Admin Person */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition shadow-sm group"
              title={`Logged in as ${adminName} (${adminRole})`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-[11px] shadow-sm overflow-hidden shrink-0 border border-emerald-400/40">
                {userAvatar ? (
                  <img src={userAvatar} alt={adminName} className="w-full h-full object-cover" />
                ) : (
                  <span>{adminInitials}</span>
                )}
              </div>
              <span className="hidden sm:inline max-w-[110px] truncate font-medium">{adminFirstName}</span>
              <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 group-hover:text-slate-200 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {accountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 space-y-2.5 text-slate-800 animate-modal-pop">
                {/* User Identity Card (Blue Box area) */}
                <div className="flex items-center space-x-3 p-2.5 bg-slate-50/90 rounded-xl border border-slate-100">
                  {/* Profile Picture in Circle beside name */}
                  <div className="relative group shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-emerald-500/20">
                      {userAvatar ? (
                        <img src={userAvatar} alt={adminName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="tracking-tight">{adminInitials}</span>
                      )}
                    </div>
                    {/* Upload / Change Photo overlay */}
                    <label 
                      htmlFor="user-avatar-file-input"
                      title="Upload / Change Profile Picture"
                      className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <i className="fa-solid fa-camera text-xs"></i>
                    </label>
                  </div>

                  {/* User Name & Role Below Name */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-snug truncate" title={adminName}>
                      {adminName}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 leading-tight truncate mt-0.5" title={adminRole}>
                      {adminRole}
                    </p>
                    
                    {/* Hidden file input */}
                    <input 
                      id="user-avatar-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && uploadProfilePicture) {
                          try {
                            await uploadProfilePicture(file);
                          } catch (err) {
                            console.error('Failed to upload profile picture', err);
                          }
                        }
                      }}
                    />
                    <label 
                      htmlFor="user-avatar-file-input"
                      className="text-[10px] text-slate-400 hover:text-emerald-600 font-medium cursor-pointer inline-flex items-center gap-1 mt-1 transition-colors"
                    >
                      <i className="fa-solid fa-camera text-[9px]"></i>
                      <span>{userAvatar ? 'Change Photo' : 'Upload Photo'}</span>
                    </label>
                  </div>
                </div>

                {/* Sign Out (user first name) */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center space-x-2.5"
                  >
                    <i className="fa-solid fa-right-from-bracket w-4 text-rose-500"></i>
                    <span>Sign Out ({adminFirstName})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Only for client companies */}
          {!isPlatformAdmin && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Bar: Platform Admin Tenant View vs Client Company Portals */}
      {isPlatformAdmin ? (
        activeTab === 'company-dashboard' ? (
          <div className="bg-slate-800 px-4 border-t border-slate-700/80">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-2 py-1.5 items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <i className="fa-solid fa-building"></i>
                  <span>Viewing Tenant: <strong>{activeCompany?.name || 'Company Portal'}</strong></span>
                </span>
                <button
                  onClick={() => setActiveTab('super-admin-portal')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to Console</span>
                </button>
              </div>
            </div>
          </div>
        ) : null
      ) : (
        <div className="bg-slate-800 px-4 border-t border-slate-700/80">
          <div className="max-w-7xl mx-auto flex space-x-1.5 overflow-x-auto scrollbar-none py-1.5 items-center">
            {/* Master Dashboard Tab */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                  : 'text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-chart-pie"></i>
              <span>Master Dashboard</span>
            </button>

            {/* Active Brands Tabs (filtered by subscribed modules) */}
            {activeBrands.filter(b => isBrandSubscribed(b.id)).map(b => (
              <button
                key={b.id}
                onClick={() => setActiveTab(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === b.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                    : 'text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                <i className={`${b.icon} text-${b.color}-400`}></i>
                <span>{b.name}</span>
              </button>
            ))}

            {/* Account Shortcut Tab in header nav */}
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ml-auto ${
                activeTab === 'account'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-user-gear"></i>
              <span className="hidden md:inline">Admin Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation (when open on small screens for client companies) */}
      {!isPlatformAdmin && mobileMenuOpen && (
        <div className="sm:hidden bg-slate-800/95 border-b border-slate-700 p-4 space-y-2 animate-modal-pop">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Navigation Links</p>
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
          >
            <i className="fa-solid fa-chart-pie w-5"></i>
            <span>Master Dashboard</span>
          </button>
          {activeBrands.map(b => (
            <button
              key={b.id}
              onClick={() => { setActiveTab(b.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 ${activeTab === b.id ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
            >
              <i className={`${b.icon} w-5 text-${b.color}-400`}></i>
              <span>{b.name}</span>
            </button>
          ))}
          <button
            onClick={() => { setActiveTab('account'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 ${activeTab === 'account' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}
          >
            <i className="fa-solid fa-user-gear w-5"></i>
            <span>Admin Settings & Brands</span>
          </button>
        </div>
      )}
    </header>
  );
}
