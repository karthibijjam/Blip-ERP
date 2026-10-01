import React from 'react';
import { useERP } from '../context/useERP';
import DateFilterDropdown from '../components/DateFilterDropdown';

export default function MixedView() {
  const { 
    db, 
    dateFilterLabel, 
    isDateInRange, 
    deleteNamedRecord, 
    openModal 
  } = useERP();

  const records = (db.mixedExpenses || []).filter(x => isDateInRange(x.date));

  const totalAmount = records.reduce((acc, x) => acc + (Number(x.amount) || 0), 0);

  const handleDelete = (id) => {
    if (window.confirm('Delete expense record?')) {
      deleteNamedRecord('mixedExpenses', id);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Date Filter & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateFilterDropdown />

        <button
          onClick={() => openModal('mixedModal')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add Common Expense / Salary</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2.5">
            <i className="fa-solid fa-wallet text-purple-600 text-2xl"></i>
            <span>Mixed Spends & Company Salaries</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track common company overheads, employee salaries, office rent, utilities, and general expenses.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Filtered Total</span>
          <span className="text-lg font-extrabold text-purple-900">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Particulars / Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Amount (₹)</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 text-xs text-slate-500">{m.date}</td>
                  <td className="p-3.5 font-bold text-slate-800">{m.desc}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700">
                      {m.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-purple-800">
                    ₹{Number(m.amount).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                      title="Delete record"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No mixed expenses or salaries recorded in the selected date range.
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
