import React, { useState } from 'react';
import { Tag, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SellingItemModal({ isOpen, initialData, existingItems = [], onClose, onSave }) {
  // Compute default suggested SKU ID for this outlet
  const defaultSuggestedSku = React.useMemo(() => {
    if (initialData?.skuCode || initialData?.id) {
      return initialData.skuCode || initialData.id;
    }
    const existingNums = (existingItems || []).map(i => {
      const match = (i.skuCode || i.id || '').toString().match(/SKU-?(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    const nextNum = Math.max(100, ...existingNums) + 1;
    return `SKU-${nextNum}`;
  }, [initialData, existingItems]);

  const [form, setForm] = useState(() => ({
    id: initialData?.id || '',
    originalSkuCode: initialData?.skuCode || initialData?.id || '',
    skuCode: initialData?.skuCode || initialData?.id || defaultSuggestedSku,
    name: initialData?.name || '',
    category: initialData?.category || '',
    mrp: initialData?.mrp || '',
    price: initialData?.price || '',
    stock: initialData?.stock ?? 100
  }));

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanSku = (form.skuCode || defaultSuggestedSku).trim().toUpperCase();
    if (!cleanSku) {
      setErrorMessage('SKU Unique ID is required for this outlet.');
      return;
    }

    const payload = {
      ...form,
      skuCode: cleanSku,
      id: form.id || cleanSku,
      originalSkuCode: form.originalSkuCode,
      mrp: Number(form.mrp) || Math.round(Number(form.price) * 1.1),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0
    };

    const res = onSave(payload);
    if (res && !res.success) {
      setErrorMessage(res.error || 'Failed to save item.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {form.originalSkuCode ? 'Edit Selling Item / SKU' : 'Add Selling Item / SKU'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Each product must have a unique SKU identifier at this outlet level.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* SKU Unique ID */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                SKU Unique ID (Outlet Level)
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Outlet Unique ID</span>
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. SKU-101 or COW-MILK-1L"
                value={form.skuCode}
                onChange={(e) => { setForm({ ...form, skuCode: e.target.value }); setErrorMessage(''); }}
                required
                className="w-full pl-9 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold uppercase outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Auto-assigned or enter your custom item barcode / code. Unique across this outlet.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Item / SKU Name</label>
            <input
              type="text"
              placeholder="e.g. Cow Milk 1L Pack"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrorMessage(''); }}
              required
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g. Dairy / Food Products / Cleaning"
              value={form.category}
              onChange={(e) => { setForm({ ...form, category: e.target.value }); setErrorMessage(''); }}
              required
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">MRP (₹)</label>
              <input
                type="number"
                step="0.5"
                placeholder="75"
                value={form.mrp}
                onChange={(e) => { setForm({ ...form, mrp: e.target.value }); setErrorMessage(''); }}
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.5"
                placeholder="70"
                value={form.price}
                onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrorMessage(''); }}
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 font-semibold text-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Opening Stock Quantity</label>
            <input
              type="number"
              placeholder="100"
              value={form.stock}
              onChange={(e) => { setForm({ ...form, stock: e.target.value }); setErrorMessage(''); }}
              required
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-sm transition"
            >
              {form.originalSkuCode ? 'Update SKU' : 'Save SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
