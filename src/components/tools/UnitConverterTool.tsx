import React, { useState, useMemo } from 'react';
import {
  Ruler,
  Scale,
  Maximize2,
  Thermometer,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

type UnitCategory = 'length' | 'weight' | 'area' | 'temperature';

interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factorToBase: number; // For linear conversion: base = value * factorToBase
  isRegionSpecial?: boolean;
}

// Length Units (Base: Meter)
const LENGTH_UNITS: UnitDefinition[] = [
  { id: 'mm', name: 'Millimeter', symbol: 'mm', factorToBase: 0.001 },
  { id: 'cm', name: 'Centimeter', symbol: 'cm', factorToBase: 0.01 },
  { id: 'm', name: 'Meter', symbol: 'm', factorToBase: 1 },
  { id: 'km', name: 'Kilometer', symbol: 'km', factorToBase: 1000 },
  { id: 'in', name: 'Inch', symbol: 'in', factorToBase: 0.0254 },
  { id: 'ft', name: 'Foot / Feet', symbol: 'ft', factorToBase: 0.3048 },
  { id: 'yd', name: 'Yard', symbol: 'yd', factorToBase: 0.9144 },
  { id: 'mi', name: 'Mile', symbol: 'mi', factorToBase: 1609.344 },
  { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factorToBase: 1852 },
];

// Weight Units (Base: Kilogram)
const WEIGHT_UNITS: UnitDefinition[] = [
  { id: 'mg', name: 'Milligram', symbol: 'mg', factorToBase: 0.000001 },
  { id: 'g', name: 'Gram', symbol: 'g', factorToBase: 0.001 },
  { id: 'kg', name: 'Kilogram', symbol: 'kg', factorToBase: 1 },
  { id: 't', name: 'Metric Ton', symbol: 't', factorToBase: 1000 },
  { id: 'oz', name: 'Ounce', symbol: 'oz', factorToBase: 0.028349523125 },
  { id: 'lb', name: 'Pound', symbol: 'lb', factorToBase: 0.45359237 },
  { id: 'st', name: 'Stone', symbol: 'st', factorToBase: 6.35029318 },
  { id: 'tola', name: 'Tola (Gold / Traditional)', symbol: 'tola', factorToBase: 0.0116638, isRegionSpecial: true },
  { id: 'mon', name: 'Maund / Mon (BD Standard)', symbol: 'mon', factorToBase: 40, isRegionSpecial: true },
];

// Area Units (Base: Square Meter)
const AREA_UNITS: UnitDefinition[] = [
  { id: 'sq_mm', name: 'Square Millimeter', symbol: 'mm²', factorToBase: 0.000001 },
  { id: 'sq_cm', name: 'Square Centimeter', symbol: 'cm²', factorToBase: 0.0001 },
  { id: 'sq_m', name: 'Square Meter', symbol: 'm²', factorToBase: 1 },
  { id: 'sq_km', name: 'Square Kilometer', symbol: 'km²', factorToBase: 1000000 },
  { id: 'sq_in', name: 'Square Inch', symbol: 'in²', factorToBase: 0.00064516 },
  { id: 'sq_ft', name: 'Square Foot', symbol: 'ft²', factorToBase: 0.09290304 },
  { id: 'sq_yd', name: 'Square Yard', symbol: 'yd²', factorToBase: 0.83612736 },
  { id: 'ac', name: 'Acre', symbol: 'ac', factorToBase: 4046.8564224 },
  { id: 'ha', name: 'Hectare', symbol: 'ha', factorToBase: 10000 },
  { id: 'shatak', name: 'Decimal / Shatak (BD Land)', symbol: 'shatak', factorToBase: 40.46856, isRegionSpecial: true },
  { id: 'katha', name: 'Katha (BD Land)', symbol: 'katha', factorToBase: 66.89, isRegionSpecial: true },
  { id: 'bigha', name: 'Bigha (BD Land)', symbol: 'bigha', factorToBase: 1337.8, isRegionSpecial: true },
];

// Temperature Units
const TEMPERATURE_UNITS = [
  { id: 'c', name: 'Celsius', symbol: '°C' },
  { id: 'f', name: 'Fahrenheit', symbol: '°F' },
  { id: 'k', name: 'Kelvin', symbol: 'K' },
];

export const UnitConverterTool: React.FC = () => {
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [precision, setPrecision] = useState<number>(4);

  // Unit selections for each category
  const [fromUnitLength, setFromUnitLength] = useState<string>('m');
  const [toUnitLength, setToUnitLength] = useState<string>('ft');

  const [fromUnitWeight, setFromUnitWeight] = useState<string>('kg');
  const [toUnitWeight, setToUnitWeight] = useState<string>('lb');

  const [fromUnitArea, setFromUnitArea] = useState<string>('sq_m');
  const [toUnitArea, setToUnitArea] = useState<string>('sq_ft');

  const [fromUnitTemp, setFromUnitTemp] = useState<string>('c');
  const [toUnitTemp, setToUnitTemp] = useState<string>('f');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get current active units
  const currentUnitConfig = useMemo(() => {
    switch (activeCategory) {
      case 'length':
        return {
          units: LENGTH_UNITS,
          from: fromUnitLength,
          setFrom: setFromUnitLength,
          to: toUnitLength,
          setTo: setToUnitLength,
        };
      case 'weight':
        return {
          units: WEIGHT_UNITS,
          from: fromUnitWeight,
          setFrom: setFromUnitWeight,
          to: toUnitWeight,
          setTo: setToUnitWeight,
        };
      case 'area':
        return {
          units: AREA_UNITS,
          from: fromUnitArea,
          setFrom: setFromUnitArea,
          to: toUnitArea,
          setTo: setToUnitArea,
        };
      case 'temperature':
      default:
        return {
          units: TEMPERATURE_UNITS,
          from: fromUnitTemp,
          setFrom: setFromUnitTemp,
          to: toUnitTemp,
          setTo: setToUnitTemp,
        };
    }
  }, [
    activeCategory,
    fromUnitLength,
    toUnitLength,
    fromUnitWeight,
    toUnitWeight,
    fromUnitArea,
    toUnitArea,
    fromUnitTemp,
    toUnitTemp,
  ]);

  // Temperature conversion helpers
  const convertTemperature = (val: number, from: string, to: string): number => {
    if (from === to) return val;

    // Convert from input to Celsius
    let celsius = val;
    if (from === 'f') {
      celsius = ((val - 32) * 5) / 9;
    } else if (from === 'k') {
      celsius = val - 273.15;
    }

    // Convert from Celsius to target
    if (to === 'c') return celsius;
    if (to === 'f') return (celsius * 9) / 5 + 32;
    if (to === 'k') return celsius + 273.15;
    return val;
  };

  // Linear conversion helper (length, weight, area)
  const convertLinear = (val: number, fromId: string, toId: string, units: UnitDefinition[]): number => {
    if (fromId === toId) return val;
    const fromDef = units.find((u) => u.id === fromId);
    const toDef = units.find((u) => u.id === toId);
    if (!fromDef || !toDef) return 0;

    const baseValue = val * fromDef.factorToBase;
    return baseValue / toDef.factorToBase;
  };

  // Format numbers cleanly
  const formatResult = (num: number, prec: number): string => {
    if (isNaN(num)) return '0';
    if (num === 0) return '0';

    // For very tiny or very large numbers, use scientific notation
    if (Math.abs(num) < 0.000001 || Math.abs(num) >= 100000000) {
      return num.toExponential(prec);
    }

    // Otherwise round to specified precision and strip trailing zeros
    const rounded = parseFloat(num.toFixed(prec));
    return rounded.toLocaleString(undefined, {
      maximumFractionDigits: prec,
      minimumFractionDigits: 0,
    });
  };

  // Primary conversion calculation
  const numericInput = parseFloat(inputValue) || 0;

  const convertedValue = useMemo(() => {
    if (activeCategory === 'temperature') {
      return convertTemperature(numericInput, currentUnitConfig.from, currentUnitConfig.to);
    } else {
      return convertLinear(
        numericInput,
        currentUnitConfig.from,
        currentUnitConfig.to,
        currentUnitConfig.units as UnitDefinition[]
      );
    }
  }, [numericInput, activeCategory, currentUnitConfig]);

  // Conversion formula / explanation text
  const formulaExplanation = useMemo(() => {
    const fromSymbol =
      currentUnitConfig.units.find((u) => u.id === currentUnitConfig.from)?.symbol || '';
    const toSymbol =
      currentUnitConfig.units.find((u) => u.id === currentUnitConfig.to)?.symbol || '';

    if (activeCategory === 'temperature') {
      if (currentUnitConfig.from === 'c' && currentUnitConfig.to === 'f') {
        return `Formula: (${inputValue || 0}°C × 9/5) + 32 = ${formatResult(convertedValue, precision)}°F`;
      }
      if (currentUnitConfig.from === 'f' && currentUnitConfig.to === 'c') {
        return `Formula: (${inputValue || 0}°F − 32) × 5/9 = ${formatResult(convertedValue, precision)}°C`;
      }
      if (currentUnitConfig.from === 'c' && currentUnitConfig.to === 'k') {
        return `Formula: ${inputValue || 0}°C + 273.15 = ${formatResult(convertedValue, precision)} K`;
      }
      if (currentUnitConfig.from === 'k' && currentUnitConfig.to === 'c') {
        return `Formula: ${inputValue || 0} K − 273.15 = ${formatResult(convertedValue, precision)}°C`;
      }
      return `${currentUnitConfig.from.toUpperCase()} to ${currentUnitConfig.to.toUpperCase()}`;
    }

    // Linear formula
    const units = currentUnitConfig.units as UnitDefinition[];
    const oneFromInTo = convertLinear(1, currentUnitConfig.from, currentUnitConfig.to, units);
    return `1 ${fromSymbol} = ${formatResult(oneFromInTo, precision)} ${toSymbol}`;
  }, [currentUnitConfig, activeCategory, inputValue, convertedValue, precision]);

  // "All Units at a Glance" grid data
  const allUnitsCalculated = useMemo(() => {
    return currentUnitConfig.units.map((unit) => {
      let val = 0;
      if (activeCategory === 'temperature') {
        val = convertTemperature(numericInput, currentUnitConfig.from, unit.id);
      } else {
        val = convertLinear(
          numericInput,
          currentUnitConfig.from,
          unit.id,
          currentUnitConfig.units as UnitDefinition[]
        );
      }
      return {
        ...unit,
        value: val,
        formatted: formatResult(val, precision),
      };
    });
  }, [numericInput, activeCategory, currentUnitConfig, precision]);

  // Swap From and To units
  const handleSwapUnits = () => {
    const currentFrom = currentUnitConfig.from;
    const currentTo = currentUnitConfig.to;
    currentUnitConfig.setFrom(currentTo);
    currentUnitConfig.setTo(currentFrom);
    showToast('Swapped conversion units', 'info');
  };

  // Copy result string to clipboard
  const handleCopy = async (id: string, textToCopy: string, label: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      showToast(`Copied ${label} to clipboard!`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const handleReset = () => {
    setInputValue('1');
    showToast('Reset to default value', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar">
        {[
          { id: 'length', label: 'Length & Distance', icon: Ruler },
          { id: 'weight', label: 'Weight & Mass', icon: Scale },
          { id: 'area', label: 'Area & Land', icon: Maximize2 },
          { id: 'temperature', label: 'Temperature', icon: Thermometer },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as UnitCategory)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap min-h-[42px] ${
                isActive
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Interactive Unit Converter
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Convert {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
          </div>

          {/* Precision Selector & Reset */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Decimals:</span>
              <select
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none text-xs"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dual Conversion Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* FROM Input Box (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              From
            </label>

            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 bg-transparent outline-none font-mono tracking-tight"
            />

            <div className="relative">
              <select
                value={currentUnitConfig.from}
                onChange={(e) => currentUnitConfig.setFrom(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none cursor-pointer"
              >
                {currentUnitConfig.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1, 5, 10, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInputValue(String(preset))}
                  className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-md transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* SWAP Button (1 col) */}
          <div className="lg:col-span-1 flex justify-center py-1">
            <button
              type="button"
              onClick={handleSwapUnits}
              className="w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs"
              title="Swap From and To units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* TO Result Box (5 cols) */}
          <div className="lg:col-span-5 bg-blue-50/60 rounded-2xl border border-blue-200/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-700">
                To (Converted Result)
              </label>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    'main-result',
                    `${formatResult(convertedValue, precision)}`,
                    'Result'
                  )
                }
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold min-h-[28px]"
              >
                {copiedId === 'main-result' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === 'main-result' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tracking-tight truncate select-all">
              {formatResult(convertedValue, precision)}
            </div>

            <div className="relative">
              <select
                value={currentUnitConfig.to}
                onChange={(e) => currentUnitConfig.setTo(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-blue-200 rounded-xl focus:border-blue-500 outline-none cursor-pointer"
              >
                {currentUnitConfig.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-blue-700/80 font-medium truncate pt-1">
              {formulaExplanation}
            </div>
          </div>
        </div>
      </div>

      {/* "All Units at a Glance" Comparison Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              All Units at a Glance
            </h3>
            <p className="text-xs text-slate-500">
              Converted equivalents for{' '}
              <strong className="text-slate-800">
                {inputValue || 0}{' '}
                {currentUnitConfig.units.find((u) => u.id === currentUnitConfig.from)?.symbol}
              </strong>{' '}
              across all standard measurements.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            {allUnitsCalculated.length} Units
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allUnitsCalculated.map((u) => {
            const isSource = u.id === currentUnitConfig.from;
            const isTarget = u.id === currentUnitConfig.to;

            return (
              <div
                key={u.id}
                onClick={() =>
                  handleCopy(
                    u.id,
                    `${u.formatted} ${u.symbol}`,
                    `${u.name}`
                  )
                }
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                  isTarget
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-100'
                    : isSource
                    ? 'bg-slate-50 border-slate-300'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {u.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({u.symbol})
                    </span>
                  </div>

                  <div className="text-base sm:text-lg font-extrabold text-slate-800 font-mono tracking-tight mt-0.5 truncate group-hover:text-blue-600 transition-colors">
                    {u.formatted}
                  </div>
                </div>

                <button
                  type="button"
                  className="p-1.5 text-slate-400 group-hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                  title={`Copy ${u.name}`}
                >
                  {copiedId === u.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
