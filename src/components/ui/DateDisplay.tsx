import React from 'react';
import { useLocalization } from '../../context/LocalizationProvider';
import { 
  formatDate, 
  formatDateSAST, 
  formatDateShortSA, 
  formatDateLongSA, 
  formatTimeSA 
} from '../../utils/timezone';

interface DateDisplayProps {
  date: Date | string;
  className?: string;
  showTimezone?: boolean;
  format?: 'short' | 'long' | 'datetime' | 'time';
  forceTimezone?: 'UTC' | 'SAST'; // Override the context timezone
}

export function DateDisplay({ 
  date, 
  className = '',
  showTimezone = false,
  format = 'datetime',
  forceTimezone
}: DateDisplayProps) {
  const { timezone } = useLocalization();
  
  // Use forced timezone if provided, otherwise use context timezone
  const currentTimezone = forceTimezone || timezone;
  
  const getFormattedDate = () => {
    if (currentTimezone === 'SAST') {
      switch (format) {
        case 'short':
          return formatDateShortSA(date);
        case 'long':
          return formatDateLongSA(date);
        case 'time':
          return formatTimeSA(date);
        case 'datetime':
        default:
          return formatDateSAST(date);
      }
    } else {
      // UTC formatting (default behavior)
      return formatDate(date);
    }
  };
  
  const formattedDate = getFormattedDate();
  
  return (
    <span className={className}>
      {formattedDate}
      {showTimezone && (
        <span className="text-xs text-muted-foreground ml-1">
          {currentTimezone}
        </span>
      )}
    </span>
  );
}

// Convenience components for specific timezones
export function UTCDisplay({ 
  date, 
  className = '', 
  format = 'datetime' 
}: { 
  date: Date | string; 
  className?: string; 
  format?: 'short' | 'long' | 'datetime' | 'time';
}) {
  return (
    <DateDisplay 
      date={date} 
      className={className} 
      format={format}
      forceTimezone="UTC" 
    />
  );
}

export function SASTDisplay({ 
  date, 
  className = '', 
  format = 'datetime' 
}: { 
  date: Date | string; 
  className?: string; 
  format?: 'short' | 'long' | 'datetime' | 'time';
}) {
  return (
    <DateDisplay 
      date={date} 
      className={className} 
      format={format}
      forceTimezone="SAST" 
    />
  );
} 