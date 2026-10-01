import React, { useState } from 'react';
import { useERP } from '../context/useERP';
import confetti from 'canvas-confetti';
import CustomerModal from './CustomerModal';
import SellingItemModal from './SellingItemModal';

export default function ModalManager() {
  const {
    db,
    modalState,
    closeModal,
    saveBrand,
    deleteBrand,
    currentManageBrandId,
    setActiveTab,
    saveBrandCustomer,
    saveSellingItem,
    saveNewUser,
    addDairyProcurement,
    addDairyFarmer,
    addDairyCustomer,
    addDeliveryRoute,
    addFarmsPurchase,
    addFarmsSale,
    addPlantrixPurchase,
    addPlantrixSale,
    addMixedExpense,
    customRange,
    setCustomRange,
    setDateFilter,
    exportCSVReport
  } = useERP();

  // Local form states
  const [brandForm, setBrandForm] = useState({ id: '', name: '', subtitle: '', icon: 'fa-solid fa-leaf', color: 'amber' });
  const [delPassword, setDelPassword] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Manager', brand: 'All Brands', password: '' });

  // Dairy procurement
  const [dpForm, setDpForm] = useState({ date: '2026-09-30', shift: 'Morning', farmer: '', qty: '', fat: '6.5', snf: '8.5', rate: '48' });
  // Dairy farmer
  const [dfForm, setDfForm] = useState({ name: '', phone: '', area: '' });
  // Dairy customer
  const [dcustForm, setDcustForm] = useState({ name: '', route: '', phone: '', sku: 'Cow Milk 1L', bill: '' });
  // Delivery route
  const [drForm, setDrForm] = useState({ name: '', executive: '', customers: '25', shift: 'Morning (5:00 AM - 8:00 AM)' });

  // Farms
  const [fpForm, setFpForm] = useState({ date: '2026-09-30', supplier: '', sku: '', qty: '10 Packets', amount: '' });
  const [fsForm, setFsForm] = useState({ date: '2026-09-30', customer: '', sku: '', status: 'Paid', amount: '' });

  // Plantrix
  const [ppForm, setPpForm] = useState({ date: '2026-09-30', supplier: '', sku: '', qty: '5 Jars', amount: '' });
  const [psForm, setPsForm] = useState({ date: '2026-09-30', customer: '', sku: '', status: 'Paid', amount: '' });

  // Mixed
  const [mixForm, setMixForm] = useState({ date: '2026-09-30', category: 'Salaries & Wages', desc: '', amount: '' });

  // Custom date
  const [customStart, setCustomStart] = useState(customRange.start || '2026-09-01');
  const [customEnd, setCustomEnd] = useState(customRange.end || '2026-09-30');

  // Live routes delivery checklist
  const [routeChecks, setRouteChecks] = useState({});

  // Handle Brand Submit
  const handleBrandSubmit = (e) => {
    e.preventDefault();
    saveBrand(brandForm);
    closeModal('brandModal');
    setBrandForm({ id: '', name: '', subtitle: '', icon: 'fa-solid fa-leaf', color: 'amber' });
  };

  // Handle Delete Brand
  const handleDeleteBrand = (e) => {
    e.preventDefault();
    const result = deleteBrand(currentManageBrandId, delPassword);
    if (!result.success) {
      alert(result.message);
      return;
    }
    alert(result.message);
    setDelPassword('');
    closeModal('deleteBrandModal');
    setActiveTab('dashboard');
  };

  // Handle Add User
  const handleUserSubmit = (e) => {
    e.preventDefault();
    const res = saveNewUser(userForm);
    if (res && !res.success) {
      alert(res.error);
      return;
    }
    closeModal('addUserModal');
    setUserForm({ name: '', email: '', role: 'Manager', brand: 'All Brands', password: '' });
  };

  // Dairy procurement submit
  const handleDpSubmit = (e) => {
    e.preventDefault();
    const qty = parseFloat(dpForm.qty) || 0;
    const rate = parseFloat(dpForm.rate) || 0;
    addDairyProcurement({
      date: dpForm.date,
      shift: dpForm.shift,
      farmer: dpForm.farmer,
      qty,
      fat: parseFloat(dpForm.fat) || 0,
      snf: parseFloat(dpForm.snf) || 0,
      rate,
      total: qty * rate
    });
    closeModal('dairyProcurementModal');
    setDpForm({ date: '2026-09-30', shift: 'Morning', farmer: '', qty: '', fat: '6.5', snf: '8.5', rate: '48' });
  };

  // Dairy farmer submit
  const handleDfSubmit = (e) => {
    e.preventDefault();
    addDairyFarmer(dfForm);
    closeModal('dairyFarmerModal');
    setDfForm({ name: '', phone: '', area: '' });
  };

  // Dairy customer submit
  const handleDcustSubmit = (e) => {
    e.preventDefault();
    const route = dcustForm.route || db.deliveryRoutes?.[0]?.name || 'Route A - Jubilee Hills';
    addDairyCustomer({
      name: dcustForm.name,
      route,
      phone: dcustForm.phone,
      sku: dcustForm.sku,
      bill: parseFloat(dcustForm.bill) || 0
    });
    closeModal('dairyCustomerModal');
    setDcustForm({ name: '', route: '', phone: '', sku: 'Cow Milk 1L', bill: '' });
  };

  // Delivery route submit
  const handleDrSubmit = (e) => {
    e.preventDefault();
    addDeliveryRoute({
      name: drForm.name,
      executive: drForm.executive,
      customers: parseInt(drForm.customers) || 20,
      shift: drForm.shift
    });
    closeModal('deliveryRouteModal');
    setDrForm({ name: '', executive: '', customers: '25', shift: 'Morning (5:00 AM - 8:00 AM)' });
  };

  // Farms purchase
  const handleFpSubmit = (e) => {
    e.preventDefault();
    addFarmsPurchase({
      date: fpForm.date,
      supplier: fpForm.supplier,
      sku: fpForm.sku,
      qty: fpForm.qty,
      amount: parseFloat(fpForm.amount) || 0
    });
    closeModal('farmsPurchaseModal');
    setFpForm({ date: '2026-09-30', supplier: '', sku: '', qty: '10 Packets', amount: '' });
  };

  // Farms sale
  const handleFsSubmit = (e) => {
    e.preventDefault();
    addFarmsSale({
      date: fsForm.date,
      customer: fsForm.customer,
      sku: fsForm.sku,
      status: fsForm.status,
      amount: parseFloat(fsForm.amount) || 0
    });
    closeModal('farmsSaleModal');
    setFsForm({ date: '2026-09-30', customer: '', sku: '', status: 'Paid', amount: '' });
  };

  // Plantrix purchase
  const handlePpSubmit = (e) => {
    e.preventDefault();
    addPlantrixPurchase({
      date: ppForm.date,
      supplier: ppForm.supplier,
      sku: ppForm.sku,
      qty: ppForm.qty,
      amount: parseFloat(ppForm.amount) || 0
    });
    closeModal('plantrixPurchaseModal');
    setPpForm({ date: '2026-09-30', supplier: '', sku: '', qty: '5 Jars', amount: '' });
  };

  // Plantrix sale
  const handlePsSubmit = (e) => {
    e.preventDefault();
    addPlantrixSale({
      date: psForm.date,
      customer: psForm.customer,
      sku: psForm.sku,
      status: psForm.status,
      amount: parseFloat(psForm.amount) || 0
    });
    closeModal('plantrixSaleModal');
    setPsForm({ date: '2026-09-30', customer: '', sku: '', status: 'Paid', amount: '' });
  };

  // Mixed expense
  const handleMixSubmit = (e) => {
    e.preventDefault();
    addMixedExpense({
      date: mixForm.date,
      category: mixForm.category,
      desc: mixForm.desc,
      amount: parseFloat(mixForm.amount) || 0
    });
    closeModal('mixedModal');
    setMixForm({ date: '2026-09-30', category: 'Salaries & Wages', desc: '', amount: '' });
  };

  // Custom date range
  const handleCustomDateSubmit = () => {
    if (!customStart || !customEnd) {
      alert('Please select both start and end dates.');
      return;
    }
    setCustomRange({ start: customStart, end: customEnd });
    setDateFilter('custom');
    closeModal('customDateModal');
  };

  // Finish deliveries with confetti
  const handleFinishDeliveries = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    closeModal('startDeliveriesModal');
    alert('Daily delivery run saved and marked completed!');
  };

  return (
    <>
      {/* 1. BRAND MODAL */}
      {modalState.brandModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {brandForm.id ? 'Edit Company Brand' : 'Create New Company Brand'}
              </h3>
              <button onClick={() => closeModal('brandModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleBrandSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bijjam Organic"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description / Category</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Vegetables & Honey"
                  value={brandForm.subtitle}
                  onChange={(e) => setBrandForm({ ...brandForm, subtitle: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Icon (FontAwesome)</label>
                  <input
                    type="text"
                    value={brandForm.icon}
                    onChange={(e) => setBrandForm({ ...brandForm, icon: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Theme Color</label>
                  <select
                    value={brandForm.color}
                    onChange={(e) => setBrandForm({ ...brandForm, color: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="amber">Amber / Dairy</option>
                    <option value="emerald">Emerald / Farms</option>
                    <option value="cyan">Cyan / Plantrix</option>
                    <option value="purple">Purple / Special</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('brandModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DELETE BRAND CONFIRMATION MODAL */}
      {modalState.deleteBrandModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Verify Admin Password</h3>
              <button onClick={() => closeModal('deleteBrandModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please enter your ERP user password to confirm deletion of brand{' '}
              <strong className="text-slate-900">{currentManageBrandId}</strong>.
            </p>
            <form onSubmit={handleDeleteBrand} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">User Password</label>
                <input
                  type="password"
                  placeholder="Enter password (default: admin123)"
                  value={delPassword}
                  onChange={(e) => setDelPassword(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('deleteBrandModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm"
                >
                  Delete Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT CUSTOMER MODAL */}
      <CustomerModal
        key={modalState.editCustomerData?.id ? `cust-${modalState.editCustomerData.id}` : 'cust-new'}
        isOpen={modalState.addCustomerModal}
        initialData={modalState.editCustomerData}
        onClose={() => closeModal('addCustomerModal')}
        onSave={(data) => {
          const res = saveBrandCustomer(currentManageBrandId, data);
          if (res && !res.success) {
            return res;
          }
          closeModal('addCustomerModal');
          return res;
        }}
      />

      {/* 4. ADD / EDIT SELLING ITEM MODAL */}
      <SellingItemModal
        key={modalState.editSellingItemData?.id ? `item-${modalState.editSellingItemData.id}` : 'item-new'}
        isOpen={modalState.sellingItemModal}
        initialData={modalState.editSellingItemData}
        existingItems={db.sellingItemsByBrand?.[currentManageBrandId] || []}
        onClose={() => closeModal('sellingItemModal')}
        onSave={(data) => {
          const res = saveSellingItem(currentManageBrandId, data);
          if (res && !res.success) {
            return res;
          }
          closeModal('sellingItemModal');
          return res;
        }}
      />

      {/* 5. ADD ERP USER MODAL */}
      {modalState.addUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add New ERP System User</h3>
              <button onClick={() => closeModal('addUserModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email ID</label>
                  <input
                    type="email"
                    placeholder="rajesh@bijjam.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Assigned Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Delivery Executive">Delivery Executive</option>
                    <option value="Admin">Admin (Full Control)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Brand Access</label>
                  <select
                    value={userForm.brand}
                    onChange={(e) => setUserForm({ ...userForm, brand: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="All Brands">All Brands (Group Level)</option>
                    {(db.brands || []).map(b => (
                      <option key={b.id} value={b.name}>{b.name} Only</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('addUserModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-sm"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DAIRY MILK PROCUREMENT MODAL */}
      {modalState.dairyProcurementModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Farmer Milk Procurement</h3>
              <button onClick={() => closeModal('dairyProcurementModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleDpSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={dpForm.date}
                    onChange={(e) => setDpForm({ ...dpForm, date: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Shift</label>
                  <select
                    value={dpForm.shift}
                    onChange={(e) => setDpForm({ ...dpForm, shift: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Farmer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={dpForm.farmer}
                  onChange={(e) => setDpForm({ ...dpForm, farmer: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Qty (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="15.0"
                    value={dpForm.qty}
                    onChange={(e) => setDpForm({ ...dpForm, qty: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="6.5"
                    value={dpForm.fat}
                    onChange={(e) => setDpForm({ ...dpForm, fat: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">SNF %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    value={dpForm.snf}
                    onChange={(e) => setDpForm({ ...dpForm, snf: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Rate per Liter (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="48"
                  value={dpForm.rate}
                  onChange={(e) => setDpForm({ ...dpForm, rate: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('dairyProcurementModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Procurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DAIRY MILK FARMER MODAL */}
      {modalState.dairyFarmerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add New Milk Farmer</h3>
              <button onClick={() => closeModal('dairyFarmerModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleDfSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={dfForm.name}
                  onChange={(e) => setDfForm({ ...dfForm, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="9848012345"
                    value={dfForm.phone}
                    onChange={(e) => setDfForm({ ...dfForm, phone: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Village / Area</label>
                  <input
                    type="text"
                    placeholder="Jubilee Hills"
                    value={dfForm.area}
                    onChange={(e) => setDfForm({ ...dfForm, area: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('dairyFarmerModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DAIRY CUSTOMER MODAL */}
      {modalState.dairyCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Dairy Delivery Customer & SKUs</h3>
              <button onClick={() => closeModal('dairyCustomerModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleDcustSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Srinivas Rao"
                  value={dcustForm.name}
                  onChange={(e) => setDcustForm({ ...dcustForm, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Route / Area</label>
                  <select
                    value={dcustForm.route}
                    onChange={(e) => setDcustForm({ ...dcustForm, route: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 bg-white"
                  >
                    {(db.deliveryRoutes || []).map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="9848012345"
                    value={dcustForm.phone}
                    onChange={(e) => setDcustForm({ ...dcustForm, phone: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Subscribed SKU / Items</label>
                  <input
                    type="text"
                    placeholder="Cow Milk 1L, Buffalo Milk 0.5L"
                    value={dcustForm.sku}
                    onChange={(e) => setDcustForm({ ...dcustForm, sku: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Estimated Monthly Bill (₹)</label>
                  <input
                    type="number"
                    placeholder="1950"
                    value={dcustForm.bill}
                    onChange={(e) => setDcustForm({ ...dcustForm, bill: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('dairyCustomerModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. DELIVERY ROUTE MODAL */}
      {modalState.deliveryRouteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Assign Delivery Route & Executive</h3>
              <button onClick={() => closeModal('deliveryRouteModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleDrSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Route Name / Code</label>
                <input
                  type="text"
                  placeholder="Route A - Jubilee Hills"
                  value={drForm.name}
                  onChange={(e) => setDrForm({ ...drForm, name: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Assigned Delivery Executive</label>
                <input
                  type="text"
                  placeholder="Rajesh Sharma"
                  value={drForm.executive}
                  onChange={(e) => setDrForm({ ...drForm, executive: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Assigned Customers</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={drForm.customers}
                    onChange={(e) => setDrForm({ ...drForm, customers: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Shift Timing</label>
                  <select
                    value={drForm.shift}
                    onChange={(e) => setDrForm({ ...drForm, shift: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500 bg-white"
                  >
                    <option value="Morning (5:00 AM - 8:00 AM)">Morning (5 AM - 8 AM)</option>
                    <option value="Evening (5:00 PM - 7:00 PM)">Evening (5 PM - 7 PM)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('deliveryRouteModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Route Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. FARMS PURCHASE MODAL */}
      {modalState.farmsPurchaseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Bulk Purchase - Bijjam Farms</h3>
              <button onClick={() => closeModal('farmsPurchaseModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleFpSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={fpForm.date}
                    onChange={(e) => setFpForm({ ...fpForm, date: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="Organic Mill Agro"
                    value={fpForm.supplier}
                    onChange={(e) => setFpForm({ ...fpForm, supplier: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Product SKU Description</label>
                <input
                  type="text"
                  placeholder="50kg Organic Millet Flour"
                  value={fpForm.sku}
                  onChange={(e) => setFpForm({ ...fpForm, sku: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quantity</label>
                  <input
                    type="text"
                    placeholder="50 Packets"
                    value={fpForm.qty}
                    onChange={(e) => setFpForm({ ...fpForm, qty: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="4500"
                    value={fpForm.amount}
                    onChange={(e) => setFpForm({ ...fpForm, amount: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('farmsPurchaseModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-sm"
                >
                  Save Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. FARMS SALE MODAL */}
      {modalState.farmsSaleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Customer Sale - Bijjam Farms</h3>
              <button onClick={() => closeModal('farmsSaleModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleFsSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={fsForm.date}
                    onChange={(e) => setFsForm({ ...fsForm, date: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Sunitha"
                    value={fsForm.customer}
                    onChange={(e) => setFsForm({ ...fsForm, customer: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Items / SKUs Sold</label>
                <input
                  type="text"
                  placeholder="Millet Flour 2kg, Honey 500g"
                  value={fsForm.sku}
                  onChange={(e) => setFsForm({ ...fsForm, sku: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Payment Status</label>
                  <select
                    value={fsForm.status}
                    onChange={(e) => setFsForm({ ...fsForm, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Total Sale Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="680"
                    value={fsForm.amount}
                    onChange={(e) => setFsForm({ ...fsForm, amount: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('farmsSaleModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. PLANTRIX PURCHASE MODAL */}
      {modalState.plantrixPurchaseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Purchase - Eco Plantrix</h3>
              <button onClick={() => closeModal('plantrixPurchaseModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handlePpSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={ppForm.date}
                    onChange={(e) => setPpForm({ ...ppForm, date: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="GreenChem Lab"
                    value={ppForm.supplier}
                    onChange={(e) => setPpForm({ ...ppForm, supplier: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Product SKU / Description</label>
                <input
                  type="text"
                  placeholder="Herbal Floor Cleaner 5L Jars"
                  value={ppForm.sku}
                  onChange={(e) => setPpForm({ ...ppForm, sku: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quantity</label>
                  <input
                    type="text"
                    placeholder="20 Jars"
                    value={ppForm.qty}
                    onChange={(e) => setPpForm({ ...ppForm, qty: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="3200"
                    value={ppForm.amount}
                    onChange={(e) => setPpForm({ ...ppForm, amount: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('plantrixPurchaseModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-sm"
                >
                  Save Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. PLANTRIX SALE MODAL */}
      {modalState.plantrixSaleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Customer Sale - Eco Plantrix</h3>
              <button onClick={() => closeModal('plantrixSaleModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handlePsSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={psForm.date}
                    onChange={(e) => setPsForm({ ...psForm, date: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Apex Apartments"
                    value={psForm.customer}
                    onChange={(e) => setPsForm({ ...psForm, customer: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Cleaning SKUs Sold</label>
                <input
                  type="text"
                  placeholder="Dishwash 1L, Floor Cleaner 5L"
                  value={psForm.sku}
                  onChange={(e) => setPsForm({ ...psForm, sku: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Payment Status</label>
                  <select
                    value={psForm.status}
                    onChange={(e) => setPsForm({ ...psForm, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500 bg-white"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Total Sale Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="1250"
                    value={psForm.amount}
                    onChange={(e) => setPsForm({ ...psForm, amount: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('plantrixSaleModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 14. MIXED SPENDS / SALARY MODAL */}
      {modalState.mixedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add Common Expense / Salary</h3>
              <button onClick={() => closeModal('mixedModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleMixSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={mixForm.date}
                    onChange={(e) => setMixForm({ ...mixForm, date: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Category</label>
                  <select
                    value={mixForm.category}
                    onChange={(e) => setMixForm({ ...mixForm, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Salaries & Wages">Salaries & Wages</option>
                    <option value="Office Rent">Office & Godown Rent</option>
                    <option value="Transport & Logistics">Transport & Fuel</option>
                    <option value="Utilities">Electricity & Utilities</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Particulars / Description</label>
                <input
                  type="text"
                  placeholder="Monthly Staff Salaries"
                  value={mixForm.desc}
                  onChange={(e) => setMixForm({ ...mixForm, desc: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="45000"
                  value={mixForm.amount}
                  onChange={(e) => setMixForm({ ...mixForm, amount: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => closeModal('mixedModal')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 15. CUSTOM DATE RANGE MODAL */}
      {modalState.customDateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Select Custom Date Range</h3>
              <button onClick={() => closeModal('customDateModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('customDateModal')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCustomDateSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-sm"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. START DELIVERIES LIVE RUN MODAL */}
      {modalState.startDeliveriesModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Live Delivery Run Execution</h3>
              </div>
              <button onClick={() => closeModal('startDeliveriesModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Select active delivery routes below to verify morning subscriptions and record bottle deliveries.
            </p>

            <div className="space-y-3">
              {(db.deliveryRoutes || []).map((r, idx) => (
                <div
                  key={r.id || idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{r.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Executive: <strong className="text-slate-700">{r.executive}</strong> | Shift: {r.shift}
                    </p>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {r.customers} Customers Subscribed
                    </span>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-400 transition">
                    <input
                      type="checkbox"
                      checked={routeChecks[r.id] !== false}
                      onChange={(e) => setRouteChecks({ ...routeChecks, [r.id]: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-slate-700">Completed Run</span>
                  </label>
                </div>
              ))}

              {(db.deliveryRoutes || []).length === 0 && (
                <p className="text-center py-6 text-slate-400 text-xs">No active routes created.</p>
              )}
            </div>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('startDeliveriesModal')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleFinishDeliveries}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm"
              >
                Save & Finish Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 17. EXPORT FINANCIAL REPORTS MODAL */}
      {modalState.reportsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <i className="fa-solid fa-file-lines text-blue-600"></i>
                <span>Export Financial Reports</span>
              </h3>
              <button onClick={() => closeModal('reportsModal')} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Export comprehensive P&L statements, customer balances, and procurement logs for all brands directly as downloadable CSV files.
            </p>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Consolidated P&L Statement</h4>
                  <p className="text-[11px] text-slate-500">Summary across all brands</p>
                </div>
                <button
                  onClick={() => exportCSVReport('pnl')}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition flex items-center space-x-1"
                >
                  <i className="fa-solid fa-download text-[10px]"></i>
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Customer Outstanding Dues Report</h4>
                  <p className="text-[11px] text-slate-500">Pending collections and route dues</p>
                </div>
                <button
                  onClick={() => exportCSVReport('dues')}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-sm transition flex items-center space-x-1"
                >
                  <i className="fa-solid fa-download text-[10px]"></i>
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Dairy Procurement & Farmer Summary</h4>
                  <p className="text-[11px] text-slate-500">Shift-wise milk procurement & fat stats</p>
                </div>
                <button
                  onClick={() => exportCSVReport('procurement')}
                  className="px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 shadow-sm transition flex items-center space-x-1"
                >
                  <i className="fa-solid fa-download text-[10px]"></i>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('reportsModal')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
