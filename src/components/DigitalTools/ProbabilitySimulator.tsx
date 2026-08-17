import React, { useState } from 'react';
import { MathRenderer } from '../MathRenderer';
import { Play, RotateCcw, Dices, Coins, BarChart2 } from 'lucide-react';

export const ProbabilitySimulator: React.FC = () => {
  const [experimentType, setExperimentType] = useState<'coin' | 'dice'>('coin');
  const [totalTrials, setTotalTrials] = useState<number>(0);
  
  // Coin state: Heads (Sấp), Tails (Ngửa)
  const [coinHeads, setCoinHeads] = useState<number>(0);
  const [coinTails, setCoinTails] = useState<number>(0);

  // Dice state: 1, 2, 3, 4, 5, 6 counts
  const [diceCounts, setDiceCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runExperiment = (batchCount: number) => {
    setIsSimulating(true);
    setTimeout(() => {
      if (experimentType === 'coin') {
        let heads = 0;
        let tails = 0;
        for (let i = 0; i < batchCount; i++) {
          if (Math.random() < 0.5) heads++;
          else tails++;
        }
        setCoinHeads((prev) => prev + heads);
        setCoinTails((prev) => prev + tails);
        setTotalTrials((prev) => prev + batchCount);
      } else {
        const counts = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < batchCount; i++) {
          const roll = Math.floor(Math.random() * 6);
          counts[roll]++;
        }
        setDiceCounts((prev) => prev.map((val, idx) => val + counts[idx]));
        setTotalTrials((prev) => prev + batchCount);
      }
      setIsSimulating(false);
    }, 150);
  };

  const handleReset = () => {
    setTotalTrials(0);
    setCoinHeads(0);
    setCoinTails(0);
    setDiceCounts([0, 0, 0, 0, 0, 0]);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            Phòng Thí Nghiệm Xác Suất Thực Nghiệm (Chương IX Toán 6)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mô phỏng gieo xúc xắc và tung đồng xu để khám phá quy luật xác suất thực nghiệm
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Xóa dữ liệu
        </button>
      </div>

      {/* Experiment Type Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setExperimentType('coin');
            handleReset();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            experimentType === 'coin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          Tung đồng xu (Sấp / Ngửa)
        </button>
        <button
          onClick={() => {
            setExperimentType('dice');
            handleReset();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            experimentType === 'dice'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Dices className="w-4 h-4" />
          Gieo xúc xắc (1 - 6 chấm)
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-semibold text-slate-700">
          Tổng số lần thực nghiệm: <span className="text-indigo-600 text-base font-bold">{totalTrials}</span> lần
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={isSimulating}
            onClick={() => runExperiment(1)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-sm"
          >
            +1 lần
          </button>
          <button
            disabled={isSimulating}
            onClick={() => runExperiment(10)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-sm"
          >
            +10 lần
          </button>
          <button
            disabled={isSimulating}
            onClick={() => runExperiment(50)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          >
            +50 lần
          </button>
          <button
            disabled={isSimulating}
            onClick={() => runExperiment(200)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-800 text-white hover:bg-indigo-900 shadow-sm"
          >
            +200 lần
          </button>
        </div>
      </div>

      {/* Visual Chart / Histogram */}
      {experimentType === 'coin' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/40 rounded-2xl border border-amber-200/70 text-center space-y-3">
            <div className="text-sm font-bold text-amber-950 flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs shadow-inner">
                S
              </span>
              Mặt Sấp (Heads)
            </div>
            <div className="text-3xl font-black text-amber-900">{coinHeads} <span className="text-xs font-normal text-amber-700">lần</span></div>
            <div className="text-xs font-semibold text-amber-800">
              Xác suất thực nghiệm:{' '}
              <span className="text-sm font-bold text-amber-950">
                {totalTrials > 0 ? ((coinHeads / totalTrials) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${totalTrials > 0 ? (coinHeads / totalTrials) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/40 rounded-2xl border border-blue-200/70 text-center space-y-3">
            <div className="text-sm font-bold text-blue-950 flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs shadow-inner">
                N
              </span>
              Mặt Ngửa (Tails)
            </div>
            <div className="text-3xl font-black text-blue-900">{coinTails} <span className="text-xs font-normal text-blue-700">lần</span></div>
            <div className="text-xs font-semibold text-blue-800">
              Xác suất thực nghiệm:{' '}
              <span className="text-sm font-bold text-blue-950">
                {totalTrials > 0 ? ((coinTails / totalTrials) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${totalTrials > 0 ? (coinTails / totalTrials) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const count = diceCounts[num - 1];
              const pct = totalTrials > 0 ? ((count / totalTrials) * 100).toFixed(1) : '0';
              return (
                <div
                  key={num}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center space-y-2 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {num} ⚀
                  </div>
                  <div className="text-lg font-black text-slate-800">{count} <span className="text-[10px] font-normal text-slate-500">lần</span></div>
                  <div className="text-[11px] font-bold text-indigo-700">{pct}%</div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${totalTrials > 0 ? (count / totalTrials) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Textbook Formula Note */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700 space-y-1.5">
        <div className="font-bold text-slate-900">
          Công thức SGK Toán 6 Kết Nối Tri Thức (Bài 43):
        </div>
        <MathRenderer
          content={`$$\\text{Xác suất thực nghiệm của sự kiện } A = \\frac{\\text{Số lần sự kiện } A \\text{ xảy ra}}{\\text{Tổng số lần thực nghiệm}} = \\frac{k}{n}$$`}
        />
        <p className="text-slate-600 text-[11px]">
          *Nhận xét: Khi số lần thực nghiệm $n$ càng lớn, xác suất thực nghiệm sẽ càng tiến gần đến xác suất lý thuyết (50% cho mỗi mặt đồng xu, và xấp xỉ 16.7% cho mỗi mặt con xúc xắc).
        </p>
      </div>
    </div>
  );
};
