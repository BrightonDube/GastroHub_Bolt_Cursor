# GastroHub South African Localization - Safe Implementation Plan

**🛡️ SAFETY-FIRST APPROACH: Never Break What's Working**

This plan ensures GastroHub maintains all current functionality while gradually adding South African localization features.

---

## 📋 **PRE-IMPLEMENTATION CHECKLIST (30 minutes)**

### **1. Create Development Branch**
```powershell
git checkout -b feature/south-african-localization
git push -u origin feature/south-african-localization
```

### **2. Backup Current Working State**
```powershell
git tag v1.0-pre-localization
git push --tags
```

### **3. Test Current Functionality**
- [ ] Login/Register works
- [ ] Dashboard pages load correctly
- [ ] Theme switching functions
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] No console errors

---

## 🔧 **PHASE 0: FOUNDATION SETUP (Day 1 - 2 hours)**

### **Step 1: Create Currency Utilities (30 minutes)**
Create `src/utils/currency.ts`:
```typescript
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
```

**✅ Test:** Import functions and verify they work correctly.

### **Step 2: Create Timezone Utilities (30 minutes)**
Create `src/utils/timezone.ts`:
```typescript
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
```

**✅ Test:** Verify timezone functions return correct SA time.

### **Step 3: Fix Empty ErrorFallback Component (30 minutes)**
Update `src/components/common/ErrorFallback.tsx` (currently 0 lines):
```typescript
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center" padding="lg">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full dark:bg-red-900">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={resetErrorBoundary}
            className="w-full"
            variant="primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </Card>
    </div>
  );
}

export default ErrorFallback;
```

**✅ Test:** Temporarily throw an error to verify ErrorFallback works.

### **Step 4: Create Localization Context (30 minutes)**
Create `src/context/LocalizationProvider.tsx`:
```typescript
import React, { createContext, useContext, useState } from 'react';

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
  // Start with USD/UTC for backward compatibility - NO BREAKING CHANGES
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>('USD');
  const [timezone, setTimezone] = useState<'UTC' | 'SAST'>('UTC');

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
```

**✅ Test:** Verify context works without breaking existing components.

---

## 🔧 **PHASE 1: DUAL-MODE COMPONENTS (Day 2 - 3 hours)**

### **Step 5: Add Localization Provider to App (15 minutes)**
Update `src/App.tsx` - ADD provider without removing anything:
```typescript
// ADD import at top
import { LocalizationProvider } from './context/LocalizationProvider';

// WRAP existing providers (find ThemeProvider around line 265)
function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>  {/* NEW - wraps everything safely */}
        <Toaster position="top-right" />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router>
              {/* ALL existing routes stay exactly the same */}
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>  {/* NEW */}
    </ThemeProvider>
  );
}
```

**✅ Test:** Verify app still loads and functions identically.

### **Step 6: Create Currency Display Component (30 minutes)**
Create `src/components/ui/CurrencyDisplay.tsx`:
```typescript
import React from 'react';
import { useLocalization } from '../../context/LocalizationProvider';
import { formatCurrency } from '../../utils/currency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showBothCurrencies?: boolean; // Show USD + ZAR conversion during transition
}

export function CurrencyDisplay({ 
  amount, 
  className = '',
  showBothCurrencies = false 
}: CurrencyDisplayProps) {
  const { currency } = useLocalization();
  
  // During transition, show both currencies when in ZAR mode
  if (showBothCurrencies && currency === 'ZAR') {
    return (
      <span className={className}>
        {formatCurrency(amount, 'ZAR')}
        <span className="text-sm text-muted-foreground ml-1">
          (~{formatCurrency(amount / 18.5, 'USD')})
        </span>
      </span>
    );
  }
  
  return (
    <span className={className}>
      {formatCurrency(amount, currency)}
    </span>
  );
}
```

**✅ Test:** Create test component to verify currency display works.

### **Step 7: Create Localization Toggle (45 minutes)**
Create `src/components/ui/LocalizationToggle.tsx`:
```typescript
import React from 'react';
import { useLocalization } from '../../context/LocalizationProvider';
import { Globe, DollarSign } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export function LocalizationToggle() {
  const { currency, setCurrency, isZARMode } = useLocalization();

  return (
    <Card className="p-4 w-80">
      <div className="flex items-center mb-3">
        <Globe className="w-5 h-5 mr-2" />
        <h3 className="font-semibold">Localization Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Currency
          </label>
          <div className="flex gap-2">
            <Button
              variant={!isZARMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCurrency('USD')}
            >
              USD ($)
            </Button>
            <Button
              variant={isZARMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCurrency('ZAR')}
            >
              ZAR (R) 🇿🇦
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded text-sm">
        <p className="text-muted-foreground">
          🇿🇦 <strong>South African Mode:</strong> Shows prices in ZAR for local business operations.
        </p>
      </div>
    </Card>
  );
}
```

### **Step 8: Add Toggle to Header (30 minutes)**
Update `src/components/layout/Header.tsx` - ADD new elements:
```typescript
// ADD import at top
import { LocalizationToggle } from '../ui/LocalizationToggle';

// ADD state after existing state declarations
const [localizationOpen, setLocalizationOpen] = React.useState(false);

// ADD localization dropdown AFTER existing ThemeToggle
{/* Existing Theme Toggle stays exactly the same */}
<ThemeToggle />

{/* NEW: Localization Toggle */}
<div className="relative">
  <button
    onClick={() => setLocalizationOpen(!localizationOpen)}
    className="p-2 rounded-lg transition-colors bg-neutral-100 text-primary-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-yellow-400 dark:hover:bg-neutral-700"
  >
    <Globe className="w-5 h-5" />
  </button>
  
  {localizationOpen && (
    <div className="absolute right-0 mt-2 z-50">
      <LocalizationToggle />
    </div>
  )}
</div>
```

**✅ Test:** Verify header still works and new toggle appears.

---

## 🔧 **PHASE 2: INCREMENTAL UPDATES (Days 3-5)**

### **Step 9: Update Components One by One**

#### **Day 3: Supplier Dashboard (1 hour)**
File: `src/pages/supplier/DashboardPage.tsx`
- Test current functionality ✅
- Add CurrencyDisplay import ✅  
- Replace hardcoded prices with components ✅
- Test again ✅

#### **Day 4: Buyer Dashboard (1 hour)**
File: `src/pages/buyer/DashboardPage.tsx`
- Same safe methodology

#### **Day 5: Order Forms (1 hour)**
File: `src/components/orders/CreateOrderForm.tsx`
- Add ZAR to currency options
- Update default currency

---

## 🛡️ **SAFETY MEASURES**

### **Immediate Rollback Options**
```powershell
# If ANYTHING breaks:
git checkout main
git push -f origin main

# Or revert specific commits:
git revert [commit-hash]
```

### **Testing After Each Step**
- [ ] App loads without errors
- [ ] All existing features work
- [ ] New features function correctly
- [ ] No console errors

---

## 📊 **SUCCESS CRITERIA**

### **Phase 0 Complete When:**
- [ ] All utilities created and tested
- [ ] ErrorFallback implemented
- [ ] NO existing functionality broken

### **Phase 1 Complete When:**
- [ ] Localization toggle working
- [ ] Currency switching functional
- [ ] Header updated successfully

### **Phase 2 Complete When:**
- [ ] Key components updated
- [ ] Both USD and ZAR working
- [ ] No regressions

---

## 🎯 **KEY PRINCIPLES**

1. **Always Test Before and After Each Change**
2. **Keep USD as Default - Add ZAR as Option**  
3. **Never Remove Existing Code - Only Add**
4. **Make All Changes Reversible**
5. **Commit Frequently**

---

**This plan ensures GastroHub maintains 100% of current functionality while safely adding South African localization. Every step is reversible and testable.**
