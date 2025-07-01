import React from 'react';
import { Input } from './Input';
import { Select } from './Select';

// South African metric units for food/ingredients
export const METRIC_UNITS = {
  weight: [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 't', label: 'Tonnes (t)' }
  ],
  volume: [
    { value: 'l', label: 'Litres (L)' },
    { value: 'ml', label: 'Millilitres (mL)' },
    { value: 'kl', label: 'Kilolitres (kL)' }
  ],
  length: [
    { value: 'cm', label: 'Centimetres (cm)' },
    { value: 'm', label: 'Metres (m)' },
    { value: 'mm', label: 'Millimetres (mm)' }
  ],
  area: [
    { value: 'm²', label: 'Square Metres (m²)' },
    { value: 'cm²', label: 'Square Centimetres (cm²)' },
    { value: 'ha', label: 'Hectares (ha)' }
  ],
  temperature: [
    { value: '°C', label: 'Celsius (°C)' }
  ],
  count: [
    { value: 'pcs', label: 'Pieces' },
    { value: 'doz', label: 'Dozen' },
    { value: 'pack', label: 'Pack' },
    { value: 'box', label: 'Box' },
    { value: 'case', label: 'Case' },
    { value: 'pallet', label: 'Pallet' }
  ]
};

// Get all units as a flat array
export const ALL_METRIC_UNITS = [
  ...METRIC_UNITS.weight,
  ...METRIC_UNITS.volume,
  ...METRIC_UNITS.length,
  ...METRIC_UNITS.area,
  ...METRIC_UNITS.temperature,
  ...METRIC_UNITS.count
];

interface MetricInputProps {
  value: number;
  unit: string;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  unitCategory?: keyof typeof METRIC_UNITS | 'all';
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function MetricInput({
  value,
  unit,
  onValueChange,
  onUnitChange,
  placeholder = "Enter quantity",
  label,
  className,
  unitCategory = 'all',
  disabled = false,
  min = 0,
  max,
  step = 0.01
}: MetricInputProps) {
  const availableUnits = unitCategory === 'all' 
    ? ALL_METRIC_UNITS 
    : METRIC_UNITS[unitCategory] || ALL_METRIC_UNITS;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
          />
        </div>
        <div className="w-32">
          <Select
            options={availableUnits}
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

// Conversion utilities for common metric conversions
export const metricConversions = {
  // Weight conversions to grams (base unit)
  weight: {
    'g': 1,
    'kg': 1000,
    't': 1000000
  },
  // Volume conversions to millilitres (base unit)
  volume: {
    'ml': 1,
    'l': 1000,
    'kl': 1000000
  },
  // Length conversions to millimetres (base unit)
  length: {
    'mm': 1,
    'cm': 10,
    'm': 1000
  }
};

export function convertMetricUnit(value: number, fromUnit: string, toUnit: string): number {
  // Find the category for these units
  for (const [category, conversions] of Object.entries(metricConversions)) {
    if (fromUnit in conversions && toUnit in conversions) {
      const baseValue = value * (conversions as any)[fromUnit];
      return baseValue / (conversions as any)[toUnit];
    }
  }
  // If no conversion found, return original value
  return value;
}