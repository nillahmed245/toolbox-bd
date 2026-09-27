import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Gift,
  Copy,
  Check,
  RotateCcw,
  Heart,
  Compass,
  Star,
  PartyPopper,
  Hourglass,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  dayOfWeekBorn: string;
  zodiacSign: string;
  chineseZodiac: string;
  nextBirthdayDays: number;
  nextBirthdayMonths: number;
  nextBirthdayDate: Date;
  nextBirthdayDayOfWeek: string;
  isBirthdayToday: boolean;
}

export const AgeCalculatorTool: React.FC = () => {
  const { showToast } = useToast();

  // Current system local time (default target: today)
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // Default birth date: 25 years ago
  const defaultBirthDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split('T')[0];
  }, []);

  const [birthDate, setBirthDate] = useState<string>(defaultBirthDate);
  const [targetDate, setTargetDate] = useState<string>(todayStr);
  const [copied, setCopied] = useState<boolean>(false);

  // Live countdown ticker to next birthday
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate Zodiac Sign
  const getZodiacSign = (day: number, month: number): string => {
    // month is 1-indexed (1 = Jan, 12 = Dec)
    const zodiacs = [
      { name: 'Capricorn ♑', endDay: 19 },
      { name: 'Aquarius ♒', endDay: 18 },
      { name: 'Pisces ♓', endDay: 20 },
      { name: 'Aries ♈', endDay: 19 },
      { name: 'Taurus ♉', endDay: 20 },
      { name: 'Gemini ♊', endDay: 20 },
      { name: 'Cancer ♋', endDay: 22 },
      { name: 'Leo ♌', endDay: 22 },
      { name: 'Virgo ♍', endDay: 22 },
      { name: 'Libra ♎', endDay: 22 },
      { name: 'Scorpio ♏', endDay: 21 },
      { name: 'Sagittarius ♐', endDay: 21 },
      { name: 'Capricorn ♑', endDay: 31 },
    ];
    return day <= zodiacs[month - 1].endDay
      ? zodiacs[month - 1].name
      : zodiacs[month].name;
  };

  // Calculate Chinese Zodiac
  const getChineseZodiac = (year: number): string => {
    const animals = [
      'Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇',
      'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐',
      'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖',
    ];
    return animals[(year - 4) % 12];
  };

  // Detailed Age Calculation
  const ageData: AgeBreakdown | null = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(birthDate + 'T00:00:00');
    const target = new Date(targetDate + 'T23:59:59');

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return null;

    // Day of week born
    const daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const dayOfWeekBorn = daysOfWeek[birth.getDay()];

    // Difference calculations
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Days in previous month
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next Birthday calculation
    const currentYear = new Date().getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());

    const now = new Date();
    // Reset hours for accurate calendar day count
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const isBirthdayToday =
      now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate();

    if (nextBday < todayZero) {
      nextBday.setFullYear(currentYear + 1);
    }

    const nextDiffTime = nextBday.getTime() - todayZero.getTime();
    const nextBirthdayDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));
    const nextBirthdayMonths = Math.floor(nextBirthdayDays / 30.4375);
    const nextBirthdayDayOfWeek = daysOfWeek[nextBday.getDay()];

    const birthMonth = birth.getMonth() + 1;
    const birthDay = birth.getDate();
    const zodiacSign = getZodiacSign(birthDay, birthMonth);
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      dayOfWeekBorn,
      zodiacSign,
      chineseZodiac,
      nextBirthdayDays,
      nextBirthdayMonths,
      nextBirthdayDate: nextBday,
      nextBirthdayDayOfWeek,
      isBirthdayToday,
    };
  }, [birthDate, targetDate]);

  // Live countdown effect (updates every second)
  useEffect(() => {
    if (!birthDate) return;

    const calculateCountdown = () => {
      const birth = new Date(birthDate + 'T00:00:00');
      if (isNaN(birth.getTime())) return;

      const now = new Date();
      const currentYear = now.getFullYear();
      let nextBirthday = new Date(currentYear, birth.getMonth(), birth.getDate(), 0, 0, 0);

      if (nextBirthday.getTime() < now.getTime()) {
        nextBirthday.setFullYear(currentYear + 1);
      }

      const diff = nextBirthday.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [birthDate]);

  // Copy Summary to Clipboard
  const handleCopySummary = async () => {
    if (!ageData) return;

    const summary = `Age Calculation (ToolBox BD):
Exact Age: ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days
Born On: ${ageData.dayOfWeekBorn}
Total Days Lived: ${ageData.totalDays.toLocaleString()} days
Zodiac: ${ageData.zodiacSign}
Next Birthday: in ${ageData.nextBirthdayDays} days (${ageData.nextBirthdayDayOfWeek})`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      showToast('Age summary copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy summary', 'error');
    }
  };

  const handleReset = () => {
    setBirthDate(defaultBirthDate);
    setTargetDate(todayStr);
    showToast('Reset dates to defaults', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Date Pickers Form Card */}
      <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Select Birth Date & Target Date
            </h3>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors self-end sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Today</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Date of Birth Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Your Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                max={targetDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-3 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer min-h-[44px]"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Enter the day, month, and year you were born.
            </p>
          </div>

          {/* Age as of (Target Date) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Calculate Age As Of
              </label>
              <button
                type="button"
                onClick={() => setTargetDate(todayStr)}
                className="text-[11px] text-blue-600 hover:underline font-medium"
              >
                Set Today
              </button>
            </div>
            <div className="relative">
              <input
                type="date"
                value={targetDate}
                min={birthDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-3 text-sm font-medium bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer min-h-[44px]"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Helpful for job, civil exam, or school entry age restrictions.
            </p>
          </div>
        </div>
      </div>

      {ageData ? (
        <div className="space-y-6">
          {/* Today Is Birthday Celebration Banner */}
          {ageData.isBirthdayToday && (
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-3xl p-6 shadow-sm flex items-center gap-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <PartyPopper className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Happy Birthday! 🎂</h3>
                <p className="text-xs sm:text-sm text-white/90">
                  Wishing you a wonderful year ahead filled with happiness and success!
                </p>
              </div>
            </div>
          )}

          {/* Primary Hero Result: Years, Months, Days */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Exact Age Result
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                  {ageData.years} Years, {ageData.months} Months, {ageData.days} Days
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors self-start sm:self-auto min-h-[40px]"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
                <span>{copied ? 'Copied Summary' : 'Copy Age Summary'}</span>
              </button>
            </div>

            {/* Prominent Tri-card Breakdown */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              <div className="p-4 sm:p-6 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="text-3xl sm:text-5xl font-extrabold text-blue-600 font-mono tracking-tight">
                  {ageData.years}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  Years
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-3xl sm:text-5xl font-extrabold text-slate-800 font-mono tracking-tight">
                  {ageData.months}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  Months
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-3xl sm:text-5xl font-extrabold text-slate-800 font-mono tracking-tight">
                  {ageData.days}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider">
                  Days
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-blue-500" />
                <span>You were born on a <strong>{ageData.dayOfWeekBorn}</strong>.</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Western Zodiac: <strong>{ageData.zodiacSign}</strong></span>
              </div>
            </div>
          </div>

          {/* Next Birthday Live Countdown Feature */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Next Birthday Countdown
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                    {ageData.nextBirthdayDays === 0
                      ? 'Celebrating Today! 🎉'
                      : `In ${ageData.nextBirthdayDays} Days (${ageData.nextBirthdayDayOfWeek})`}
                  </h3>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto font-mono">
                {ageData.nextBirthdayDate.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Live Real-time Clock Ticker */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2">
              <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-4xl font-bold font-mono text-amber-400">
                  {countdown.days}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                  Days
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-4xl font-bold font-mono text-white">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                  Hours
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-4xl font-bold font-mono text-white">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                  Minutes
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-2xl sm:text-4xl font-bold font-mono text-emerald-400">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                  Seconds
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Time Units Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-blue-600" />
              <span>Total Lifetime in Different Units</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="text-xs text-slate-500 font-medium">Total Months</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-1">
                  {ageData.totalMonths.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="text-xs text-slate-500 font-medium">Total Weeks</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-1">
                  {ageData.totalWeeks.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="text-xs text-slate-500 font-medium">Total Days</div>
                <div className="text-lg sm:text-xl font-bold text-blue-600 font-mono mt-1">
                  {ageData.totalDays.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="text-xs text-slate-500 font-medium">Total Hours</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-1">
                  {ageData.totalHours.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="text-xs text-slate-500 font-medium">Total Minutes</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-1 truncate">
                  {ageData.totalMinutes.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="text-xs text-slate-500 font-medium">Total Seconds</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono mt-1 truncate">
                  {ageData.totalSeconds.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Fun Astrology & Cultural Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Zodiac Sun Sign</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {ageData.zodiacSign}
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Chinese Lunar Zodiac</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  Year of the {ageData.chineseZodiac}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 space-y-2">
          <p className="font-semibold text-sm">Invalid Date Selection</p>
          <p className="text-xs">Date of birth cannot be in the future of the target date.</p>
        </div>
      )}
    </div>
  );
};
