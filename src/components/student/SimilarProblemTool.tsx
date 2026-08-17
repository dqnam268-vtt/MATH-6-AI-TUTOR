import React, { useState } from 'react';
import { Copy, Sparkles, HelpCircle, Check, Eye, Lightbulb } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';

export const SimilarProblemTool: React.FC = () => {
  const [originalProblem, setOriginalProblem] = useState<string>(
    'Một mảnh đất hình chữ nhật có chiều dài 25m, chiều rộng bằng 3/5 chiều dài. Tính diện tích mảnh đất đó.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [similarResult, setSimilarResult] = useState<any | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const handleGenerateSimilar = async () => {
    if (!originalProblem.trim()) return;

    setIsGenerating(true);
    setSimilarResult(null);
    setHintLevel(0);

    try {
      const response = await fetch('/api/generate-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalProblem
        })
      });

      const data = await response.json();
      setSimilarResult(data);
    } catch (err) {
      console.error('Error generating similar problem:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Copy className="w-5 h-5 text-blue-600" />
            Sinh Bài Toán Tương Tự (Rèn Luyện Tư Duy Tự Lực)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cùng kiến thức & phương pháp • Khác dữ kiện & tình huống thực tế
          </p>
        </div>
      </div>

      {/* Original Problem Input */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Nhập bài toán gốc (hoặc bài vừa làm xong):
        </label>
        <textarea
          rows={3}
          value={originalProblem}
          onChange={(e) => setOriginalProblem(e.target.value)}
          placeholder="Nhập bài toán..."
          className="w-full p-3.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGenerateSimilar}
          disabled={isGenerating || !originalProblem.trim()}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Đang tạo bài toán tương tự...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Tạo bài tương tự mới
            </>
          )}
        </button>
      </div>

      {/* Similar Problem Generated */}
      {similarResult && (
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
              {similarResult.problemType || 'Bài toán tương tự'}
            </span>
            <span className="text-xs text-blue-700 font-semibold">
              Bối cảnh: {similarResult.realWorldContext || 'Thực tiễn'}
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-blue-100 text-slate-900 text-sm font-semibold leading-relaxed shadow-2xs">
            <MathRenderer content={similarResult.newProblem} />
          </div>

          {/* Socratic Hint Progression */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Mức độ tự giải & trợ giúp:</span>
              <button
                onClick={() => setHintLevel(1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  hintLevel >= 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Gợi ý 1 (Định hướng)
              </button>
              <button
                onClick={() => setHintLevel(2)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  hintLevel >= 2
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Gợi ý 2 (Từng bước)
              </button>
              <button
                onClick={() => setHintLevel(3)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  hintLevel >= 3
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Xem lời giải mẫu
              </button>
            </div>

            {hintLevel >= 1 && similarResult.hints?.[0] && (
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1 shadow-2xs">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  💡 Gợi ý 1:
                </div>
                <div>{similarResult.hints[0]}</div>
              </div>
            )}

            {hintLevel >= 2 && similarResult.hints?.[1] && (
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 text-xs text-slate-800 space-y-1 shadow-2xs">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  💡 Gợi ý 2:
                </div>
                <div>{similarResult.hints[1]}</div>
              </div>
            )}

            {hintLevel >= 3 && similarResult.solution && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Lời giải chi tiết:
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <MathRenderer content={similarResult.solution} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
