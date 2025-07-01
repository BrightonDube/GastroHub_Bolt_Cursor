export const SOUTH_AFRICA_TIMEZONE = 'Africa/Johannesburg';
export const DEFAULT_TIMEZONE = 'UTC';

export function formatDateSAST(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('en-ZA', {
    timeZone: SOUTH_AFRICA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Keep existing function for backward compatibility
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}

export function getCurrentSASTTime(): Date {
  return new Date(new Date().toLocaleString("en-US", {timeZone: SOUTH_AFRICA_TIMEZONE}));
}

export function isSABusinessHours(): boolean {
  const now = getCurrentSASTTime();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Monday-Friday, 9AM-6PM SAST
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

// Additional South African date formatting functions
export function formatDateShortSA(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-ZA', {
    timeZone: SOUTH_AFRICA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function formatDateLongSA(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-ZA', {
    timeZone: SOUTH_AFRICA_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTimeSA(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-ZA', {
    timeZone: SOUTH_AFRICA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get timezone offset for SAST
export function getSASTOffset(): string {
  const now = new Date();
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  const sast = new Date(utc.toLocaleString("en-US", {timeZone: SOUTH_AFRICA_TIMEZONE}));
  const offset = (sast.getTime() - utc.getTime()) / (1000 * 60 * 60);
  
  return offset > 0 ? `+${offset}` : `${offset}`;
}