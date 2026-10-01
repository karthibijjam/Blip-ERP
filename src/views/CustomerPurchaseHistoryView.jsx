import React from 'react';
import { useERP } from '../context/useERP';

export default function CustomerPurchaseHistoryView() {
  const { db, activeCustomerObj, setActiveTab } = useERP();

  const customer = activeCustomerObj || { name: 'Customer' };
  const cleanName = customer.name?.toLowerCase().trim();

  const orders = [];

  const dc = (db.dairyCustomers || []).find(c => c.name?.toLowerCase().trim() === cleanName);
  if (dc) {
    orders.push({
      date: '2026-09-01 to 2026-09-30',
      brand: '1. Bijjam Dairy',
      sku: dc.sku,
      status: 'Subscription Bill',
      amount: Number(dc.bill) || 3250
    });
  }

  (db.farmsSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach(s => {
    orders.push({
      date: s.date,
      brand: '2. Bijjam Farms',
      sku: s.sku,
      status: s.status,
      amount: Number(s.amount) || 0
    });
  });

  (db.plantrixSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach(s => {
    orders.push({
      date: s.date,
      brand: '3. Eco Plantrix',
      sku: s.sku,
      status: s.status,
      amount: Number(s.amount) || 0
    });
  });

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('customer-profile')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {customer.name} – Complete Purchase History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All purchase bills and orders placed across ERP brands.
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-700">
          All Purchase Bills
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Brand Name</th>
                <th className="p-3.5">Order Particulars / SKU</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5 text-right">Bill Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 text-slate-500 text-xs">{o.date}</td>
                  <td className="p-3.5 font-bold text-slate-800">{o.brand}</td>
                  <td className="p-3.5 text-xs text-slate-700 font-medium">{o.sku}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-700">
                    ₹{o.amount.toLocaleString()}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No purchase history records found.
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
