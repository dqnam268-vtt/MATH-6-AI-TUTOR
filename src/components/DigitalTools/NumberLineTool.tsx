import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Plus, Minus, Info } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';

export const NumberLineTool: React.FC = () => {
  const [startNum, setStartNum] = useState<number>(-2);
  const [operation, setOperation] = useState<'+' | '-'>('+');
  const [stepNum, setStepNum] = useState<number>(5);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  const minRange = -10;
  const maxRange = 10;
  const totalUnits = maxRange - minRange;

  const result = operation === '+' ? startNum + stepNum : startNum - stepNum;

  const getPercent = (val: number) => {
    const clamped = Math.max(minRange, Math.min(maxRange, val));
    return ((clamped - minRange) / totalUnits) * 100;
  };

  const startPercent = getPercent(startNum);
  const resultPercent = getPercent(result);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Phòng Thí Nghiệm Số Học: Trục Số Tương Tác
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Trực quan hóa phép cộng và trừ số nguyên qua bước nhảy trên trục số (Bài 13, 14 Toán 6)
          </p>
        </div>
        <button
          onClick={() => {
            setStartNum(-2);
            setOperation('+');
            setStepNum(5);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại
        </button>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Điểm xuất phát: <span className="text-indigo-600 font-bold text-sm">{startNum}</span>
          </label>
          <input
            type="range"
            min={-8}
            max={8}
            value={startNum}
            onChange={(e) => setStartNum(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-8</span>
            <span>0</span>
            <span>+8</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phép toán
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOperation('+')}
              className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                operation === '+'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Cộng (+)
            </button>
            <button
              onClick={() => setOperation('-')}
              className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                operation === '-'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Minus className="w-3.5 h-3.5" /> Trừ (-)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Bước nhảy: <span className="text-indigo-600 font-bold text-sm">{stepNum}</span>
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={stepNum}
            onChange={(e) => setStepNum(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1</span>
            <span>4</span>
            <span>8</span>
          </div>
        </div>
      </div>

      {/* Visual Number Line */}
      <div className="py-6 px-4 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200/80 overflow-x-auto">
        <div className="min-w-[550px] relative pt-12 pb-8 px-6">
          {/* Jump Arrow Arc */}
          <svg className="w-full h-16 absolute top-2 left-0 pointer-events-none px-6" viewBox="0 0 100 24" preserveAspectRatio="none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 6 3, 0 6"
                  fill={operation === '+' ? '#059669' : '#d97706'}
                />
              </marker>
            </defs>
            <path
              d={`M ${startPercent} 20 Q ${(startPercent + resultPercent) / 2} -4 ${resultPercent} 20`}
              fill="none"
              stroke={operation === '+' ? '#059669' : '#d97706'}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              markerEnd="url(#arrowhead)"
            />
          </svg>

          {/* Main Axis Line */}
          <div className="relative h-1 bg-slate-400 rounded-full w-full">
            {/* Zero Mark Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-white shadow-sm z-10"
              style={{ left: `${getPercent(0)}%`, transform: 'translate(-50%, -50%)' }}
            />

            {/* Tick Marks & Numbers */}
            {Array.from({ length: totalUnits + 1 }, (_, i) => {
              const num = minRange + i;
              const pos = getPercent(num);
              const isStart = num === startNum;
              const isResult = num === result;
              const isZero = num === 0;

              return (
                <div
                  key={num}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div
                    className={`w-0.5 ${
                      isZero ? 'h-5 bg-slate-900' : 'h-3 bg-slate-400'
                    }`}
                  />
                  <span
                    className={`text-[11px] mt-2 select-none ${
                      isZero
                        ? 'font-extrabold text-slate-900 text-xs'
                        : isStart
                        ? 'font-bold text-indigo-600'
                        : isResult
                        ? 'font-bold text-emerald-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {num}
                  </span>
                </div>
              );
            })}

            {/* Start Marker Pin */}
            <div
              className="absolute -top-3 z-20 flex flex-col items-center transition-all duration-300"
              style={{ left: `${startPercent}%`, transform: 'translate(-50%, -100%)' }}
            >
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-sm whitespace-nowrap">
                Bắt đầu: {startNum}
              </span>
              <div className="w-2.5 h-2.5 bg-indigo-600 rotate-45 -mt-1" />
            </div>

            {/* Result Marker Pin */}
            <div
              className="absolute top-6 z-20 flex flex-col items-center transition-all duration-300"
              style={{ left: `${resultPercent}%`, transform: 'translate(-50%, 0)' }}
            >
              <div className="w-2.5 h-2.5 bg-emerald-600 rotate-45 -mb-1" />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm whitespace-nowrap">
                Kết quả: {result}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formula & Rule Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">
              Phép tính toán học
            </div>
            <div className="text-xl font-extrabold text-indigo-950 font-serif my-2">
              <MathRenderer content={`$$${startNum} ${operation} ${stepNum} = ${result}$$`} />
            </div>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            {operation === '+' ? (
              <>
                Khi <strong>cộng số dương (+{stepNum})</strong>, ta di chuyển từ điểm{' '}
                <strong>{startNum}</strong> sang <strong>bên phải</strong> {stepNum} đơn vị.
              </>
            ) : (
              <>
                Khi <strong>trừ số ({stepNum})</strong>, ta di chuyển từ điểm{' '}
                <strong>{startNum}</strong> sang <strong>bên trái</strong> {stepNum} đơn vị.
              </>
            )}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-600" />
            Quy tắc cốt lõi SGK Toán 6 Kết Nối Tri Thức:
          </div>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Số nguyên âm nằm bên trái điểm gốc 0, số nguyên dương nằm bên phải.</li>
            <li>Phép trừ số nguyên chuyển thành phép cộng với số đối: $a - b = a + (-b)$.</li>
            <li>Càng về bên phải trục số, giá trị của số càng lớn hơn: $a &lt; b$ khi điểm $a$ nằm bên trái điểm $b$.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
