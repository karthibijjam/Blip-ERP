import React from 'react';
import { useERP } from '../context/useERP';

export default function BrandModulesManageView() {
  const { 
    db, 
    currentManageBrandId, 
    setActiveTab, 
    moveBrandModule 
  } = useERP();

  const brand = (db.brands || []).find(b => b.id === currentManageBrandId) || { name: 'Brand' };
  const modules = db.brandModules?.[currentManageBrandId] || [];

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('brand-manage')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Manage Modules – {brand.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Arrange and reorder the display sequence of modules and hub cards for this brand.
            </p>
          </div>
        </div>
      </div>

      {/* Modules List Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm text-slate-700 flex justify-between items-center">
          <span>Active Modules & Display Sequence</span>
          <span className="text-xs font-normal text-slate-500">Use up/down buttons to reorder cards</span>
        </div>

        <div className="divide-y divide-slate-100 p-4 space-y-3">
          {modules.map((m, idx) => (
            <div
              key={m.id || idx}
              className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-slate-300 transition"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2.5 bg-${m.color}-100 text-${m.color}-700 rounded-xl text-lg`}>
                  <i className={m.icon}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{m.name}</h4>
                  <p className="text-xs text-slate-500">{m.desc}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => moveBrandModule(currentManageBrandId, idx, -1)}
                  disabled={idx === 0}
                  className={`p-2 rounded-xl transition ${
                    idx === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'hover:bg-slate-200 text-slate-700 active:scale-95'
                  }`}
                  title="Move module up"
                >
                  <i className="fa-solid fa-arrow-up text-xs"></i>
                </button>
                <button
                  onClick={() => moveBrandModule(currentManageBrandId, idx, 1)}
                  disabled={idx === modules.length - 1}
                  className={`p-2 rounded-xl transition ${
                    idx === modules.length - 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'hover:bg-slate-200 text-slate-700 active:scale-95'
                  }`}
                  title="Move module down"
                >
                  <i className="fa-solid fa-arrow-down text-xs"></i>
                </button>
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No modules defined for this brand.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
