import React from 'react';
import { useLocalization } from '../../context/LocalizationProvider';
import { Globe, DollarSign, Clock, MapPin } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { CurrencyDisplay, USDDisplay, ZARDisplay } from './CurrencyDisplay';
import { DateDisplay, UTCDisplay, SASTDisplay } from './DateDisplay';

export function LocalizationToggle() {
  const { 
    currency, 
    timezone,
    setCurrency, 
    setTimezone,
    isZARMode,
    isSASTMode 
  } = useLocalization();

  const sampleAmount = 100;
  const sampleDate = new Date();

  return (
    <Card className="p-4 w-96 shadow-lg">
      <div className="flex items-center mb-4">
        <Globe className="w-5 h-5 mr-2 text-primary-600" />
        <h3 className="font-semibold text-foreground">Localization Settings</h3>
      </div>
      
      <div className="space-y-6">
        {/* Currency Selection */}
        <div>
          <label className="text-sm font-medium mb-3 flex items-center text-foreground">
            <DollarSign className="w-4 h-4 mr-1" />
            Currency
          </label>
          <div className="flex gap-2 mb-3">
            <Button
              variant={!isZARMode ? 'solid' : 'default'}
              size="sm"
              onClick={() => setCurrency('USD')}
              className="flex-1"
            >
              USD ($)
            </Button>
            <Button
              variant={isZARMode ? 'solid' : 'default'}
              size="sm"
              onClick={() => setCurrency('ZAR')}
              className="flex-1"
            >
              ZAR (R) 🇿🇦
            </Button>
          </div>
          
          {/* Currency Preview */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            <div className="font-medium mb-1">Preview:</div>
            <div className="flex justify-between">
              <span>Current:</span>
              <CurrencyDisplay amount={sampleAmount} className="font-medium" />
            </div>
            {isZARMode && (
              <div className="flex justify-between text-xs mt-1">
                <span>USD equivalent:</span>
                <USDDisplay amount={sampleAmount / 18.5} />
              </div>
            )}
          </div>
        </div>
        
        {/* Timezone Selection */}
        <div>
          <label className="text-sm font-medium mb-3 flex items-center text-foreground">
            <Clock className="w-4 h-4 mr-1" />
            Timezone
          </label>
          <div className="flex gap-2 mb-3">
            <Button
              variant={!isSASTMode ? 'solid' : 'default'}
              size="sm"
              onClick={() => setTimezone('UTC')}
              className="flex-1"
            >
              UTC
            </Button>
            <Button
              variant={isSASTMode ? 'solid' : 'default'}
              size="sm"
              onClick={() => setTimezone('SAST')}
              className="flex-1"
            >
              SAST 🇿🇦
            </Button>
          </div>
          
          {/* Timezone Preview */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            <div className="font-medium mb-1">Current time:</div>
            <div className="flex justify-between">
              <span>Local:</span>
              <DateDisplay 
                date={sampleDate} 
                showTimezone 
                className="font-medium" 
              />
            </div>
            {isSASTMode && (
              <div className="flex justify-between text-xs mt-1">
                <span>UTC:</span>
                <UTCDisplay date={sampleDate} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* South African Mode Indicator */}
      {(isZARMode || isSASTMode) && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded text-sm border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                🇿🇦 South African Mode Active
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                {isZARMode && 'Prices in South African Rand. '}
                {isSASTMode && 'Times in South African Standard Time (UTC+2).'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrency('ZAR');
              setTimezone('SAST');
            }}
            className="flex-1 text-xs"
          >
            🇿🇦 Full SA Mode
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrency('USD');
              setTimezone('UTC');
            }}
            className="flex-1 text-xs"
          >
            🌍 International Mode
          </Button>
        </div>
      </div>
    </Card>
  );
} 