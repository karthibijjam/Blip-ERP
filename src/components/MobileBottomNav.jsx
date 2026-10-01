import React from 'react';
import { useERP } from '../context/useERP';
import { LayoutDashboard, Store, Truck, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeTab, setActiveTab, openModal, currentUser } = useERP();

  const isPlatformAdmin = Boolean(
    currentUser?.isPlatformAdmin || 
    currentUser?.role === 'Blip ERP Platform Admin' ||
    currentUser?.role === 'Super ERP Platform Admin' ||
    currentUser?.role?.toLowerCase().includes('platform') ||
    currentUser?.email?.endsWith('@bliperp.com')
  );

  const navItems = isPlatformAdmin ? [
    { id: 'super-admin-portal', label: 'Console', icon: ShieldCheck },
    { id: 'account', label: 'Admin Team', icon: LayoutDashboard }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dairy', label: 'Dairy', icon: Store },
    { id: 'deliveries', label: 'Deliveries', icon: Truck, action: () => openModal('startDeliveriesModal') },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet, action: () => openModal('reportsModal') },
    { id: 'account', label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex justify-around items-center">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                setActiveTab(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
