import React, { useState } from 'react';
import { useERP } from '../context/useERP';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  UserPlus, 
  Trash2, 
  CheckCircle, 
  Mail, 
  Phone, 
  Clock, 
  Building,
  KeyRound,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AccountView() {
  const { 
    db, 
    currentUser,
    platformTeam = [],
    addPlatformTeamMember,
    deletePlatformTeamMember,
    updatePlatformUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    saveCompanyDetails, 
    saveAdminProfile, 
    deleteUser, 
    setCurrentManageBrandId, 
    setActiveTab, 
    openModal 
  } = useERP();

  const isPlatformAdmin = Boolean(
    currentUser?.isPlatformAdmin || 
    currentUser?.role === 'Blip ERP Platform Admin' ||
    currentUser?.role === 'Super ERP Platform Admin' ||
    currentUser?.role?.toLowerCase().includes('platform') ||
    currentUser?.email?.endsWith('@bliperp.com')
  );

  // Platform Admin Local Form States
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Blip Admin',
    phone: currentUser?.phone || '+91 9848012345'
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    email: '',
    role: 'Platform Administrator',
    phone: '+91 ',
    password: 'admin123'
  });
  const [teamError, setTeamError] = useState('');
  const [teamSuccess, setTeamSuccess] = useState('');

  // Tenant / Client Company Form States
  const [compForm, setCompForm] = useState({
    name: db.company?.name || 'Bijjam Enterprises Group',
    gst: db.company?.gst || '36AABCB1234F1Z5',
    phone: db.company?.phone || '+91 9848012345',
    address: db.company?.address || 'Plot No. 42, Dairy Farm Road, Jubilee Hills, Hyderabad'
  });

  const [adminForm, setAdminForm] = useState({
    name: db.admin?.name || 'Bijjam Enterprises Admin',
    email: db.admin?.email || 'admin@bijjamenterprises.com',
    phone: db.admin?.phone || '+91 9848012345'
  });

  const [compSaved, setCompSaved] = useState(false);
  const [adminSaved, setAdminSaved] = useState(false);

  // Handler for Platform Admin saving personal profile
  const handleSavePlatformProfile = (e) => {
    e.preventDefault();
    if (updatePlatformUserProfile) {
      updatePlatformUserProfile(profileForm);
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Handler for Adding a Platform Team Member
  const handleAddPlatformMember = (e) => {
    e.preventDefault();
    setTeamError('');
    setTeamSuccess('');

    if (!newTeamMember.name || !newTeamMember.email) {
      setTeamError('Please provide both name and email.');
      return;
    }

    if (addPlatformTeamMember) {
      const res = addPlatformTeamMember(newTeamMember);
      if (res && !res.success) {
        setTeamError(res.error || 'Failed to add team member.');
        return;
      }
    }

    setTeamSuccess(`Successfully added ${newTeamMember.name} to the Platform Admin Team!`);
    setNewTeamMember({
      name: '',
      email: '',
      role: 'Platform Administrator',
      phone: '+91 ',
      password: 'admin123'
    });
    setTimeout(() => {
      setAddTeamModalOpen(false);
      setTeamSuccess('');
    }, 1500);
  };

  const handleDeletePlatformMember = (id, name, email) => {
    if (email.toLowerCase() === currentUser?.email?.toLowerCase()) {
      alert('Security Policy: You cannot delete your own currently active logged-in admin account.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${name} (${email}) from the Blip ERP Platform Admin Team?`)) {
      if (deletePlatformTeamMember) {
        deletePlatformTeamMember(id);
      }
    }
  };

  // Tenant handlers
  const handleSaveCompany = (e) => {
    e.preventDefault();
    saveCompanyDetails(compForm);
    setCompSaved(true);
    setTimeout(() => setCompSaved(false), 3000);
  };

  const handleSaveAdmin = (e) => {
    e.preventDefault();
    saveAdminProfile(adminForm);
    setAdminSaved(true);
    setTimeout(() => setAdminSaved(false), 3000);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Delete this ERP user?')) {
      deleteUser(id);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'BA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ==========================================
  // RENDER: BLIP ERP PLATFORM ADMIN TEAM VIEW
  // ==========================================
  if (isPlatformAdmin) {
    const loggedInPersonName = currentUser?.name || 'Blip Admin';
    const loggedInEmail = currentUser?.email || 'admin@bliperp.com';
    const loggedInRole = currentUser?.role || 'Lead Platform Administrator';
    const loggedInPhone = currentUser?.phone || '+91 9848012345';
    const loggedInInitials = getInitials(loggedInPersonName);
    const loggedInAvatar = currentUser?.avatar || currentUser?.profilePic || (platformTeam || []).find(m => m.email?.toLowerCase() === currentUser?.email?.toLowerCase())?.avatar;

    return (
      <section className="space-y-6 animate-fade-in">
        {/* Top Header Banner */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/20 shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-800">
                  Blip ERP Platform Admin Team & Account
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                  HQ CONSOLE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage internal Blip ERP administration team members, verify active credentials, and edit your profile.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setAddTeamModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-2"
            >
              <UserPlus size={15} />
              <span>+ Add Admin Team Member</span>
            </button>
            <button
              onClick={() => setActiveTab('super-admin-portal')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-2"
            >
              <Shield size={15} className="text-emerald-400" />
              <span>Open Platform Console</span>
            </button>
          </div>
        </div>

        {/* 1. CURRENTLY LOGGED-IN ADMIN PERSON SPOTLIGHT CARD */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side: Logged in status & Admin Identity */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Logged-In Admin Session</span>
              </div>

              <div className="flex items-center space-x-4 sm:space-x-5">
                <div className="relative group shrink-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden border-2 border-emerald-300/40">
                    {loggedInAvatar ? (
                      <img src={loggedInAvatar} alt={loggedInPersonName} className="w-full h-full object-cover" />
                    ) : (
                      loggedInInitials
                    )}
                  </div>
                  <label 
                    htmlFor="account-avatar-upload-file" 
                    title="Upload / Change Profile Picture"
                    className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-semibold"
                  >
                    <i className="fa-solid fa-camera text-base mb-1"></i>
                    <span>Photo</span>
                  </label>
                  <input 
                    id="account-avatar-upload-file" 
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
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {loggedInPersonName}
                  </h3>
                  <p className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck size={16} />
                    <span>{loggedInRole}</span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Blip ERP Cloud Technologies Inc. • Platform Headquarters
                  </p>
                </div>
              </div>

              {/* Verified Credentials Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Mail size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Admin Email</p>
                    <p className="text-xs font-bold text-slate-200 truncate">{loggedInEmail}</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <Phone size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Contact Phone</p>
                    <p className="text-xs font-bold text-slate-200 truncate">{loggedInPhone}</p>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <KeyRound size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Access Level</p>
                    <p className="text-xs font-bold text-emerald-400 truncate">Super Admin (All Tenants)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Quick Profile Update form for the Logged-In Admin */}
            <div className="lg:col-span-5 bg-slate-850/90 border border-slate-700/80 p-5 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck size={14} className="text-emerald-400" />
                  <span>Update Your Admin Profile</span>
                </h4>
                {profileSaved && (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle size={12} />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSavePlatformProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:border-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Your Contact Phone
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:border-emerald-500 outline-none transition"
                  />
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* 2. BLIP ERP PLATFORM ADMIN TEAM ROSTER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-2">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Users size={18} className="text-emerald-600" />
                  <span>Blip ERP Platform Administration Team</span>
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {platformTeam.length} Authorized Team Members
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Authorized Blip ERP employees who have access to manage client companies, tenant databases, and system subscriptions.
              </p>
            </div>

            <button
              onClick={() => setAddTeamModalOpen(true)}
              className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <UserPlus size={14} />
              <span>Add Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Admin Member</th>
                  <th className="p-3.5">Designation & Role</th>
                  <th className="p-3.5">Email & Phone</th>
                  <th className="p-3.5">Active Session</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {platformTeam.map((member) => {
                  const isCurrent = member.email.toLowerCase() === loggedInEmail.toLowerCase();
                  const initials = getInitials(member.name);

                  return (
                    <tr 
                      key={member.id} 
                      className={`transition ${isCurrent ? 'bg-emerald-50/70 border-l-4 border-l-emerald-500 font-medium' : 'hover:bg-slate-50/80'}`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                            isCurrent 
                              ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-md uppercase">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400">Joined {member.joinedDate || '2026'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          isCurrent 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {member.role}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="text-xs font-medium text-slate-700">{member.email}</p>
                        <p className="text-[11px] text-slate-400">{member.phone}</p>
                      </td>

                      <td className="p-3.5">
                        {isCurrent ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            <span>Currently Logged In</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {member.lastLogin ? `Last active: ${member.lastLogin}` : 'Authorized Admin'}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {member.status || 'Active'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        {isCurrent ? (
                          <span className="text-[11px] text-slate-400 font-semibold px-2 py-1 bg-slate-100 rounded-lg">
                            Protected (Self)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeletePlatformMember(member.id, member.name, member.email)}
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg transition"
                            title={`Remove ${member.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ADD PLATFORM TEAM MEMBER MODAL */}
        {addTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-modal-pop">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <UserPlus size={20} />
                  <h3 className="font-bold text-base">Add Platform Admin Member</h3>
                </div>
                <button
                  onClick={() => setAddTeamModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleAddPlatformMember} className="p-6 space-y-4 text-xs">
                {teamError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                    {teamError}
                  </div>
                )}
                {teamSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                    {teamSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-slate-600 font-semibold uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold uppercase mb-1">
                    Platform Email Address (@bliperp.com)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@bliperp.com"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase mb-1">
                      Role / Designation
                    </label>
                    <select
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition bg-white"
                    >
                      <option value="Platform Director & Founder">Platform Director & Founder</option>
                      <option value="Lead Platform Administrator">Lead Platform Administrator</option>
                      <option value="Platform Operations Manager">Platform Operations Manager</option>
                      <option value="Cloud Infrastructure & DevOps Lead">Cloud Infrastructure & DevOps Lead</option>
                      <option value="Super Platform Administrator">Super Platform Administrator</option>
                      <option value="Customer Success Lead">Customer Success Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 9848012345"
                      value={newTeamMember.phone}
                      onChange={(e) => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold uppercase mb-1">
                    Temporary Login Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeamMember.password}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, password: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default credentials: blip123 or admin123</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddTeamModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md transition"
                  >
                    Add Team Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  }

  // ==========================================
  // RENDER: STANDARD CLIENT TENANT ACCOUNT VIEW
  // ==========================================
  return (
    <section className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2.5">
            <i className="fa-solid fa-user-gear text-emerald-600 text-2xl"></i>
            <span>Account, Users & Brand Management (Admin Portal)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage company information, personal admin profile, system ERP users, and brand registry.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openModal('brandModal')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>Create New Brand</span>
          </button>
          <button
            onClick={() => openModal('addUserModal')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Add ERP User</span>
          </button>
        </div>
      </div>

      {/* Manage Company Brands Grid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <i className="fa-solid fa-layer-group text-amber-600"></i>
            <span>Manage Company Brands</span>
          </h3>
          <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-bold">
            Multi-Brand Registry ({db.brands?.length || 0})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(db.brands || []).map(b => (
            <div
              key={b.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 bg-${b.color}-100 text-${b.color}-700 rounded-xl text-lg`}>
                  <i className={b.icon}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{b.name}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {b.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentManageBrandId(b.id);
                  setActiveTab('brand-manage');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                Manage Brand
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Company Details + Admin Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Details Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <i className="fa-solid fa-building text-emerald-600"></i>
              <span>Company Details</span>
            </h3>
            {compSaved && (
              <span className="text-xs text-emerald-600 font-bold animate-pulse">
                Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Company / Group Name
              </label>
              <input
                type="text"
                value={compForm.name}
                onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  GSTIN Number
                </label>
                <input
                  type="text"
                  value={compForm.gst}
                  onChange={(e) => setCompForm({ ...compForm, gst: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Official Contact Phone
                </label>
                <input
                  type="text"
                  value={compForm.phone}
                  onChange={(e) => setCompForm({ ...compForm, phone: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Registered Address
              </label>
              <input
                type="text"
                value={compForm.address}
                onChange={(e) => setCompForm({ ...compForm, address: e.target.value })}
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-sm transition"
              >
                Update Company Details
              </button>
            </div>
          </form>
        </div>

        {/* Admin Profile Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="relative group shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
                  {currentUser?.avatar || currentUser?.profilePic || db.admin?.avatar ? (
                    <img src={currentUser?.avatar || currentUser?.profilePic || db.admin?.avatar} alt={adminForm.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(adminForm.name)
                  )}
                </div>
                <label 
                  htmlFor="tenant-avatar-file-input"
                  title="Upload / Change Profile Picture"
                  className="absolute inset-0 bg-slate-900/60 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px]"
                >
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input 
                  id="tenant-avatar-file-input"
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
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                  <i className="fa-solid fa-user-shield text-blue-600"></i>
                  <span>Admin Profile & Photo</span>
                </h3>
                <label 
                  htmlFor="tenant-avatar-file-input"
                  className="text-[10px] text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  {currentUser?.avatar || db.admin?.avatar ? 'Change photo' : 'Upload photo'}
                </label>
              </div>
            </div>
            {adminSaved && (
              <span className="text-xs text-blue-600 font-bold animate-pulse">
                Profile Updated!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveAdmin} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Admin Full Name
                </label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Login Email ID
                </label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Security Role
                </label>
                <input
                  type="text"
                  value="Super Administrator (Full Access)"
                  disabled
                  className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl p-2.5 text-xs font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
              >
                Save Admin Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* System Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">System Users & Access Roles</h3>
            <p className="text-xs text-slate-500">
              As Admin, you have full control to create, modify, and assign specific operational roles.
            </p>
          </div>
          <button
            onClick={() => openModal('addUserModal')}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition"
          >
            + Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3.5">User Name</th>
                <th className="p-3.5">Email ID</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Brand Access</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(db.users || []).map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-800">{u.name}</td>
                  <td className="p-3.5 text-slate-600 text-xs">{u.email}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 text-xs font-medium">{u.brand}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                      title="Delete user"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {(db.users || []).length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No system users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
