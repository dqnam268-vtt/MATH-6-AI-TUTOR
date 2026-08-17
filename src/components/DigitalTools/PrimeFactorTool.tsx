import React, { useState, useMemo } from 'react';
import { MathRenderer } from '../MathRenderer';
import { Calculator, Sparkles, Hash } from 'lucide-react';

export const PrimeFactorTool: React.FC = () => {
  const [inputNum1, setInputNum1] = useState<number>(36);
  const [inputNum2, setInputNum2] = useState<number>(48);

  // Prime factorization helper
  const factorize = (n: number) => {
    if (n <= 1) return [];
    const factors: { prime: number; power: number }[] = [];
    let num = n;
    let d = 2;
    while (d * d <= num) {
      if (num % d === 0) {
        let count = 0;
        while (num % d === 0) {
          count++;
          num /= d;
        }
        factors.push({ prime: d, power: count });
      }
      d = d === 2 ? 3 : d + 2;
    }
    if (num > 1) {
      factors.push({ prime: num, power: 1 });
    }
    return factors;
  };

  // GCD and LCM
  const gcd = (a: number, b: number): number => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  };

  const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  };

  const factors1 = useMemo(() => factorize(inputNum1), [inputNum1]);
  const factors2 = useMemo(() => factorize(inputNum2), [inputNum2]);

  const gcdVal = useMemo(() => gcd(inputNum1, inputNum2), [inputNum1, inputNum2]);
  const lcmVal = useMemo(() => lcm(inputNum1, inputNum2), [inputNum1, inputNum2]);

  const formatFactorization = (factors: { prime: number; power: number }[]) => {
    if (factors.length === 0) return '1';
    return factors
      .map((f) => (f.power > 1 ? `${f.prime}^{${f.power}}` : `${f.prime}`))
      .join(' \\cdot ');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Máy Phân Tích Thừa Số Nguyên Tố & Tìm ƯCLN, BCNN
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phân tích số ra thừa số nguyên tố và tìm Ước chung lớn nhất, Bội chung nhỏ nhất (Bài 8 - 12 Toán 6)
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-indigo-600" />
            Số thứ nhất (a): <span className="font-bold text-indigo-600 text-sm">{inputNum1}</span>
          </label>
          <input
            type="number"
            min={2}
            max={5000}
            value={inputNum1}
            onChange={(e) => setInputNum1(Math.max(2, Math.min(5000, parseInt(e.target.value) || 2)))}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-emerald-600" />
            Số thứ hai (b): <span className="font-bold text-emerald-600 text-sm">{inputNum2}</span>
          </label>
          <input
            type="number"
            min={2}
            max={5000}
            value={inputNum2}
            onChange={(e) => setInputNum2(Math.max(2, Math.min(5000, parseInt(e.target.value) || 2)))}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Factorization Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
          <div className="text-xs font-bold text-indigo-900 uppercase">
            Phân tích số {inputNum1} ra TSNT
          </div>
          <div className="text-base font-bold text-indigo-950 font-serif">
            <MathRenderer content={`$$${inputNum1} = ${formatFactorization(factors1)}$$`} />
          </div>
          <div className="text-xs text-indigo-800">
            Các ước nguyên tố: {factors1.map((f) => f.prime).join(', ') || 'Không có'}
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2">
          <div className="text-xs font-bold text-emerald-900 uppercase">
            Phân tích số {inputNum2} ra TSNT
          </div>
          <div className="text-base font-bold text-emerald-950 font-serif">
            <MathRenderer content={`$$${inputNum2} = ${formatFactorization(factors2)}$$`} />
          </div>
          <div className="text-xs text-emerald-800">
            Các ước nguyên tố: {factors2.map((f) => f.prime).join(', ') || 'Không có'}
          </div>
        </div>
      </div>

      {/* GCD & LCM Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1.5">
          <div className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Ước chung lớn nhất: ƯCLN({inputNum1}; {inputNum2})
          </div>
          <div className="text-xl font-extrabold text-amber-950">
            <MathRenderer content={`$$\\text{ƯCLN}(${inputNum1}; ${inputNum2}) = ${gcdVal}$$`} />
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Quy tắc: Chọn các <strong>thừa số nguyên tố chung</strong> với số mũ <strong>nhỏ nhất</strong> rồi lập tích.
          </p>
        </div>

        <div className="p-4 bg-purple-50/70 border border-purple-200/60 rounded-xl space-y-1.5">
          <div className="text-xs font-bold text-purple-900 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Bội chung nhỏ nhất: BCNN({inputNum1}; {inputNum2})
          </div>
          <div className="text-xl font-extrabold text-purple-950">
            <MathRenderer content={`$$\\text{BCNN}(${inputNum1}; ${inputNum2}) = ${lcmVal}$$`} />
          </div>
          <p className="text-[11px] text-purple-800 leading-relaxed">
            Quy tắc: Chọn các <strong>thừa số nguyên tố chung và riêng</strong> với số mũ <strong>lớn nhất</strong> rồi lập tích.
          </p>
        </div>
      </div>
    </div>
  );
};
