import React from 'react';
import { useERP } from '../context/useERP';
import DateFilterDropdown from '../components/DateFilterDropdown';

export default function DashboardView() {
  const { 
    db, 
    dateFilterLabel, 
    groupFinancials, 
    getBrandFinancials, 
    setActiveTab, 
    setCurrentManageBrandId,
    openModal 
  } = useERP();

  const { 
    totSales, 
    totPurchases, 
    totExpenses, 
    totSalary, 
    netProfitOrLoss, 
    isProfit, 
    totalActivity 
  } = groupFinancials;

  // Active brands
  const activeBrands = (db.brands || []).filter(b => b.active);

  // SVG Pie chart calculation
  const slices = [
    { label: 'Sales', val: totSales, color: '#10b981' },
    { label: 'Purchases', val: totPurchases, color: '#3b82f6' },
    { label: 'Expenses', val: totExpenses, color: '#f59e0b' },
    { label: 'Salary', val: totSalary, color: '#a855f7' }
  ];

  let accumulatedPercent = 0;
  const pieSegments = totalActivity === 0 ? null : slices.map((s, idx) => {
    const pct = (s.val / totalActivity) * 100;
    const dashArray = `${pct} ${100 - pct}`;
    const dashOffset = -accumulatedPercent;
    accumulatedPercent += pct;
    return (
      <circle
        key={idx}
        cx="21"
        cy="21"
        r="16"
        fill="transparent"
        stroke={s.color}
        strokeWidth="7"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        className="transition-all duration-500"
      />
    );
  });

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Top Banner / Date Range Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateFilterDropdown />

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal('reportsModal')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <i className="fa-solid fa-file-export text-blue-600"></i>
            <span>Export Reports</span>
          </button>
          <button
            onClick={() => openModal('brandModal')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {/* Group Financial Summary Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <i className="fa-solid fa-chart-pie text-base"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Group Financial Summary</h3>
              <p className="text-xs text-slate-400">Consolidated real-time balance across all operating brands</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isProfit ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isProfit ? 'PROFIT' : 'LOSS'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Donut Chart with Net Amount */}
          <div className="flex flex-col items-center justify-center py-2 relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 42 42">
                {totalActivity === 0 ? (
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#e2e8f0" strokeWidth="7" />
                ) : (
                  pieSegments
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Net Profit / Loss
                </span>
                <span
                  className={`text-lg font-extrabold ${
                    isProfit ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {netProfitOrLoss >= 0 ? '+₹' : '-₹'}
                  {Math.abs(netProfitOrLoss).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Micro legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Sales</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Purchases</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Expenses</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Salary</span>
              </span>
            </div>
          </div>

          {/* KPI Metrics 4-Box Grid */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold text-slate-600">Total Sales</span>
                <i className="fa-solid fa-arrow-trend-up text-xs text-emerald-600"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800">₹{totSales.toLocaleString()}</h4>
              <span className="text-[10px] text-emerald-600 font-medium mt-1">Inflow Revenue</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold text-slate-600">Total Purchases</span>
                <i className="fa-solid fa-cart-shopping text-xs text-blue-600"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800">₹{totPurchases.toLocaleString()}</h4>
              <span className="text-[10px] text-blue-600 font-medium mt-1">Direct Procurement</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold text-slate-600">Total Expenses</span>
                <i className="fa-solid fa-receipt text-xs text-amber-600"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800">₹{totExpenses.toLocaleString()}</h4>
              <span className="text-[10px] text-amber-600 font-medium mt-1">Operating Overheads</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold text-slate-600">Total Salary</span>
                <i className="fa-solid fa-wallet text-xs text-purple-600"></i>
              </div>
              <h4 className="text-xl font-bold text-slate-800">₹{totSalary.toLocaleString()}</h4>
              <span className="text-[10px] text-purple-600 font-medium mt-1">Staff Payroll</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Active Brand Breakdowns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <i className="fa-solid fa-layer-group text-emerald-600"></i>
            <span>Individual Active Brand Breakdowns</span>
          </div>
          <span className="text-xs text-slate-400">
            {activeBrands.length} Active {activeBrands.length === 1 ? 'Brand' : 'Brands'}
          </span>
        </div>

        {activeBrands.map(b => {
          const fin = getBrandFinancials(b.id);
          const isBrandProfit = fin.netPL >= 0;

          return (
            <div
              key={b.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${b.color}-50 text-${b.color}-600 rounded-xl text-base`}>
                    <i className={b.icon}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{b.name}</h3>
                    <p className="text-[11px] text-slate-400">{b.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setCurrentManageBrandId(b.id);
                      setActiveTab('brand-manage');
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    Manage Brand
                  </button>
                  <button
                    onClick={() => setActiveTab(b.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition flex items-center space-x-1"
                  >
                    <span>View Hub</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>

              {/* 5-Metric Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Sales</p>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">₹{fin.sales.toLocaleString()}</h4>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Purchases</p>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">₹{fin.purchases.toLocaleString()}</h4>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Expenses</p>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">₹{fin.expenses.toLocaleString()}</h4>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Salary</p>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">₹{fin.salary.toLocaleString()}</h4>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Net P&L</p>
                  <h4
                    className={`text-sm font-bold mt-1 ${
                      isBrandProfit ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isBrandProfit ? '+₹' : '-₹'}
                    {Math.abs(fin.netPL).toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
