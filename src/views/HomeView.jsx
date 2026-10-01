import React, { useState, useRef } from 'react';
import { useERP } from '../context/useERP';
import { 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  AlertCircle,
  HelpCircle,
  Milk,
  Boxes,
  Briefcase,
  Star,
  CheckCircle2,
  Phone,
  MapPin,
  Send,
  Menu,
  X,
  UserPlus
} from 'lucide-react';

export default function HomeView() {
  const { db, login, createCompany } = useERP();

  // Navigation tab for smooth section jumping
  const [activeSection, setActiveSection] = useState('home');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Section refs for smooth scrolling
  const businessesRef = useRef(null);
  const aboutRef = useRef(null);
  const reviewsRef = useRef(null);
  const contactRef = useRef(null);
  const authCardRef = useRef(null);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Create Account / Registration State
  const [regData, setRegData] = useState({
    companyName: '',
    gst: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    plan: 'Professional',
    subscribedModules: ['dairy', 'fmcg'],
    password: ''
  });
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Contact Us Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    moduleInterest: 'dairy',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const scrollToSection = (ref, sectionName) => {
    setActiveSection(sectionName);
    setMobileMenuOpen(false);
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToAuth = (mode = 'login') => {
    setAuthMode(mode);
    setMobileMenuOpen(false);
    if (authCardRef.current) {
      authCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 450);
  };



  // Handle Registration
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.companyName || !regData.email || !regData.ownerName) {
      alert('Please fill out all required fields.');
      return;
    }
    if (regData.subscribedModules.length === 0) {
      alert('Please select at least one module (Dairy Farm, FMCG, or Mixed).');
      return;
    }

    const cleanEmail = (regData.email || '').trim().toLowerCase();
    const emailExists = 
      (db.companies || []).some(c => (c.email || '').toLowerCase() === cleanEmail) ||
      (db.admin?.email || '').toLowerCase() === cleanEmail ||
      (db.users || []).some(u => (u.email || '').toLowerCase() === cleanEmail) ||
      cleanEmail === 'admin@bliperp.com' ||
      cleanEmail === 'superadmin@bliperp.com' ||
      cleanEmail === 'platform@bliperp.com' ||
      cleanEmail === 'superadmin@supererp.com';

    if (emailExists) {
      setErrorMsg('An account with this email ID already exists. Each email can only belong to 1 company portal.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = createCompany({
        name: regData.companyName,
        gst: regData.gst || '36UNREGISTERED',
        owner: regData.ownerName,
        email: cleanEmail,
        password: regData.password || 'admin123',
        phone: regData.phone || '+91 9000000000',
        address: regData.address || 'Corporate Office',
        plan: regData.plan,
        subscribedModules: regData.subscribedModules,
        monthlyFee: regData.plan === 'Enterprise' ? 15000 : regData.plan === 'Starter' ? 4500 : 8500
      });

      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error);
        return;
      }

      setRegSuccessMsg(`Company portal for ${res.company.name} created! Logging you into your ERP portal...`);

      setTimeout(() => {
        login(cleanEmail, regData.password || 'admin123');
      }, 900);
    }, 600);
  };

  const toggleRegModule = (modId) => {
    const list = [...regData.subscribedModules];
    if (list.includes(modId)) {
      if (list.length === 1) return;
      setRegData({ ...regData, subscribedModules: list.filter(m => m !== modId) });
    } else {
      setRegData({ ...regData, subscribedModules: [...list, modId] });
    }
  };

  // Handle Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        moduleInterest: 'dairy',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white font-sans antialiased">
      
      {/* ============================================================ */}
      {/* 1. TOP HEADER NAVIGATION WITH BLIP ERP LOGO IMAGE & NAME     */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          
          {/* Top Left: Company Logo Image + Blip ERP Name Below */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="relative">
              <img 
                src="/blip-erp-logo.png" 
                alt="Blip ERP Logo" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-lg border border-emerald-400/30 object-cover group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-wider text-white mt-1 uppercase group-hover:text-emerald-300 transition-colors">
              Blip ERP
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full text-xs font-semibold">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`px-3 py-1.5 rounded-full transition ${activeSection === 'home' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(businessesRef, 'businesses')}
              className={`px-3 py-1.5 rounded-full transition ${activeSection === 'businesses' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white'}`}
            >
              Businesses We Support
            </button>
            <button
              onClick={() => scrollToSection(aboutRef, 'about')}
              className={`px-3 py-1.5 rounded-full transition ${activeSection === 'about' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white'}`}
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection(reviewsRef, 'reviews')}
              className={`px-3 py-1.5 rounded-full transition ${activeSection === 'reviews' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white'}`}
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection(contactRef, 'contact')}
              className={`px-3 py-1.5 rounded-full transition ${activeSection === 'contact' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white'}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => scrollToAuth('login')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
            >
              Sign In
            </button>
            <button
              onClick={() => scrollToAuth('register')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 p-4 space-y-2 animate-fade-in text-xs font-semibold">
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(businessesRef, 'businesses')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Businesses We Support
            </button>
            <button
              onClick={() => scrollToSection(aboutRef, 'about')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection(reviewsRef, 'reviews')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection(contactRef, 'contact')}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Contact Us
            </button>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH EMBEDDED LOGIN & CREATE ACCOUNT PORTAL  */}
      {/* ============================================================ */}
      <section className="relative pt-8 pb-16 sm:py-20 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[160px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next-Gen Enterprise Platform • Blip ERP</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                One Unified ERP for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Multi-Brand Operations</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Empower your organization with modular cloud intelligence. Seamlessly manage Dairy Milk Procurement, FMCG Wholesale & Retail Inventory, and Cross-Brand Common Overheads from one synchronized command center.
              </p>

              {/* 3 Core Module Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="bg-slate-900/70 border border-amber-500/30 p-3.5 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center space-x-2 mb-1.5 text-amber-400">
                    <Milk className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-200">Dairy Farm Hub</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Milk FAT/SNF, farmer payouts & delivery routes</p>
                </div>

                <div className="bg-slate-900/70 border border-emerald-500/30 p-3.5 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center space-x-2 mb-1.5 text-emerald-400">
                    <Boxes className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-200">FMCG Suite</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Packaged foods, cleaning products, inventory SKUs</p>
                </div>

                <div className="bg-slate-900/70 border border-purple-500/30 p-3.5 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center space-x-2 mb-1.5 text-purple-400">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-200">Mixed Module</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Shared office rent, payroll & consolidated P&L</p>
                </div>
              </div>

              {/* Platform Trust Highlights */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AES-256 Cloud Encrypted</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Android APK Ready</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Supabase Real-Time Engine</span>
                </div>
              </div>

            </div>

            {/* Right Side: Interactive Login / Create Account Card (5 Cols) */}
            <div className="lg:col-span-5" ref={authCardRef}>
              <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                
                {/* Top Glowing Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

                {/* Tab Switcher: Login vs Create Account */}
                <div className="flex rounded-2xl bg-slate-950 p-1 mb-6 border border-slate-800">
                  <button
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      authMode === 'login'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Company Sign In</span>
                  </button>
                  <button
                    onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      authMode === 'register'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </button>
                </div>

                {/* Status Banners */}
                {errorMsg && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2 animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {regSuccessMsg && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{regSuccessMsg}</span>
                  </div>
                )}

                {/* ======================= */}
                {/* A. LOGIN FORM           */}
                {/* ======================= */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    
                    {/* Direct Single-Portal Info Banner */}
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center space-x-2 text-[11px] text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Enter your registered email to directly enter your company portal.</span>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Corporate Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="admin@company.com"
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
                          Forgot?
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

                    {/* Remember me */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-slate-400 font-medium">Keep me signed in</span>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-75"
                    >
                      {isLoading ? (
                        <>
                          <i className="fa-solid fa-circle-notch animate-spin text-sm"></i>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Blip ERP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Get A Quick Demo CTA */}
                    <div className="pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => scrollToSection(contactRef, 'contact')}
                        className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-3 rounded-2xl transition flex items-center justify-between text-xs text-slate-300 hover:text-white group shadow-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-400 font-bold">⚡</span>
                          <span className="font-bold text-slate-200 group-hover:text-emerald-300 transition">Get A Quick Demo</span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Request Walkthrough</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ======================= */}
                {/* B. CREATE ACCOUNT FORM  */}
                {/* ======================= */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Organics Pvt Ltd"
                        value={regData.companyName}
                        onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Owner / Admin *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={regData.ownerName}
                          onChange={(e) => setRegData({ ...regData, ownerName: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="admin@royal.com"
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Subscribed Modules Selection */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Select Modules to Subscribe *
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        <div 
                          onClick={() => toggleRegModule('dairy')}
                          className={`p-2 rounded-xl border cursor-pointer text-center transition ${
                            regData.subscribedModules.includes('dairy') 
                              ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold' 
                              : 'border-slate-800 bg-slate-950 text-slate-500'
                          }`}
                        >
                          <Milk className="w-3.5 h-3.5 mx-auto mb-1" />
                          <span className="text-[10px] block">Dairy Farm</span>
                        </div>
                        <div 
                          onClick={() => toggleRegModule('fmcg')}
                          className={`p-2 rounded-xl border cursor-pointer text-center transition ${
                            regData.subscribedModules.includes('fmcg') 
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                              : 'border-slate-800 bg-slate-950 text-slate-500'
                          }`}
                        >
                          <Boxes className="w-3.5 h-3.5 mx-auto mb-1" />
                          <span className="text-[10px] block">FMCG Goods</span>
                        </div>
                        <div 
                          onClick={() => toggleRegModule('mixed')}
                          className={`p-2 rounded-xl border cursor-pointer text-center transition ${
                            regData.subscribedModules.includes('mixed') 
                              ? 'border-purple-500 bg-purple-500/10 text-purple-300 font-bold' 
                              : 'border-slate-800 bg-slate-950 text-slate-500'
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5 mx-auto mb-1" />
                          <span className="text-[10px] block">Mixed Spends</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Initial Administrator Password
                      </label>
                      <input
                        type="password"
                        placeholder="Create password (default: admin123)"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 mt-3"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isLoading ? 'Provisioning ERP...' : 'Create Company ERP Account'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. BUSINESSES WE SUPPORT SECTION                             */}
      {/* ============================================================ */}
      <section ref={businessesRef} className="py-16 sm:py-24 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Industry Solutions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Businesses We Support with Blip ERP
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Purpose-built operational modules customized for specific supply-chains, procurement models, and retail distribution channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Dairy Farms */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-3xl p-6 space-y-4 hover:border-amber-400 transition group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Milk className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                1. Dairy Farms & Milk Collection
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete field-to-home management. Shift-wise milk procurement from dairy farmers, FAT & SNF rate calculations, morning & evening delivery fleet routes, and automated customer bottle subscriptions.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Morning & Evening farmer collection shifts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fat % and SNF dynamic price grading</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daily route checklists for delivery boys</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-amber-400">Example: Bijjam Dairy, SK Dairy Farms</span>
              </div>
            </div>

            {/* 2. FMCG Goods */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-3xl p-6 space-y-4 hover:border-emerald-400 transition group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                2. FMCG & Consumer Goods
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Designed for retail food packaging, bulk agro produce, organic honey & millet flour, and eco-friendly home cleaning liquids. Manage barcodes, stock inventory, and multi-tier pricing.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SKU catalog with MRP & wholesale margins</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Raw ingredient & packaging procurement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>B2B distributor invoices & retail billing</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-emerald-400">Example: Bijjam Farms, Eco Plantrix</span>
              </div>
            </div>

            {/* 3. Mixed Overheads */}
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-3xl p-6 space-y-4 hover:border-purple-400 transition group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                3. Multi-Brand Enterprise Holdings
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For corporate groups running multiple brands under a single company umbrella. Consolidate common headquarters rent, staff salaries, godown utility bills, and unified financial ledgers.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cross-brand payroll & operational overheads</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Consolidated P&L statement across divisions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Role-based team access & audit controls</span>
                </li>
              </ul>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-purple-400">Example: Mixed Spends Corporate</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ABOUT US SECTION                                          */}
      {/* ============================================================ */}
      <section ref={aboutRef} className="py-16 sm:py-24 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                About Blip ERP
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Architected for Speed, Simplicity & Real-Time Sync
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Traditional ERPs are bloated, expensive, and require months of employee retraining. <strong className="text-white">Blip ERP</strong> was engineered from the ground up to be modular, lightning fast, and cloud-synchronized across mobile APKs and desktop computers.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Whether you are a dairy business recording 5 AM milk yields in the village or an FMCG brand shipping orders across cities, Blip ERP eliminates manual paperwork, prevents stock leaks, and gives you instant financial clarity.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <h4 className="text-2xl font-black text-emerald-400">350K+</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Liters of Milk Tracked</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <h4 className="text-2xl font-black text-teal-400">99.98%</h4>
                  <p className="text-xs text-slate-400 mt-0.5">On-Time Route Deliveries</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Why Enterprises Choose Blip ERP</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h5 className="font-bold text-slate-200">Pay Only For What You Use</h5>
                    <p className="text-slate-400 mt-0.5">Activate only Dairy, FMCG, or Mixed modules according to your operational needs.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h5 className="font-bold text-slate-200">Zero Offline Latency</h5>
                    <p className="text-slate-400 mt-0.5">Works smoothly even when delivery drivers pass through rural areas without cell signal.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h5 className="font-bold text-slate-200">One-Tap Native Android APK Conversion</h5>
                    <p className="text-slate-400 mt-0.5">Ready to build into installable mobile apps via Capacitor with safe-area notch support.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. REVIEWS & TESTIMONIALS SECTION                            */}
      {/* ============================================================ */}
      <section ref={reviewsRef} className="py-16 sm:py-24 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Customer Testimonials
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Trusted by Farm Owners & FMCG Leaders
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how operations teams transformed daily chaos into streamlined, profitable workflows with Blip ERP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Procuring 2,500L of milk daily from 85 farmers was a nightmare with paper registers. Blip ERP automated our Fat and SNF pricing and morning route checklists in 48 hours."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-sm">
                  SR
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Dr. Srinivas Rao</h5>
                  <p className="text-[10px] text-slate-400">Owner, Bijjam Dairy Operations</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Managing 150+ packaged food SKUs, honey jars, and retail distributor bills became effortless. Our stock wastage dropped by 38% in the first quarter itself."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">
                  HR
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Haritha Reddy</h5>
                  <p className="text-[10px] text-slate-400">Founder, Green Agro Naturals</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "The route delivery checklist alone saved us 2 hours every single morning. Delivery boys mark bottles delivered on their phones and dues calculate automatically."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-sm">
                  KM
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Krishna Murthy</h5>
                  <p className="text-[10px] text-slate-400">Director, Sri Krishna Dairy</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CONTACT US SECTION                                        */}
      {/* ============================================================ */}
      <section ref={contactRef} className="py-16 sm:py-24 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Get in Touch
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Contact the Blip ERP Team
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Have questions about module subscriptions, custom onboarding, or hardware integrations? Our technical team is here to assist.
              </p>

              <div className="space-y-4 pt-3 text-xs text-slate-300">
                <div className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-white">Corporate Headquarters</h6>
                    <p className="text-slate-400">Plot No. 42, Jubilee Hills, Hyderabad, India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-white">Enterprise Inquiries</h6>
                    <p className="text-slate-400">contact@bliperp.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-white">Support Helpline</h6>
                    <p className="text-slate-400">+91 98480 12345 (24/7 Live)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                  Request an ERP Demo or Custom Plan
                </h3>

                {contactSubmitted ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">Thank You for Reaching Out!</h4>
                    <p className="text-xs text-slate-300">
                      Our Blip ERP solutions specialist will contact you within 2 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@business.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Company / Farm Name
                        </label>
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Primary Module of Interest
                        </label>
                        <select
                          value={contactForm.moduleInterest}
                          onChange={(e) => setContactForm({ ...contactForm, moduleInterest: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="dairy">Dairy Farm Module</option>
                          <option value="fmcg">FMCG & Consumer Goods Module</option>
                          <option value="mixed">Mixed Overheads & Holding Company</option>
                          <option value="all">All 3 Modules (Complete Enterprise)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Message / Operational Requirements
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your procurement volume, distribution routes, or requirements..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition flex items-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Blip ERP</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center space-x-3">
            <img src="/blip-erp-logo.png" alt="Blip ERP Logo" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p className="text-xs font-black tracking-wider text-white">Blip ERP</p>
              <p className="text-[10px] text-slate-500">Multi-Brand Cloud Enterprise Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button onClick={() => scrollToSection(businessesRef, 'businesses')} className="hover:text-emerald-400 transition">
              Businesses We Support
            </button>
            <button onClick={() => scrollToSection(aboutRef, 'about')} className="hover:text-emerald-400 transition">
              About Us
            </button>
            <button onClick={() => scrollToSection(reviewsRef, 'reviews')} className="hover:text-emerald-400 transition">
              Reviews
            </button>
            <button onClick={() => scrollToSection(contactRef, 'contact')} className="hover:text-emerald-400 transition">
              Contact Us
            </button>
            <button onClick={() => scrollToAuth('login')} className="hover:text-emerald-400 transition">
              Sign In
            </button>
          </div>

          <p className="text-[11px] text-slate-600">
            © 2026 Blip ERP Solutions. All global rights reserved.
          </p>

        </div>
      </footer>

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

    </div>
  );
}
