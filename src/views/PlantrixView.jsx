import React from 'react';
import { useERP } from '../context/useERP';
import DateFilterDropdown from '../components/DateFilterDropdown';

export default function PlantrixView() {
  const { 
    db, 
    dateFilterLabel, 
    getBrandFinancials, 
    setActiveTab, 
    setCurrentManageBrandId, 
    setActiveFinancialBrandId, 
    setActiveFinancialType, 
    openModal 
  } = useERP();

  const fin = getBrandFinancials('plantrix');
  const plantrixBrand = (db.brands || []).find(b => b.id === 'plantrix') || { name: 'Eco Plantrix' };

  const handleOpenModule = (moduleId) => {
    setCurrentManageBrandId('plantrix');
    setActiveFinancialBrandId('plantrix');
    setActiveFinancialType(moduleId);
    setActiveTab('financial-subpage');
  };

  const modules = db.brandModules?.plantrix || [];

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Date Filter & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateFilterDropdown />

        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentManageBrandId('plantrix');
              setActiveTab('brand-manage');
            }}
            className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-gear"></i>
            <span>Brand Settings</span>
          </button>
          <button
            onClick={() => openModal('plantrixPurchaseModal')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Chemical / Can</span>
          </button>
          <button
            onClick={() => openModal('plantrixSaleModal')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-cart-plus"></i>
            <span>Add Product Sale</span>
          </button>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2.5">
          <i className="fa-solid fa-spray-can-sparkles text-cyan-600 text-2xl"></i>
          <span>{plantrixBrand.name}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Eco-Friendly Cleaning Products Procurement, Inventory SKUs & Customer Retail Sales.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
          <h3 className="text-lg font-bold text-emerald-600 mt-1">₹{fin.sales.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Purchases</span>
          <h3 className="text-lg font-bold text-blue-600 mt-1">₹{fin.purchases.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Expenses</span>
          <h3 className="text-lg font-bold text-amber-600 mt-1">₹{fin.expenses.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Salary</span>
          <h3 className="text-lg font-bold text-purple-600 mt-1">₹{fin.salary.toLocaleString()}</h3>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map(m => (
          <div
            key={m.id}
            onClick={() => handleOpenModule(m.id)}
            className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-${m.color}-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 bg-${m.color}-100 text-${m.color}-700 rounded-xl text-lg`}>
                <i className={m.icon}></i>
              </div>
              <i className={`fa-solid fa-arrow-right text-slate-300 group-hover:text-${m.color}-600 transition-colors`}></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{m.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
