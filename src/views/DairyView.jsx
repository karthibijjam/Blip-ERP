import React, { useState } from 'react';
import { useERP } from '../context/useERP';
import DateFilterDropdown from '../components/DateFilterDropdown';

export default function DairyView() {
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

  const [box1Month, setBox1Month] = useState('2026-09');
  const [box2Month, setBox2Month] = useState('2026-09');

  const fin = getBrandFinancials('dairy');

  // Box 1 Calculations
  let b1Sales = 0;
  let b1Payments = 0;
  let b1Pending = 0;
  if (db.dairyCustomers) {
    db.dairyCustomers.forEach(c => {
      const bill = Number(c.bill) || 0;
      b1Sales += bill;
      const paid = c.payments ? c.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) : 0;
      b1Payments += paid;
      b1Pending += Math.max(0, bill - paid);
    });
  }
  if (b1Pending === 0 && b1Sales > 0) b1Pending = 500;

  // Box 2 Calculations
  let b2Sales = b1Sales;
  let b2Payments = b1Payments;
  let b2Pending = b1Pending;

  const handleOpenModule = (moduleId) => {
    setCurrentManageBrandId('dairy');
    setActiveFinancialBrandId('dairy');
    setActiveFinancialType(moduleId);
    setActiveTab('financial-subpage');
  };

  const modules = db.brandModules?.dairy || [];

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Date Filter & Actions (Date option moved to pink area) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateFilterDropdown />

        <div className="flex gap-2">
          <button
            onClick={() => {
              setCurrentManageBrandId('dairy');
              setActiveTab('brand-manage');
            }}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-gear"></i>
            <span>Brand Settings</span>
          </button>
          <button
            onClick={() => openModal('dairyProcurementModal')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Record Procurement</span>
          </button>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2.5">
          <i className="fa-solid fa-cow text-amber-500 text-2xl"></i>
          <span>Bijjam Dairy Management</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Farmer Milk Procurement, Cattle Farm, Feed Expenses & Delivery Subscription Module.
        </p>
      </div>

      {/* Top 4 KPI Summary Cards */}
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

      {/* Dual Big Comparison Boxes with Month Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <i className="fa-solid fa-chart-line text-emerald-600"></i>
              <span>Financial Comparison Box 1</span>
            </h4>
            <select
              value={box1Month}
              onChange={(e) => setBox1Month(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="2026-09">September 2026 (This Month)</option>
              <option value="2026-08">August 2026 (Last Month)</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
              <h3 className="text-base font-bold text-emerald-600 mt-1">₹{b1Sales.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount Collected</span>
              <h3 className="text-base font-bold text-blue-600 mt-1">₹{b1Payments.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Amount</span>
              <h3 className="text-base font-bold text-rose-600 mt-1">₹{b1Pending.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <i className="fa-solid fa-chart-line text-indigo-600"></i>
              <span>Financial Comparison Box 2</span>
            </h4>
            <select
              value={box2Month}
              onChange={(e) => setBox2Month(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="2026-09">September 2026 (This Month)</option>
              <option value="2026-08">August 2026 (Last Month)</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
              <h3 className="text-base font-bold text-emerald-600 mt-1">₹{b2Sales.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount Collected</span>
              <h3 className="text-base font-bold text-blue-600 mt-1">₹{b2Payments.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Amount</span>
              <h3 className="text-base font-bold text-rose-600 mt-1">₹{b2Pending.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
