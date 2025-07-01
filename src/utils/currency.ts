// South African currency configuration
export const SA_CURRENCY_CONFIG = {
  primary: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    decimals: 2,
  },
  secondary: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
  },
  // Exchange rates (should be fetched from API in production)
  exchangeRates: {
    ZAR_TO_USD: 0.055, // 1 ZAR = 0.055 USD (approximate)
    USD_TO_ZAR: 18.18,  // 1 USD = 18.18 ZAR (approximate)
  },
} as const;

export type CurrencyCode = 'ZAR' | 'USD';

export interface CurrencyAmount {
  amount: number;
  currency: CurrencyCode;
}

export interface FormattedCurrency {
  formatted: string;
  amount: number;
  currency: CurrencyCode;
  symbol: string;
}

/**
 * Format currency amount in ZAR (primary currency)
 */
export function formatZAR(
  amount: number,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals = SA_CURRENCY_CONFIG.primary.decimals,
  } = options;

  const formattedAmount = new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  let result = '';
  if (showSymbol) result += SA_CURRENCY_CONFIG.primary.symbol;
  result += formattedAmount;
  if (showCode) result += ` ${SA_CURRENCY_CONFIG.primary.code}`;

  return result;
}

/**
 * Format currency amount in USD (secondary currency)
 */
export function formatUSD(
  amount: number,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals = SA_CURRENCY_CONFIG.secondary.decimals,
  } = options;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  let result = '';
  if (showSymbol) result += SA_CURRENCY_CONFIG.secondary.symbol;
  result += formattedAmount;
  if (showCode) result += ` ${SA_CURRENCY_CONFIG.secondary.code}`;

  return result;
}

/**
 * Universal currency formatter - defaults to ZAR
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'ZAR',
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
  } = {}
): FormattedCurrency {
  const formatter = currency === 'ZAR' ? formatZAR : formatUSD;
  const config = currency === 'ZAR' ? SA_CURRENCY_CONFIG.primary : SA_CURRENCY_CONFIG.secondary;
  
  return {
    formatted: formatter(amount, options),
    amount,
    currency,
    symbol: config.symbol,
  };
}

/**
 * Convert ZAR to USD
 */
export function zarToUSD(zarAmount: number): number {
  return zarAmount * SA_CURRENCY_CONFIG.exchangeRates.ZAR_TO_USD;
}

/**
 * Convert USD to ZAR
 */
export function usdToZAR(usdAmount: number): number {
  return usdAmount * SA_CURRENCY_CONFIG.exchangeRates.USD_TO_ZAR;
}

/**
 * Convert between currencies
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'ZAR' && toCurrency === 'USD') {
    return zarToUSD(amount);
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'ZAR') {
    return usdToZAR(amount);
  }
  
  return amount; // Fallback
}

/**
 * Format with dual currency display (ZAR primary, USD secondary)
 */
export function formatDualCurrency(
  zarAmount: number,
  options: {
    showUSDApprox?: boolean;
    compact?: boolean;
  } = {}
): string {
  const { showUSDApprox = true, compact = false } = options;
  
  const zarFormatted = formatZAR(zarAmount);
  
  if (!showUSDApprox) return zarFormatted;
  
  const usdAmount = zarToUSD(zarAmount);
  const usdFormatted = formatUSD(usdAmount);
  
  if (compact) {
    return `${zarFormatted} (~${usdFormatted})`;
  }
  
  return `${zarFormatted} (approximately ${usdFormatted})`;
}

/**
 * Parse currency string to amount and currency
 */
export function parseCurrency(currencyString: string): CurrencyAmount | null {
  const zarMatch = currencyString.match(/R\s*([0-9,]+\.?[0-9]*)/);
  if (zarMatch) {
    const amount = parseFloat(zarMatch[1].replace(/,/g, ''));
    return { amount, currency: 'ZAR' };
  }
  
  const usdMatch = currencyString.match(/\$\s*([0-9,]+\.?[0-9]*)/);
  if (usdMatch) {
    const amount = parseFloat(usdMatch[1].replace(/,/g, ''));
    return { amount, currency: 'USD' };
  }
  
  return null;
}

/**
 * Calculate VAT for ZAR amounts (15% in South Africa)
 */
export function calculateVAT(amount: number, includesVAT: boolean = false): {
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
} {
  const VAT_RATE = 0.15; // 15% VAT in South Africa
  
  if (includesVAT) {
    // Amount includes VAT, calculate base amount
    const baseAmount = amount / (1 + VAT_RATE);
    const vatAmount = amount - baseAmount;
    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalAmount: amount,
    };
  } else {
    // Amount excludes VAT, calculate total
    const vatAmount = amount * VAT_RATE;
    const totalAmount = amount + vatAmount;
    return {
      baseAmount: amount,
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  }
}

/**
 * Format price ranges
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: CurrencyCode = 'ZAR'
): string {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice, currency).formatted;
  }
  
  const minFormatted = formatCurrency(minPrice, currency).formatted;
  const maxFormatted = formatCurrency(maxPrice, currency).formatted;
  
  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Calculate delivery fee based on order amount
 */
export function calculateDeliveryFee(
  orderAmount: number,
  freeDeliveryThreshold: number = 500, // R500 free delivery threshold
  baseFee: number = 50 // R50 base delivery fee
): number {
  return orderAmount >= freeDeliveryThreshold ? 0 : baseFee;
}

/**
 * Format currency for display in components
 */
export function displayCurrency(
  amount: number,
  currency: CurrencyCode = 'ZAR',
  compact: boolean = false
): string {
  const config = currency === 'ZAR' ? SA_CURRENCY_CONFIG.primary : SA_CURRENCY_CONFIG.secondary;
  
  if (compact && amount >= 1000) {
    const thousands = amount / 1000;
    return `${config.symbol}${thousands.toFixed(1)}k`;
  }
  
  return formatCurrency(amount, currency, { showSymbol: true }).formatted;
}

/**
 * Validate currency amount
 */
export function isValidCurrencyAmount(amount: any): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Round currency to appropriate decimal places
 */
export function roundCurrency(amount: number, currency: CurrencyCode = 'ZAR'): number {
  const decimals = currency === 'ZAR' ? SA_CURRENCY_CONFIG.primary.decimals : SA_CURRENCY_CONFIG.secondary.decimals;
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor) / factor;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return currency === 'ZAR' ? SA_CURRENCY_CONFIG.primary.symbol : SA_CURRENCY_CONFIG.secondary.symbol;
}

/**
 * Format for invoice/receipt display
 */
export function formatInvoiceCurrency(amount: number): string {
  return formatZAR(amount, { showSymbol: true, showCode: true });
}

/**
 * Legacy function for backward compatibility - now defaults to ZAR
 */
export function formatPrice(amount: number): string {
  return formatZAR(amount);
}

/**
 * Format currency with VAT information display
 */
export function formatCurrencyWithVAT(
  amount: number,
  options: {
    currencyCode?: CurrencyCode;
    showVATBreakdown?: boolean;
    includeVAT?: boolean;
  } = {}
): string {
  const {
    currencyCode = 'ZAR',
    showVATBreakdown = false,
    includeVAT = true,
  } = options;

  const vatInfo = calculateVAT(amount, includeVAT);
  const formatter = currencyCode === 'ZAR' ? formatZAR : formatUSD;

  if (!showVATBreakdown) {
    // Simple display with VAT indication
    const totalFormatted = formatter(vatInfo.totalAmount);
    return includeVAT ? `${totalFormatted} (incl. VAT)` : `${totalFormatted} (excl. VAT)`;
  }

  // Detailed VAT breakdown
  const baseFormatted = formatter(vatInfo.baseAmount);
  const vatFormatted = formatter(vatInfo.vatAmount);
  const totalFormatted = formatter(vatInfo.totalAmount);

  if (includeVAT) {
    return `${totalFormatted} (${baseFormatted} + ${vatFormatted} VAT)`;
  } else {
    return `${baseFormatted} + ${vatFormatted} VAT = ${totalFormatted}`;
  }
}

/**
 * Remove VAT from an amount that includes VAT (get the base amount)
 */
export function removeVAT(amountIncludingVAT: number): number {
  const VAT_RATE = 0.15; // 15% VAT in South Africa
  const baseAmount = amountIncludingVAT / (1 + VAT_RATE);
  return Math.round(baseAmount * 100) / 100;
}

// Utility for dual currency display
export function formatDualCurrency(amount: number, primaryCurrency: 'USD' | 'ZAR'): string {
  const primary = formatCurrency(amount, primaryCurrency);
  const secondary = primaryCurrency === 'USD' 
    ? formatCurrency(convertUSDToZAR(amount), 'ZAR')
    : formatCurrency(convertZARToUSD(amount), 'USD');
  
  return `${primary} (~${secondary})`;
}
=======
/**
 * Calculate VAT amount from base amount (excluding VAT)
 */
export function calculateVATAmount(baseAmount: number): number {
  const VAT_RATE = 0.15; // 15% VAT in South Africa
  const vatAmount = baseAmount * VAT_RATE;
  return Math.round(vatAmount * 100) / 100;
} 