import React from 'react';
import { useERP } from '../context/useERP';

export default function FinancialSubpageView() {
  const { 
    db, 
    currentManageBrandId, 
    activeFinancialBrandId, 
    activeFinancialType, 
    setActiveTab, 
    isDateInRange, 
    deleteNamedRecord, 
    openModal 
  } = useERP();

  const brandId = activeFinancialBrandId || currentManageBrandId || 'dairy';
  const brand = (db.brands || []).find(b => b.id === brandId) || { name: 'Brand', color: 'emerald' };

  const titles = {
    sales: 'Sales Management Hub',
    delivery: 'Milk Delivery Management Hub',
    milk_purchases: 'Milk Farmers Management Hub',
    purchases: 'Purchases Management Hub',
    expenses: 'Expenses Management Hub',
    salary: 'Salary Management Hub'
  };

  const currentTitle = titles[activeFinancialType] || 'Financial Records Hub';

  // Trigger modal helper
  const handleTriggerAddModal = () => {
    if (activeFinancialType === 'sales') {
      if (brandId === 'dairy') openModal('dairyCustomerModal');
      else if (brandId === 'farms') openModal('farmsSaleModal');
      else if (brandId === 'plantrix') openModal('plantrixSaleModal');
    } else if (activeFinancialType === 'delivery') {
      openModal('deliveryRouteModal');
    } else if (activeFinancialType === 'milk_purchases') {
      openModal('dairyFarmerModal');
    } else if (activeFinancialType === 'purchases') {
      if (brandId === 'dairy') openModal('dairyProcurementModal');
      else if (brandId === 'farms') openModal('farmsPurchaseModal');
      else if (brandId === 'plantrix') openModal('plantrixPurchaseModal');
    } else if (activeFinancialType === 'expenses' || activeFinancialType === 'salary') {
      openModal('mixedModal');
    }
  };

  // Compile records for standard types
  let standardRecords = [];
  if (activeFinancialType === 'sales') {
    if (brandId === 'dairy') {
      (db.dairyCustomers || []).forEach(c => {
        standardRecords.push({
          date: '2026-09-30',
          desc: `Subscription Bill - ${c.name}`,
          cat: c.sku,
          amount: c.bill,
          id: c.id,
          coll: 'dairyCustomers'
        });
      });
    } else if (brandId === 'farms') {
      (db.farmsSales || []).filter(x => isDateInRange(x.date)).forEach(s => {
        standardRecords.push({
          date: s.date,
          desc: `Customer Sale - ${s.customer}`,
          cat: s.sku,
          amount: s.amount,
          id: s.id,
          coll: 'farmsSales'
        });
      });
    } else if (brandId === 'plantrix') {
      (db.plantrixSales || []).filter(x => isDateInRange(x.date)).forEach(s => {
        standardRecords.push({
          date: s.date,
          desc: `Customer Sale - ${s.customer}`,
          cat: s.sku,
          amount: s.amount,
          id: s.id,
          coll: 'plantrixSales'
        });
      });
    }
  } else if (activeFinancialType === 'purchases') {
    if (brandId === 'dairy') {
      (db.dairyProcurement || []).filter(x => isDateInRange(x.date)).forEach(p => {
        standardRecords.push({
          date: p.date,
          desc: `Farmer Procurement - ${p.farmer}`,
          cat: `${p.qty}L (${p.shift}) | Fat: ${p.fat}%`,
          amount: p.total,
          id: p.id,
          coll: 'dairyProcurement'
        });
      });
    } else if (brandId === 'farms') {
      (db.farmsPurchases || []).filter(x => isDateInRange(x.date)).forEach(p => {
        standardRecords.push({
          date: p.date,
          desc: `Bulk Purchase - ${p.supplier}`,
          cat: p.sku,
          amount: p.amount,
          id: p.id,
          coll: 'farmsPurchases'
        });
      });
    } else if (brandId === 'plantrix') {
      (db.plantrixPurchases || []).filter(x => isDateInRange(x.date)).forEach(p => {
        standardRecords.push({
          date: p.date,
          desc: `Stock Purchase - ${p.supplier}`,
          cat: p.sku,
          amount: p.amount,
          id: p.id,
          coll: 'plantrixPurchases'
        });
      });
    }
  } else if (activeFinancialType === 'expenses') {
    if (brandId === 'dairy') {
      (db.dairyCattleExpenses || []).filter(x => isDateInRange(x.date)).forEach(e => {
        standardRecords.push({
          date: e.date,
          desc: e.desc,
          cat: e.category,
          amount: e.amount,
          id: e.id,
          coll: 'dairyCattleExpenses'
        });
      });
    } else {
      (db.mixedExpenses || []).filter(x => isDateInRange(x.date) && x.category !== 'Salaries & Wages').forEach(e => {
        standardRecords.push({
          date: e.date,
          desc: e.desc,
          cat: e.category,
          amount: e.amount,
          id: e.id,
          coll: 'mixedExpenses'
        });
      });
    }
  } else if (activeFinancialType === 'salary') {
    (db.mixedExpenses || []).filter(x => isDateInRange(x.date) && x.category === 'Salaries & Wages').forEach(s => {
      standardRecords.push({
        date: s.date,
        desc: s.desc,
        cat: s.category,
        amount: s.amount,
        id: s.id,
        coll: 'mixedExpenses'
      });
    });
  }

  const handleDeleteRecord = (coll, id) => {
    if (window.confirm('Delete this record?')) {
      deleteNamedRecord(coll, id);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab(brandId)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {brand.name} – {currentTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new entries or view and manage existing records.
            </p>
          </div>
        </div>

        {activeFinancialType !== 'delivery' && (
          <button
            onClick={handleTriggerAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New Record</span>
          </button>
        )}
      </div>

      {/* Milk Farmers Hub Action Cards */}
      {activeFinancialType === 'milk_purchases' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => openModal('dairyFarmerModal')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl text-lg">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-emerald-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Add New Milk Farmer</h4>
              <p className="text-xs text-slate-500 mt-0.5">Register new dairy milk suppliers and assign villages</p>
            </div>
          </div>

          <div
            onClick={() => openModal('dairyProcurementModal')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl text-lg">
                <i className="fa-solid fa-cow"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-amber-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Record Shift Procurement</h4>
              <p className="text-xs text-slate-500 mt-0.5">Log milk collection quantity, fat & SNF calculations</p>
            </div>
          </div>
        </div>
      )}

      {/* Milk Delivery Hub Action Cards */}
      {activeFinancialType === 'delivery' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => openModal('startDeliveriesModal')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl text-lg">
                <i className="fa-solid fa-truck-ramp-box"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-indigo-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Start Deliveries</h4>
              <p className="text-xs text-slate-500 mt-0.5">Launch daily delivery run & check off routes</p>
            </div>
          </div>

          <div
            onClick={() => openModal('deliveryRouteModal')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-cyan-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl text-lg">
                <i className="fa-solid fa-route"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-cyan-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Assign Delivery Route & Executive</h4>
              <p className="text-xs text-slate-500 mt-0.5">Assign driver and area route for subscription deliveries</p>
            </div>
          </div>

          <div
            onClick={() => openModal('dairyCustomerModal')}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl text-lg">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-emerald-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Add New Customer</h4>
              <p className="text-xs text-slate-500 mt-0.5">Register customer with milk quantities & items</p>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-700">
          {activeFinancialType === 'delivery'
            ? 'Existing Delivery Customers Data'
            : activeFinancialType === 'milk_purchases'
            ? 'Registered Milk Farmers'
            : 'Existing Records'}
        </div>

        <div className="overflow-x-auto">
          {/* Milk Farmers View */}
          {activeFinancialType === 'milk_purchases' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 w-16 text-center">S.No</th>
                  <th className="p-3.5">Farmer Name</th>
                  <th className="p-3.5">Contact & Village / Area</th>
                  <th className="p-3.5">Registration Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(db.dairyFarmers || []).map((f, idx) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 text-center text-slate-400 font-medium text-xs">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-slate-800">{f.name}</td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      <div className="font-medium text-slate-700">{f.phone}</div>
                      <div className="text-slate-400">{f.area}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        Registered Farmer
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteRecord('dairyFarmers', f.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {(db.dairyFarmers || []).length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      No registered milk farmers found. Click "Add New Milk Farmer" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Delivery Customers View */}
          {activeFinancialType === 'delivery' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Route / Area</th>
                  <th className="p-3.5">Recent Date</th>
                  <th className="p-3.5 text-right">Total Sum of Purchases (₹)</th>
                  <th className="p-3.5 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(db.dairyCustomers || []).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-800">
                      {c.name}
                      <div className="text-xs text-slate-400 font-normal">{c.phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs font-medium">
                      {c.route || 'Route A - Jubilee Hills'}
                    </td>
                    <td className="p-3.5 text-slate-500 text-xs">
                      {c.recentDate || '2026-09-30'}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">
                      ₹{Number(c.bill || 3250).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          (c.pending ?? 500) > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        Pending: ₹{Number(c.pending ?? 500).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}

                {(db.dairyCustomers || []).length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      No delivery subscription customers found. Click "Add New Customer" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Standard Records Table (sales, purchases, expenses, salary) */}
          {activeFinancialType !== 'milk_purchases' && activeFinancialType !== 'delivery' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Particulars / Description</th>
                  <th className="p-3.5">Category / Details</th>
                  <th className="p-3.5 text-right">Amount (₹)</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standardRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 text-xs text-slate-500">{r.date}</td>
                    <td className="p-3.5 font-bold text-slate-800">{r.desc}</td>
                    <td className="p-3.5 text-slate-600 text-xs font-medium">{r.cat}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">
                      ₹{Number(r.amount).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteRecord(r.coll, r.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {standardRecords.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      No records found in this hub for the selected date range. Click "Add New Record" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
