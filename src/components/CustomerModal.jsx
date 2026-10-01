import React, { useState } from 'react';
import { Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CustomerModal({ isOpen, initialData, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: initialData?.id || '',
    originalId: initialData?.id || '',
    name: initialData?.name || '',
    phone: initialData?.phone || initialData?.id || '',
    area: initialData?.area || ''
  }));

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = form.phone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 7) {
      setErrorMessage('Please enter a valid mobile number (minimum 7 digits). It acts as the customer unique ID.');
      return;
    }

    const payload = {
      ...form,
      id: cleanPhone,
      phone: cleanPhone,
      originalId: form.originalId
    };

    const res = onSave(payload);
    if (res && !res.success) {
      setErrorMessage(res.error || 'Failed to save customer.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {form.originalId ? 'Edit Customer Details' : 'Add Customer for Brand'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer identity is uniquely scoped by mobile number at this company level.
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
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Customer Full Name</label>
            <input
              type="text"
              placeholder="e.g. Suresh Kumar"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrorMessage(''); }}
              required
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Mobile Number (Unique ID)
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Company Unique Key</span>
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="e.g. 9848012345"
                value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrorMessage(''); }}
                required
                className="w-full pl-9 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-medium outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              This mobile number serves as the customer's permanent unique ID in this company's registry.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Village / Area / Route</label>
            <input
              type="text"
              placeholder="e.g. Jubilee Hills / Route A"
              value={form.area}
              onChange={(e) => { setForm({ ...form, area: e.target.value }); setErrorMessage(''); }}
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
              {form.originalId ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
