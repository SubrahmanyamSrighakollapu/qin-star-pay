/**
 * Financial and general formatting utilities for Qin Star Pay.
 * Formats currency (including Indian Rupee format), numbers, percentages, dates, and times.
 */

export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  decimals?: number;
  compact?: boolean;
  showSymbol?: boolean;
}

/**
 * Formats a numeric amount into currency representation.
 * Default locale is 'en-IN' for Indian numbering system (e.g. ₹99,53,681.66).
 */
export function formatCurrency(
  amount: number | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }

  const {
    currency = 'INR',
    locale = 'en-IN',
    decimals = 2,
    compact = false,
    showSymbol = true,
  } = options;

  if (compact) {
    return formatCompactCurrency(amount, currency, showSymbol);
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return formatter.format(amount);
  } catch {
    const formattedNum = amount.toFixed(decimals);
    return showSymbol ? `₹${formattedNum}` : formattedNum;
  }
}

/**
 * Formats large amounts into compact notation (e.g. ₹1.2Cr, ₹50L, ₹10K).
 */
function formatCompactCurrency(amount: number, currency: string, showSymbol: boolean): string {
  const symbol = showSymbol ? (currency === 'INR' ? '₹' : '$') : '';
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    return `${sign}${symbol}${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    return `${sign}${symbol}${(absAmount / 100000).toFixed(2)} L`;
  }
  if (absAmount >= 1000) {
    return `${sign}${symbol}${(absAmount / 1000).toFixed(1)} K`;
  }
  return `${sign}${symbol}${absAmount.toFixed(2)}`;
}

/**
 * Formats a number with Indian/specified locale separator (e.g. 1,24,580).
 */
export function formatNumber(
  value: number | null | undefined,
  options: { locale?: string; decimals?: number } = {}
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  const { locale = 'en-IN', decimals = 0 } = options;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number as a percentage (e.g. 98.4%).
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a date string, Date object, or timestamp into human-readable date.
 * Example output: "03 Sep 2026"
 */
export function formatDate(
  dateInput: string | Date | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!dateInput) return '-';
  try {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '-';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options,
    };
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
  } catch {
    return '-';
  }
}

/**
 * Formats a date string, Date object, or timestamp into date with time.
 * Example output: "03 Sep 2026, 03:20 PM"
 */
export function formatDateTime(
  dateInput: string | Date | number | null | undefined
): string {
  if (!dateInput) return '-';
  try {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '-';
  }
}
