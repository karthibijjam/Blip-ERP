import React from 'react';
import { useERP } from '../context/useERP';

export default function BrandItemsView() {
  const { 
    db, 
    currentManageBrandId, 
    setActiveTab, 
    deleteSellingItem, 
    openModal 
  } = useERP();

  const brand = (db.brands || []).find(b => b.id === currentManageBrandId) || { name: 'Brand' };
  const items = db.sellingItemsByBrand?.[currentManageBrandId] || [];

  const handleDelete = (id) => {
    if (window.confirm('Delete selling item / SKU?')) {
      deleteSellingItem(currentManageBrandId, id);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('brand-manage')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {brand.name} Selling Items & SKUs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage brand catalog, pricing, and stock quantity.
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal('sellingItemModal')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add Selling Item</span>
        </button>
      </div>

      {/* SKUs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3.5 w-16 text-center">S.No</th>
                <th className="p-3.5">SKU Unique ID</th>
                <th className="p-3.5">Item / SKU Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">MRP (₹)</th>
                <th className="p-3.5">Selling Price (₹)</th>
                <th className="p-3.5">Stock Quantity</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((i, idx) => (
                <tr key={i.id || i.skuCode} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 text-center text-slate-400 font-medium text-xs">{idx + 1}</td>
                  <td className="p-3.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                      {i.skuCode || i.id || `SKU-${101 + idx}`}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{i.name}</td>
                  <td className="p-3.5 text-slate-600 text-xs">{i.category}</td>
                  <td className="p-3.5 font-medium text-slate-500">
                    ₹{i.mrp !== undefined ? i.mrp : Math.round((i.price || 50) * 1.1)}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700">₹{i.price}</td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {i.stock !== undefined ? i.stock : 100} Units
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                        (i.stock ?? 100) > 20
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {i.status || 'In Stock'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => openModal('sellingItemModal', i)}
                      className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition"
                      title="Edit SKU"
                    >
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                      title="Delete SKU"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    No selling items added for this brand yet. Click "Add Selling Item" above.
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
