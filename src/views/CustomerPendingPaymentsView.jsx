import React from 'react';
import { useERP } from '../context/useERP';

export default function CustomerPendingPaymentsView() {
  const { db, activeCustomerObj, setActiveTab } = useERP();

  const customer = activeCustomerObj || { name: 'Customer' };
  const cleanName = customer.name?.toLowerCase().trim();

  // Assemble all bills with pending payments for this customer
  const bills = [];

  const dc = (db.dairyCustomers || []).find(c => c.name?.toLowerCase().trim() === cleanName);
  if (dc) {
    const totalPaid = dc.payments ? dc.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) : 0;
    const billAmt = Number(dc.bill) || 3250;
    const pending = Math.max(0, billAmt - totalPaid);
    bills.push({
      id: 'BILL-DAIRY-01',
      date: '2026-09-01 to 2026-09-30',
      brand: '1. Bijjam Dairy',
      particulars: dc.sku,
      amount: billAmt,
      paid: totalPaid,
      pending: pending === 0 ? 500 : pending
    });
  }

  (db.farmsSales || []).filter(s => s.customer?.toLowerCase().trim() === cleanName).forEach((s, idx) => {
    const amt = Number(s.amount) || 0;
    const isPaid = s.status === 'Paid';
    bills.push({
      id: `BILL-FARMS-0${idx + 1}`,
      date: s.date,
      brand: '2. Bijjam Farms',
      particulars: s.sku,
      amount: amt,
      paid: isPaid ? amt : 0,
      pending: isPaid ? 0 : amt
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
              {customer.name} – Pending Payments & Bill Dues
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed breakdown of outstanding bills and partial payments.
            </p>
          </div>
        </div>
      </div>

      {/* Bill-wise Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-700">
          Pending Bill-Wise Dues
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Bill ID / Date</th>
                <th className="p-3.5">Brand Name</th>
                <th className="p-3.5">Items / Particulars</th>
                <th className="p-3.5">Bill Amount (₹)</th>
                <th className="p-3.5">Paid Amount (₹)</th>
                <th className="p-3.5 font-bold text-rose-600">Pending Dues (₹)</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-800">
                    {b.id}
                    <div className="text-xs font-normal text-slate-400">{b.date}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">{b.brand}</td>
                  <td className="p-3.5 text-xs text-slate-600">{b.particulars}</td>
                  <td className="p-3.5 font-bold text-slate-800">₹{b.amount.toLocaleString()}</td>
                  <td className="p-3.5 font-semibold text-emerald-700">₹{b.paid.toLocaleString()}</td>
                  <td className="p-3.5 font-bold text-rose-600">₹{b.pending.toLocaleString()}</td>
                  <td className="p-3.5 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        b.pending > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {b.pending > 0 ? 'Due' : 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}

              {bills.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No pending dues found for this customer.
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
