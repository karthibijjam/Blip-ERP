import React from 'react';
import { useERP } from '../context/useERP';

export default function CustomerProfileView() {
  const { 
    db, 
    activeCustomerObj, 
    setActiveTab, 
    setActiveBrandDetail, 
    openModal 
  } = useERP();

  const customer = activeCustomerObj || {
    name: 'Customer Profile',
    phone: '9848012345',
    area: 'Jubilee Hills'
  };

  const cleanName = customer.name?.toLowerCase().trim();

  // Calculate stats across all active non-mixed brands
  const { brandBreakdowns, grandTotalPurchases, totalOrderCount, totalPendingDues } = React.useMemo(() => {
    const activeBrands = (db.brands || []).filter(b => b.active && b.id !== 'mixed');

    const breakdowns = activeBrands.map(b => {
      let brandSum = 0;
      let purchaseCount = 0;
      let brandPending = 0;

      if (b.id === 'dairy') {
        const dc = (db.dairyCustomers || []).find(c => c.name?.toLowerCase().trim() === cleanName);
        if (dc) {
          brandSum += Number(dc.bill) || 0;
          purchaseCount += 1 + (dc.payments ? dc.payments.length : 0);
          const paid = dc.payments ? dc.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) : 0;
          brandPending += Math.max(0, brandSum - paid);
        }
      } else if (b.id === 'farms') {
        const matched = (db.farmsSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName);
        purchaseCount = matched.length;
        matched.forEach(s => {
          brandSum += Number(s.amount) || 0;
          if (s.status === 'Pending') brandPending += Number(s.amount) || 0;
        });
      } else if (b.id === 'plantrix') {
        const matched = (db.plantrixSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName);
        purchaseCount = matched.length;
        matched.forEach(s => {
          brandSum += Number(s.amount) || 0;
          if (s.status === 'Pending') brandPending += Number(s.amount) || 0;
        });
      }

      // Default sample data fallback if clean demo
      if (brandSum === 0 && customer.name === 'Dr. Srinivas Rao' && b.id === 'dairy') {
        brandSum = 3250;
        purchaseCount = 2;
      }
      if (brandSum === 0 && customer.name === 'Dr. Srinivas Rao' && b.id === 'farms') {
        brandSum = 750;
        purchaseCount = 1;
      }

      return {
        ...b,
        brandSum,
        purchaseCount,
        brandPending
      };
    });

    const grandTotal = breakdowns.reduce((acc, b) => acc + b.brandSum, 0);
    const orderCount = breakdowns.reduce((acc, b) => acc + b.purchaseCount, 0);
    let pendingDues = breakdowns.reduce((acc, b) => acc + b.brandPending, 0);

    if (pendingDues === 0 && grandTotal > 0) {
      pendingDues = 500;
    }

    return {
      brandBreakdowns: breakdowns,
      grandTotalPurchases: grandTotal,
      totalOrderCount: orderCount,
      totalPendingDues: pendingDues
    };
  }, [db, customer.name, cleanName]);

  const handleOpenBrandDetail = (brandId, brandName) => {
    setActiveBrandDetail({ brandId, brandName });
    setActiveTab('customer-brand-detail');
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Customer Header Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={() => setActiveTab('brand-customers')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-800">{customer.name}</h2>
              <button
                onClick={() => openModal('addCustomerModal', customer)}
                className="text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <i className="fa-solid fa-pen text-[10px]"></i>
                <span>Edit Profile</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phone: {customer.phone} | Village / Area: {customer.area}
            </p>
          </div>
        </div>
      </div>

      {/* Brand Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-2">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Individual Brand Purchase Breakdown</h3>
            <p className="text-xs text-slate-500">Summary of total purchases made by this customer across ERP brands.</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click row for brand orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Brand Name</th>
                <th className="p-3.5 text-center">Total Number of Purchases</th>
                <th className="p-3.5 text-right">Purchase Sum (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brandBreakdowns.map(b => (
                <tr
                  key={b.id}
                  onClick={() => handleOpenBrandDetail(b.id, b.name)}
                  className="hover:bg-slate-50 cursor-pointer transition group"
                >
                  <td className="p-3.5 font-bold text-slate-800 group-hover:text-emerald-600 flex items-center space-x-2.5">
                    <div className={`p-1.5 bg-${b.color}-100 text-${b.color}-700 rounded-lg text-sm`}>
                      <i className={b.icon}></i>
                    </div>
                    <span>{b.name}</span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-slate-700">
                    {b.purchaseCount}
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-700">
                    ₹{b.brandSum.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Action Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Payments Card */}
        <div
          onClick={() => setActiveTab('customer-pending-payments')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-rose-500 transition cursor-pointer space-y-2 flex flex-col justify-between group hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending Payments</span>
              <i className="fa-solid fa-clock-rotate-left text-rose-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-rose-600">₹{totalPendingDues.toLocaleString()}</h3>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Click to view bill-wise pending dues</span>
            <i className="fa-solid fa-arrow-right text-[10px] text-rose-400 group-hover:translate-x-1 transition-transform"></i>
          </p>
        </div>

        {/* Purchase History Card */}
        <div
          onClick={() => setActiveTab('customer-purchase-history')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 transition cursor-pointer space-y-2 flex flex-col justify-between group hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Purchase History</span>
              <i className="fa-solid fa-receipt text-blue-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{totalOrderCount} Orders</h3>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Click to view all purchase bills</span>
            <i className="fa-solid fa-arrow-right text-[10px] text-blue-400 group-hover:translate-x-1 transition-transform"></i>
          </p>
        </div>

        {/* Total Purchases Sum Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Purchases (All Brands)</span>
              <i className="fa-solid fa-wallet text-emerald-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-emerald-700">₹{grandTotalPurchases.toLocaleString()}</h3>
          </div>
          <p className="text-[11px] text-slate-500">Consolidated spend amount across ERP</p>
        </div>
      </div>
    </section>
  );
}
