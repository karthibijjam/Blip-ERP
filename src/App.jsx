import React from 'react';
import { ERPProvider } from './context/ERPContext';
import { useERP } from './context/useERP';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import ModalManager from './components/ModalManager';

import DashboardView from './views/DashboardView';
import BrandManageView from './views/BrandManageView';
import BrandModulesManageView from './views/BrandModulesManageView';
import BrandCustomersView from './views/BrandCustomersView';
import CustomerProfileView from './views/CustomerProfileView';
import CustomerPendingPaymentsView from './views/CustomerPendingPaymentsView';
import CustomerPurchaseHistoryView from './views/CustomerPurchaseHistoryView';
import CustomerBrandDetailView from './views/CustomerBrandDetailView';
import BrandItemsView from './views/BrandItemsView';
import DairyView from './views/DairyView';
import FarmsView from './views/FarmsView';
import PlantrixView from './views/PlantrixView';
import MixedView from './views/MixedView';
import AccountView from './views/AccountView';
import FinancialSubpageView from './views/FinancialSubpageView';
import HomeView from './views/HomeView';
import SuperAdminView from './views/SuperAdminView';
import CoreBrandModulesView from './views/CoreBrandModulesView';

import Sidebar from './components/Sidebar';

function ERPAppContent() {
  const { activeTab, db, isAuthenticated, currentUser } = useERP();

  const isPlatformAdmin = Boolean(
    currentUser?.isPlatformAdmin || 
    currentUser?.role === 'Blip ERP Platform Admin' ||
    currentUser?.role === 'Super ERP Platform Admin' ||
    currentUser?.role?.toLowerCase().includes('platform') ||
    currentUser?.email?.endsWith('@bliperp.com')
  );

  if (!isAuthenticated) {
    return <HomeView />;
  }

  const renderActiveView = () => {
    // Platform Administrator Routing Guard
    if (isPlatformAdmin) {
      if (activeTab === 'account') {
        return <AccountView />;
      }
      if (activeTab === 'core-modules' || activeTab === 'platform-modules') {
        return <CoreBrandModulesView />;
      }
      if (activeTab === 'company-dashboard') {
        return <DashboardView />;
      }
      return <SuperAdminView />;
    }

    // Client Tenant View Routing
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'company-dashboard':
        return <DashboardView />;
      case 'brand-manage':
        return <BrandManageView />;
      case 'brand-modules-manage':
        return <BrandModulesManageView />;
      case 'brand-customers':
        return <BrandCustomersView />;
      case 'customer-profile':
        return <CustomerProfileView />;
      case 'customer-pending-payments':
        return <CustomerPendingPaymentsView />;
      case 'customer-purchase-history':
        return <CustomerPurchaseHistoryView />;
      case 'customer-brand-detail':
        return <CustomerBrandDetailView />;
      case 'brand-items':
        return <BrandItemsView />;
      case 'dairy':
        return <DairyView />;
      case 'farms':
        return <FarmsView />;
      case 'plantrix':
        return <PlantrixView />;
      case 'mixed':
        return <MixedView />;
      case 'account':
        return <AccountView />;
      case 'financial-subpage':
        return <FinancialSubpageView />;
      default:
        // If it's a dynamic brand
        const customBrand = (db.brands || []).find(b => b.id === activeTab);
        if (customBrand) {
          return <BrandManageView />;
        }
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/90 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* 1. Universal Top Header: Full-Width Edge-to-Edge across entire screen */}
      <Header />

      {/* 2. Main Workspace Layout Below Header */}
      <div className="flex-1 flex min-w-0 relative">
        {/* Collapsible Left Side Navigation Bar (Below Header) */}
        <Sidebar />

        {/* Main App Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-8">
          {/* Main Container */}
          <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
            {renderActiveView()}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-4 px-4 text-center text-xs text-slate-400">
            <p>
              © 2026 {isPlatformAdmin ? 'Blip ERP Cloud Technologies Inc. • Platform Administrator Console' : (db.company?.name || 'Bijjam Enterprises Group')}. Multi-Brand ERP & Delivery Management System.
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation (APK / Mobile friendly) */}
      <MobileBottomNav />

      {/* Centralized Modals */}
      <ModalManager />
    </div>
  );
}

export default function App() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}
