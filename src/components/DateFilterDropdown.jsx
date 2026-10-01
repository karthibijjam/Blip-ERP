import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../context/useERP';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export default function DateFilterDropdown({ className = '' }) {
  const { 
    dateFilter, 
    setDateFilter, 
    dateFilterLabel, 
    openModal 
  } = useERP();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectFilter = (val) => {
    if (val === 'custom') {
      openModal('customDateModal');
    } else {
      setDateFilter(val);
    }
    setIsOpen(false);
  };

  const options = [
    { id: 'month', label: 'This Month', desc: 'Current calendar month' },
    { id: 'lastMonth', label: 'Last Month', desc: 'Previous calendar month' },
    { id: 'today', label: 'Today', desc: 'Current day activities' },
    { id: 'last30', label: 'Last 30 Days', desc: 'Rolling 30 days window' },
    { id: 'quarter', label: 'This Quarter', desc: 'Current fiscal quarter' },
    { id: 'fy', label: 'This Financial Year', desc: 'FY 2026-2027' },
    { id: 'custom', label: 'Custom Range...', desc: 'Pick start & end date' },
    { id: 'all', label: 'All Time', desc: 'Complete records history' },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-sm select-none"
        title="Change date filter range"
      >
        <Calendar size={14} className="text-emerald-600 shrink-0" />
        <span className="font-semibold text-slate-800">{dateFilterLabel}</span>
        <ChevronDown 
          size={13} 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-40 p-1.5 space-y-0.5 animate-modal-pop text-slate-800">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Filter Date Range
            </p>
          </div>

          {options.map((opt) => {
            const isSelected = dateFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectFilter(opt.id)}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition flex justify-between items-center ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div>
                  <p className="leading-tight">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && <Check size={14} className="text-emerald-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
