import React, { useState, useRef } from 'react';
import { CheckCircle, AlertTriangle, HelpCircle, Image as ImageIcon, Send, Sparkles, X, ArrowRight } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';

interface AnalysisResult {
  isCorrect: boolean;
  errorType: 'knowledge' | 'method' | 'calculation' | 'symbol' | 'reading' | 'presentation' | 'none';
  errorTypeLabel: string;
  praise: string;
  firstErrorStep?: string;
  socraticQuestion: string;
  detailedFeedback: string;
  nextSuggestedExercise?: string;
}

export const SolutionChecker: React.FC = () => {
  const [problemText, setProblemText] = useState<string>(
    'Thực hiện phép tính: (-25) + 40 - (-15)'
  );
  const [solutionText, setSolutionText] = useState<string>(
    '(-25) + 40 - (-15) = 15 - 15 = 0'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!solutionText.trim() && !selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problemText,
          studentSolution: solutionText,
          imageBase64: selectedImage
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error analyzing solution:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleCases = [
    {
      title: 'Lỗi quy tắc trừ số nguyên',
      problem: 'Tính giá trị biểu thức: $12 - (-18) + (-5)$',
      solution: '$12 - (-18) + (-5) = 12 - 18 + (-5) = -6 + (-5) = -11$'
    },
    {
      title: 'Lỗi thứ tự thực hiện phép tính',
      problem: 'Tính: $20 - 2 \\cdot 3^2$',
      solution: '$20 - 2 \\cdot 3^2 = 18 \\cdot 9 = 162$'
    },
    {
      title: 'Bài giải chuẩn xác',
      problem: 'Tìm $x$ biết: $3x - 15 = 30$',
      solution: '$3x = 30 + 15$\n$3x = 45$\n$x = 45 : 3$\n$x = 15$'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Kiểm Tra Lời Giải & Chẩn Đoán Lỗi Sư Phạm
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI kiểm tra 8 tiêu chí (đọc đề, phương pháp, biến đổi, tính toán, ký hiệu, trình bày) và chỉ ra bước sai đầu tiên
          </p>
        </div>
      </div>

      {/* Quick Sample Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Mẫu thử nghiệm nhanh:</span>
        {sampleCases.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setProblemText(sample.problem);
              setSolutionText(sample.solution);
              setResult(null);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Problem Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Đề bài toán:
          </label>
          <textarea
            rows={3}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Nhập đề bài toán (hoặc đính kèm ảnh)..."
            className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Student Solution */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Lời giải của em:
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Tải ảnh bài làm trong vở
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <textarea
            rows={3}
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            placeholder="Ghi từng bước em đã làm để AI kiểm tra giúp em..."
            className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />

          {/* Quick Math Symbols for Solution */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex-shrink-0">
              Chèn nhanh:
            </span>
            {[
              { label: '· (nhân)', sym: ' \\cdot ' },
              { label: ': (chia)', sym: ' : ' },
              { label: 'a/b', sym: ' \\frac{a}{b} ' },
              { label: 'x²', sym: '^2' },
              { label: '∈ ℤ', sym: ' \\in \\mathbb{Z}' },
              { label: '≤', sym: ' \\le ' },
              { label: '≥', sym: ' \\ge ' },
              { label: 'ƯCLN', sym: ' \\text{ƯCLN}(a, b)' },
              { label: 'BCNN', sym: ' \\text{BCNN}(a, b)' }
            ].map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSolutionText((prev) => prev + s.sym)}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white rounded text-[11px] font-mono font-semibold border border-slate-200 transition-colors flex-shrink-0 shadow-2xs"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Preview if selected */}
      {selectedImage && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage}
              alt="Bài làm của học sinh"
              className="w-16 h-16 object-contain rounded-lg border border-slate-300 bg-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-xs font-bold text-slate-800">Đã tải lên ảnh bài làm</div>
              <div className="text-[11px] text-slate-500">AI sẽ nhận diện chữ viết và hình vẽ để kiểm tra</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Check Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!solutionText.trim() && !selectedImage)}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Đang phân tích từng bước...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Kiểm tra bài làm ngay
            </>
          )}
        </button>
      </div>

      {/* Analysis Result Box */}
      {result && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            result.isCorrect
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/60 border-amber-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              {result.isCorrect ? (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {result.isCorrect ? 'Chúc mừng! Bài làm hoàn toàn chính xác!' : 'Nhận xét sư phạm & Hướng dẫn tự sửa'}
                </h4>
                <div className="text-xs text-slate-600">
                  Phân loại: <span className="font-bold text-slate-800">{result.errorTypeLabel}</span>
                </div>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.isCorrect
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {result.isCorrect ? 'Đạt chuẩn 100%' : 'Cần kiểm tra lại'}
            </span>
          </div>

          <div className="space-y-3 text-sm text-slate-800">
            {/* Praise */}
            <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60 text-xs">
              <span className="font-bold text-emerald-700">⭐ Khen ngợi: </span>
              {result.praise}
            </div>

            {/* First Error Step */}
            {!result.isCorrect && result.firstErrorStep && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                <span className="font-bold">⚠️ Vị trí cần xem lại đầu tiên: </span>
                {result.firstErrorStep}
              </div>
            )}

            {/* Socratic Question */}
            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                👉 Câu hỏi gợi ý cho em:
              </div>
              <div>{result.socraticQuestion}</div>
            </div>

            {/* Detailed Feedback */}
            <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60 text-xs space-y-1">
              <div className="font-bold text-slate-800">Chi tiết phương pháp:</div>
              <MathRenderer content={result.detailedFeedback} />
            </div>

            {/* Suggested Next Exercise */}
            {result.nextSuggestedExercise && (
              <div className="p-3 bg-slate-100/80 rounded-xl text-xs text-slate-700 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900">🎯 Bài tập rèn luyện thêm: </span>
                  {result.nextSuggestedExercise}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
