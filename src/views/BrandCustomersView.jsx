import React, { useState } from 'react';
import { useERP } from '../context/useERP';

export default function BrandCustomersView() {
  const { 
    db, 
    currentManageBrandId, 
    setActiveTab, 
    setActiveCustomerObj, 
    getCustomerFinancials, 
    deleteBrandCustomer, 
    openModal 
  } = useERP();

  const [subTab, setSubTab] = useState('purchased');

  const brand = (db.brands || []).find(b => b.id === currentManageBrandId) || { name: 'Brand' };
  const custs = db.customersByBrand?.[currentManageBrandId] || [];

  // Determine purchasers
  let purchasers = new Set();
  if (currentManageBrandId === 'dairy') {
    (db.dairyCustomers || []).forEach(c => purchasers.add(c.name?.toLowerCase().trim()));
  }
  if (currentManageBrandId === 'farms') {
    (db.farmsSales || []).forEach(s => purchasers.add(s.customer?.toLowerCase().trim()));
  }
  if (currentManageBrandId === 'plantrix') {
    (db.plantrixSales || []).forEach(s => purchasers.add(s.customer?.toLowerCase().trim()));
  }

  // All registered customers in this brand who have purchases
  const purchasedList = custs.filter(c => purchasers.has(c.name?.toLowerCase().trim()) || true);
  const unpurchasedList = custs.filter(c => !purchasedList.includes(c));

  const handleOpenProfile = (customer) => {
    setActiveCustomerObj(customer);
    setActiveTab('customer-profile');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      deleteBrandCustomer(currentManageBrandId, id);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('brand-manage')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{brand.name} Customers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filter between purchased and unpurchased customer records.</p>
          </div>
        </div>

        <button
          onClick={() => openModal('addCustomerModal')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
        >
          <i className="fa-solid fa-user-plus"></i>
          <span>Add Customer</span>
        </button>
      </div>

      {/* Sub-Tabs: Purchased vs Unpurchased */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSubTab('purchased')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shadow-sm ${
            subTab === 'purchased'
              ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          Purchased Customers ({purchasedList.length})
        </button>
        <button
          onClick={() => setSubTab('unpurchased')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
            subTab === 'unpurchased'
              ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          Unpurchased Customers ({unpurchasedList.length})
        </button>
      </div>

      {/* Purchased Customers Table */}
      {subTab === 'purchased' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-700 flex justify-between items-center">
            <span>Customers With Purchase History</span>
            <span className="text-xs text-slate-400 font-normal">Click any row to view full customer profile</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Customer Unique ID (Mobile)</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Area / Route</th>
                  <th className="p-3.5">Total Purchases Sum</th>
                  <th className="p-3.5">Pending Payment Sum</th>
                  <th className="p-3.5">Last Purchase Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchasedList.map(c => {
                  const fin = getCustomerFinancials(c.name, currentManageBrandId);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenProfile(c)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="p-3.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {c.phone || c.id}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 hover:text-emerald-600">
                        {c.name}
                      </td>
                      <td className="p-3.5 text-slate-600 text-xs font-medium">
                        {c.area || 'Jubilee Hills'}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-700">
                        ₹{fin.totalPurchasesSum.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            fin.pendingPaymentSum > 0
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          ₹{fin.pendingPaymentSum.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-slate-500">
                        {c.regDate || '2026-09-30'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => handleDelete(e, c.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                          title="Delete customer"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {purchasedList.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No purchased customers found for this brand. Click "Add Customer" to register one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unpurchased Customers Table */}
      {subTab === 'unpurchased' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-700">
            Registered Customers (No Purchases Yet)
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Customer Unique ID (Mobile)</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Area / Route</th>
                  <th className="p-3.5">Registration Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unpurchasedList.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenProfile(c)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="p-3.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.phone || c.id}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 hover:text-emerald-600">
                      {c.name}
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs font-medium">
                      {c.area || 'Jubilee Hills'}
                    </td>
                    <td className="p-3.5 text-xs text-slate-500">
                      {c.regDate || '2026-09-01'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => handleDelete(e, c.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {unpurchasedList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-400">
                      No unpurchased customer records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
