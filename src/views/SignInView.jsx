import React, { useState } from 'react';
import { useERP } from '../context/useERP';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  HelpCircle,
  KeyRound,
  CheckCircle2,
  User
} from 'lucide-react';
import {
  checkPasswordCriteria,
  validatePasswordPolicy,
  DEFAULT_INITIAL_PASSWORD
} from '../utils/passwordPolicy';

export default function SignInView() {
  const { db, login, completeFirstTimePasswordSetup } = useERP();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // First-Time Login Password Setup States
  const [firstTimeSetupOpen, setFirstTimeSetupOpen] = useState(false);
  const [pendingCompanyData, setPendingCompanyData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const criteria = checkPasswordCriteria(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res && res.requiresPasswordChange) {
        setPendingCompanyData(res);
        setFirstTimeSetupOpen(true);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        return;
      }
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 450);
  };

  const handleFirstTimePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    const validation = validatePasswordPolicy(newPassword);
    if (!validation.isValid) {
      setPasswordError(validation.errorMessage);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (completeFirstTimePasswordSetup && pendingCompanyData) {
        const targetId = pendingCompanyData.targetId || pendingCompanyData.companyId || pendingCompanyData.userId;
        const accountType = pendingCompanyData.accountType || 'company';
        const res = completeFirstTimePasswordSetup(targetId, newPassword, accountType);
        setIsLoading(false);
        if (!res.success) {
          setPasswordError(res.error || 'Failed to update password.');
        }
      }
    }, 400);
  };



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Ambient Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-900/50 blur-[120px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* Left Column: Brand Identity & Feature Showcase */}
        <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left">
          
          {/* Logo Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <i className="fa-solid fa-layer-group text-sm"></i>
            </div>
            <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
              Unified Enterprise Cloud ERP
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {db.company?.name || 'Bijjam Enterprises Group'}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Centralized multi-brand corporate portal. Manage dairy farmer milk procurement, retail sales, daily route delivery fleets, and financial ledgers from a single screen.
            </p>
          </div>

          {/* Core Brand Modules Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
            <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-md hover:border-amber-500/40 transition">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-cow"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Bijjam Dairy</h4>
                  <p className="text-[10px] text-slate-400">Milk, Routes & Farmers</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-md hover:border-emerald-500/40 transition">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Bijjam Farms</h4>
                  <p className="text-[10px] text-slate-400">Bulk Organic Food</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-spray-can-sparkles"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Eco Plantrix</h4>
                  <p className="text-[10px] text-slate-400">Eco Cleaning Liquids</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-md hover:border-purple-500/40 transition">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Mixed Spends</h4>
                  <p className="text-[10px] text-slate-400">Overheads & Payroll</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Multi-Platform Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AES-256 Security</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Live Delivery Fleet</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Web & Android APK</span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Sign In Card */}
        <div className="w-full lg:w-[480px]">
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

            {firstTimeSetupOpen ? (
              /* First-Time Login Password Change Flow */
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-between">
                    <span>First-Time Security Setup</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      New Password Required
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">
                    Welcome, <strong className="text-emerald-400">{pendingCompanyData?.owner || pendingCompanyData?.companyName || 'Partner'}</strong>! Your {pendingCompanyData?.accountType === 'user' ? 'staff user' : 'outlet'} account ({pendingCompanyData?.email}) was provisioned with the temporary default password (<code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">{DEFAULT_INITIAL_PASSWORD}</code>).
                  </p>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Please create your own secure password below meeting all mandatory security rules. You will use this new password for all future logins.</span>
                </div>

                {/* Password Error Banner */}
                {passwordError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start space-x-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleFirstTimePasswordSubmit} className="space-y-4">
                  {/* Enter New Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Enter New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Choose secure new password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError('');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                        title={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Interactive Real-Time Password Checklist */}
                    <div className="mt-2.5 p-3 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-1.5 text-[11px]">
                      <p className="text-slate-400 font-semibold mb-1 text-[10px] uppercase tracking-wider">Mandatory Security Checklist:</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className={`flex items-center space-x-1.5 transition ${criteria.minLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${criteria.minLength ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span>8+ Characters</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition ${criteria.hasUpper ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${criteria.hasUpper ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span>1+ Capital Letter (A-Z)</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition ${criteria.hasNumber ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${criteria.hasNumber ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span>1+ Number (0-9)</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition ${criteria.hasSpecial ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${criteria.hasSpecial ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span>1+ Symbol (!@#$...)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Re-enter New Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Re-enter New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError('');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {confirmPassword && (
                      <div className="mt-1.5 text-[11px] font-medium">
                        {newPassword === confirmPassword ? (
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={13} /> Passwords match!
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1.5">
                            <AlertCircle size={13} /> Passwords do not match
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <i className="fa-solid fa-circle-notch animate-spin text-sm"></i>
                          <span>Securing Account...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Save Password & Enter Dashboard</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFirstTimeSetupOpen(false);
                        setPassword('');
                        setPasswordError('');
                      }}
                      className="w-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white py-2 px-4 rounded-xl text-xs font-semibold transition border border-slate-800"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Standard Enterprise Sign In Form */
              <div>
                <div className="mb-6 space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-between">
                    <span>Enterprise Sign In</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Portal Login
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Sign in with your username or registered email to access your company ERP workspace.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start space-x-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Direct Single-Portal Info Banner */}
                  <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center space-x-2.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Enter your company username or email to access your assigned workspace.</span>
                  </div>

                  {/* Username or Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Username / Corporate Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. admin@bijjam.com, bijjam, or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 font-medium">Keep me signed in</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition duration-150 flex items-center justify-center space-x-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch animate-spin text-sm"></i>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to ERP Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Get A Quick Demo CTA */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2.5">
                  <span className="text-amber-400 font-bold text-sm">⚡</span>
                  <div>
                    <h4 className="font-bold text-slate-200">Get A Quick Demo</h4>
                    <p className="text-[10px] text-slate-400">Request a live guided platform walkthrough</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Blip ERP Cloud
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <HelpCircle className="w-6 h-6" />
              <h3 className="font-bold text-white text-base">Password Recovery Assistance</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Blip ERP corporate portal access and credentials are protected by single-tenant enterprise authentication. Please contact your company portal administrator or organization IT department to reset your account password.
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Copyright Note */}
      <div className="relative z-10 py-4 text-center text-xs text-slate-600">
        © 2026 {db.company?.name || 'Bijjam Enterprises Group'}. All corporate rights reserved.
      </div>
    </div>
  );
}
