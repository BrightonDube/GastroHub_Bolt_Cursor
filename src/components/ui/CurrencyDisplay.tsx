import React from 'react';
import { useLocalization } from '../../context/LocalizationProvider';
import { formatCurrency, formatDualCurrency } from '../../utils/currency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showBothCurrencies?: boolean; // Show USD + ZAR conversion during transition
  forceCurrency?: 'USD' | 'ZAR'; // Override the context currency
  sourceCurrency?: 'USD' | 'ZAR'; // Specify what currency the input amount is in (defaults to USD)
}

export function CurrencyDisplay({ 
  amount, 
  className = '',
  showBothCurrencies = false,
  forceCurrency,
  sourceCurrency = 'USD' // Default assumption: input amounts are in USD
}: CurrencyDisplayProps) {
  const { currency } = useLocalization();
  
  // Use forced currency if provided, otherwise use context currency
  const currentCurrency = forceCurrency || currency;
  
  // During transition, show both currencies when requested
  if (showBothCurrencies) {
    return (
      <span className={className}>
        {formatDualCurrency(amount, currentCurrency)}
      </span>
    );
  }
  
  return (
    <span className={className}>
      {formatCurrency(amount, currentCurrency, { value: amount, currency: sourceCurrency })}
    </span>
  );
}

// Convenience components for specific currencies
export function USDDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  return <CurrencyDisplay amount={amount} className={className} forceCurrency="USD" />;
}

export function ZARDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  return <CurrencyDisplay amount={amount} className={className} forceCurrency="ZAR" />;
} 