import { 
  format, 
  formatInTimeZone, 
  toZonedTime, 
  fromZonedTime, 
  getTimezoneOffset 
} from 'date-fns-tz';
import { 
  parseISO, 
  isValid, 
  addDays, 
  startOfDay, 
  endOfDay,
  isBefore,
  isAfter,
  isWithinInterval,
  addHours,
  subHours,
  differenceInHours,
  differenceInMinutes
} from 'date-fns';

// South African Standard Time (SAST) - UTC+2
export const SAST_TIMEZONE = 'Africa/Johannesburg';
export const SAST_OFFSET_HOURS = 2;

/**
 * South African business configuration
 */
export const SA_BUSINESS_CONFIG = {
  timezone: SAST_TIMEZONE,
  standardBusinessHours: {
    start: '08:00',
    end: '17:00'
  },
  weekendDays: [0, 6], // Sunday = 0, Saturday = 6
  publicHolidays: [
    // 2025 South African Public Holidays
    '2025-01-01', // New Year's Day
    '2025-03-21', // Human Rights Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Family Day
    '2025-04-27', // Freedom Day
    '2025-05-01', // Workers' Day
    '2025-06-16', // Youth Day
    '2025-08-09', // National Women's Day
    '2025-09-24', // Heritage Day
    '2025-12-16', // Day of Reconciliation
    '2025-12-25', // Christmas Day
    '2025-12-26', // Day of Goodwill
  ],
  vatRate: 0.15, // 15% VAT in South Africa
  currency: {
    primary: 'ZAR',
    symbol: 'R',
    secondary: 'USD'
  }
};

/**
 * Get current time in SAST timezone
 */
export function getCurrentSASTTime(): Date {
  return toZonedTime(new Date(), SAST_TIMEZONE);
}

/**
 * Format date in SAST timezone
 */
export function formatInSAST(date: Date | string, formatString: string = 'yyyy-MM-dd HH:mm:ss zzz'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, SAST_TIMEZONE, formatString);
}

/**
 * Convert UTC date to SAST for display
 */
export function utcToSAST(utcDate: Date | string): Date {
  const dateObj = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  return toZonedTime(dateObj, SAST_TIMEZONE);
}

/**
 * Convert SAST date to UTC for server storage
 */
export function sastToUTC(sastDate: Date | string): Date {
  const dateObj = typeof sastDate === 'string' ? parseISO(sastDate) : sastDate;
  return fromZonedTime(dateObj, SAST_TIMEZONE);
}

/**
 * Check if date is within SA business hours
 */
export function isWithinBusinessHours(date: Date | string): boolean {
  const sastDate = typeof date === 'string' ? utcToSAST(parseISO(date)) : utcToSAST(date);
  const hour = sastDate.getHours();
  const day = sastDate.getDay();
  
  // Check if weekend
  if (SA_BUSINESS_CONFIG.weekendDays.includes(day)) {
    return false;
  }
  
  // Check if within business hours (8 AM - 5 PM)
  return hour >= 8 && hour < 17;
}

/**
 * Check if date is a South African public holiday
 */
export function isSAPublicHoliday(date: Date | string): boolean {
  const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
  return SA_BUSINESS_CONFIG.publicHolidays.includes(dateStr);
}

/**
 * Check if date is a business day in South Africa
 */
export function isSABusinessDay(date: Date | string): boolean {
  const sastDate = typeof date === 'string' ? utcToSAST(parseISO(date)) : utcToSAST(date);
  const day = sastDate.getDay();
  
  // Check if weekend
  if (SA_BUSINESS_CONFIG.weekendDays.includes(day)) {
    return false;
  }
  
  // Check if public holiday
  return !isSAPublicHoliday(sastDate);
}

/**
 * Get next business day in South Africa
 */
export function getNextSABusinessDay(fromDate?: Date | string): Date {
  let currentDate = fromDate ? 
    (typeof fromDate === 'string' ? parseISO(fromDate) : fromDate) : 
    getCurrentSASTTime();
  
  do {
    currentDate = addDays(currentDate, 1);
  } while (!isSABusinessDay(currentDate));
  
  return currentDate;
}

/**
 * Calculate estimated delivery time based on SA business hours
 */
export function calculateSADeliveryTime(
  orderDate: Date | string,
  processingHours: number = 24,
  deliveryHours: number = 48
): Date {
  const startDate = typeof orderDate === 'string' ? parseISO(orderDate) : orderDate;
  const sastStartDate = utcToSAST(startDate);
  
  let totalHours = processingHours + deliveryHours;
  let currentDate = sastStartDate;
  let businessHoursAccumulated = 0;
  
  while (businessHoursAccumulated < totalHours) {
    if (isSABusinessDay(currentDate) && isWithinBusinessHours(currentDate)) {
      businessHoursAccumulated += 1;
    }
    currentDate = addHours(currentDate, 1);
  }
  
  return sastToUTC(currentDate);
}

/**
 * Format business hours display in SAST
 */
export function formatSABusinessHours(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime} SAST (GMT+2)`;
}

/**
 * Get SAST timezone offset in milliseconds
 */
export function getSASTOffset(): number {
  return getTimezoneOffset(SAST_TIMEZONE);
}

/**
 * Check if current time is within delivery window
 */
export function isWithinDeliveryWindow(
  deliveryStart: string,
  deliveryEnd: string,
  currentTime?: Date
): boolean {
  const now = currentTime ? utcToSAST(currentTime) : getCurrentSASTTime();
  const [startHour, startMinute] = deliveryStart.split(':').map(Number);
  const [endHour, endMinute] = deliveryEnd.split(':').map(Number);
  
  const startTime = new Date(now);
  startTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date(now);
  endTime.setHours(endHour, endMinute, 0, 0);
  
  return isWithinInterval(now, { start: startTime, end: endTime });
}

/**
 * Format duration in SA context (hours/days)
 */
export function formatSADuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (minutes < 1440) { // Less than 24 hours
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days} days ${remainingHours}h` : `${days} days`;
  }
}

/**
 * Get relative time in SA context
 */
export function getSARelativeTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  const now = getCurrentSASTTime();
  const diffInMinutes = differenceInMinutes(now, targetDate);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  const days = Math.floor(diffInMinutes / 1440);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return formatInSAST(targetDate, 'MMM dd, yyyy');
}

/**
 * Validate and parse date in SA context
 */
export function parseSADate(dateString: string): Date | null {
  try {
    // Try parsing ISO format first
    let date = parseISO(dateString);
    if (isValid(date)) return date;
    
    // Try parsing SA format (DD/MM/YYYY)
    const saFormatMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (saFormatMatch) {
      const [, day, month, year] = saFormatMatch;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isValid(date)) return date;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Export common date formats used in SA
 */
export const SA_DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  medium: 'dd MMM yyyy',
  long: 'dd MMMM yyyy',
  withTime: 'dd/MM/yyyy HH:mm',
  businessTime: 'dd/MM/yyyy HH:mm SAST',
  iso: 'yyyy-MM-dd',
  isoWithTime: 'yyyy-MM-dd HH:mm:ss'
} as const;

/**
 * Helper to format dates consistently across the application
 */
export function formatSADate(
  date: Date | string,
  format: keyof typeof SA_DATE_FORMATS = 'medium'
): string {
  return formatInSAST(date, SA_DATE_FORMATS[format]);
}

/**
 * Get a human-readable string for how long ago a date was
 */
export function getDaysAgoString(date: Date): string {
  const now = getCurrentSASTTime();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
} 