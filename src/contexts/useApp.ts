import { useContext } from 'react';
import { AppContext } from './AppContext';

/**
 * Hook d'accès au contexte global de l'application
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
