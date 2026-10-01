import { useContext } from 'react';
import { ERPContext } from './erpContextDef';

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
