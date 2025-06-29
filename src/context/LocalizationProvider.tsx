import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocalizationContextType {
  currency: 'USD' | 'ZAR';
  timezone: 'UTC' | 'SAST';
  setCurrency: (currency: 'USD' | 'ZAR') => void;
  setTimezone: (timezone: 'UTC' | 'SAST') => void;
  isZARMode: boolean;
  isSASTMode: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  // Start with ZAR/SAST for South African market
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>(() => {
    // Try to get from localStorage, default to ZAR for SA market
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gastrohub-currency');
      return (saved === 'ZAR' || saved === 'USD') ? saved : 'ZAR';
    }
    return 'ZAR';
  });
  
  const [timezone, setTimezone] = useState<'UTC' | 'SAST'>(() => {
    // Try to get from localStorage, default to SAST for SA market
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gastrohub-timezone');
      return (saved === 'SAST' || saved === 'UTC') ? saved : 'SAST';
    }
    return 'SAST';
  });

  // Persist preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gastrohub-currency', currency);
    }
  }, [currency]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gastrohub-timezone', timezone);
    }
  }, [timezone]);

  const value = {
    currency,
    timezone,
    setCurrency,
    setTimezone,
    isZARMode: currency === 'ZAR',
    isSASTMode: timezone === 'SAST'
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
}