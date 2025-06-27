export interface CurrencyConfig {
  code: 'USD' | 'ZAR';
  symbol: string;
  locale: string;
}

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  ZAR: { code: 'ZAR', symbol: 'R', locale: 'en-ZA' }
};

export const DEFAULT_CURRENCY = 'USD'; // Keep USD as default for safety
export const TARGET_CURRENCY = 'ZAR';

export function formatCurrency(amount: number, currencyCode: string = DEFAULT_CURRENCY): string {
  const config = CURRENCY_CONFIGS[currencyCode];
  if (!config) return `${amount}`; // Fallback for safety
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
  }).format(amount);
}

// Keep existing function for backward compatibility
export function formatPrice(amount: number): string {
  return formatCurrency(amount, DEFAULT_CURRENCY);
}

// New ZAR function
export function formatPriceZAR(amount: number): string {
  return formatCurrency(amount, TARGET_CURRENCY);
}

// Conversion utilities (approximate rates)
export const EXCHANGE_RATES = {
  USD_TO_ZAR: 18.5,
  ZAR_TO_USD: 1 / 18.5
};

export function convertUSDToZAR(usdAmount: number): number {
  return usdAmount * EXCHANGE_RATES.USD_TO_ZAR;
}

export function convertZARToUSD(zarAmount: number): number {
  return zarAmount * EXCHANGE_RATES.ZAR_TO_USD;
}

// Utility for dual currency display
export function formatDualCurrency(amount: number, primaryCurrency: 'USD' | 'ZAR'): string {
  const primary = formatCurrency(amount, primaryCurrency);
  const secondary = primaryCurrency === 'USD' 
    ? formatCurrency(convertUSDToZAR(amount), 'ZAR')
    : formatCurrency(convertZARToUSD(amount), 'USD');
  
  return `${primary} (~${secondary})`;
} 