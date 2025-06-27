import React from 'react';
import { useLocalization } from '../../context/LocalizationProvider';
import { formatCurrency, formatDualCurrency, formatCurrencyWithVAT } from '../../utils/currency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showBothCurrencies?: boolean; // Show USD + ZAR conversion during transition
  forceCurrency?: 'USD' | 'ZAR'; // Override the context currency
  sourceCurrency?: 'USD' | 'ZAR'; // Specify what currency the input amount is in (defaults to USD)
  showVAT?: boolean; // Show VAT information
  showVATBreakdown?: boolean; // Show detailed VAT breakdown
  includeVAT?: boolean; // Whether the amount includes VAT (default: true)
}

export function CurrencyDisplay({ 
  amount, 
  className = '',
  showBothCurrencies = false,
  forceCurrency,
  sourceCurrency,
  showVAT = false,
  showVATBreakdown = false,
  includeVAT = true
}: CurrencyDisplayProps) {
  const { currency } = useLocalization();
  
  // Use forced currency if provided, otherwise use context currency
  const currentCurrency = forceCurrency || currency;
  
  if (showVAT) {
    return (
      <span className={className}>
        {formatCurrencyWithVAT(amount, {
          currencyCode: currentCurrency,
          showVATBreakdown,
          includeVAT
        })}
      </span>
    );
  }
  
  if (showBothCurrencies) {
    return (
      <span className={className}>
        {formatDualCurrency(amount, currentCurrency)}
      </span>
    );
  }
  
  return (
    <span className={className}>
      {formatCurrency(amount, currentCurrency, sourceCurrency ? { value: amount, currency: sourceCurrency } : undefined)}
    </span>
  );
}

// Convenience component for VAT display
export function VATDisplay({ 
  amount, 
  className = '', 
  showBreakdown = false,
  includeVAT = true
}: { 
  amount: number; 
  className?: string; 
  showBreakdown?: boolean;
  includeVAT?: boolean;
}) {
  return (
    <CurrencyDisplay 
      amount={amount} 
      className={className} 
      showVAT={true}
      showVATBreakdown={showBreakdown}
      includeVAT={includeVAT}
    />
  );
}

// Convenience components for specific currencies
export function USDDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  return <CurrencyDisplay amount={amount} className={className} forceCurrency="USD" />;
}

export function ZARDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  return <CurrencyDisplay amount={amount} className={className} forceCurrency="ZAR" />;
} 