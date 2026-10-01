import React from 'react';
import { useERP } from '../context/useERP';

export default function BrandManageView() {
  const { 
    db, 
    currentManageBrandId, 
    setActiveTab, 
    toggleBrandStatus, 
    openModal 
  } = useERP();

  const brand = (db.brands || []).find(b => b.id === currentManageBrandId) || {
    id: currentManageBrandId,
    name: 'Brand Management',
    subtitle: 'Manage brand details and operations',
    icon: 'fa-solid fa-cube',
    color: 'emerald',
    active: true
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Brand Top Header Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 bg-${brand.color}-100 text-${brand.color}-700 rounded-2xl text-2xl shadow-sm`}>
            <i className={brand.icon}></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-800">{brand.name}</h2>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  brand.active
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {brand.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{brand.subtitle}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => openModal('brandModal', brand)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition"
          >
            <i className="fa-solid fa-pen"></i>
            <span>Edit Brand</span>
          </button>
          <button
            onClick={() => openModal('deleteBrandModal')}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span>Delete Brand</span>
          </button>
        </div>
      </div>

      {/* Brand Activation Status Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Brand Activation Status</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Toggle active or inactive status. Inactive brands are hidden from navigation and dashboard calculations.
          </p>
        </div>
        <button
          onClick={() => toggleBrandStatus(brand.id)}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 ${
            brand.active
              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
          }`}
        >
          <i className="fa-solid fa-power-off"></i>
          <span>{brand.active ? 'Set Inactive' : 'Set Active'}</span>
        </button>
      </div>

      {/* 3 Core Management Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Customers Hub Card */}
        <div
          onClick={() => setActiveTab('brand-customers')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Customers</h3>
              <p className="text-xs text-slate-500 mt-0.5">Filter & manage Purchased and Unpurchased customers</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-emerald-600 transition"></i>
        </div>

        {/* Selling Items (SKUs) Catalog Card */}
        <div
          onClick={() => setActiveTab('brand-items')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-100 text-blue-700 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Selling Items (SKUs)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage brand products, pricing and inventory catalog</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-blue-600 transition"></i>
        </div>

        {/* Manage Brand Modules Card */}
        <div
          onClick={() => setActiveTab('brand-modules-manage')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-purple-100 text-purple-700 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-puzzle-piece"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Manage Brand Modules</h3>
              <p className="text-xs text-slate-500 mt-0.5">View and reorder brand modules & hub cards</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-purple-600 transition"></i>
        </div>
      </div>
    </section>
  );
}
