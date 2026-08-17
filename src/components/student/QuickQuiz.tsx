import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Timer, CheckCircle, XCircle, Award, RotateCcw, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';
import { GRADE_6_CURRICULUM } from '../../data/curriculum';
import { DifficultyLevel, QuizQuestion } from '../../types';

export const QuickQuiz: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('Số nguyên (Tập hợp ℤ)');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('standard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: any = null;
    if (timerActive && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, isSubmitted]);

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setQuestions([]);
    setSelectedOptions({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(300);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          count: 4,
          difficulty
        })
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setTimerActive(true);
      }
    } catch (err) {
      console.error('Error starting quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimerActive(false);

    // Calculate score
    const score = questions.reduce((acc, q, idx) => {
      return selectedOptions[idx] === (q as any).correctIndex ? acc + 1 : acc;
    }, 0);

    if (score >= Math.ceil(questions.length * 0.75)) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const score = questions.reduce((acc, q, idx) => {
    return selectedOptions[idx] === (q as any).correctIndex ? acc + 1 : acc;
  }, 0);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-600" />
            Kiểm Tra Nhanh 5 Phút & Rèn Luyện Thích Ứng
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Trắc nghiệm 4 câu • Phân loại lỗi • Tự động điều chỉnh cấp độ
          </p>
        </div>

        {timerActive && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border border-blue-200 shadow-2xs">
            <Timer className="w-4 h-4 animate-pulse text-blue-600" />
            {formatTimer(timeLeft)}
          </div>
        )}
      </div>

      {/* Quiz Configuration Controls */}
      {!timerActive && !isSubmitted && (
        <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chủ đề kiểm tra:
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {GRADE_6_CURRICULUM.map((ch) => (
                  <option key={ch.id} value={ch.title}>
                    Chương {ch.number}: {ch.title}
                  </option>
                ))}
                <option value="Tổng hợp toàn bộ chương trình Toán 6">
                  Tổng hợp toàn bộ chương trình Toán 6
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mức độ thử thách:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'basic', label: '🟢 Cơ bản' },
                  { id: 'standard', label: '🟡 Chuẩn' },
                  { id: 'advanced', label: '🟠 Khá' },
                  { id: 'challenge', label: '🔴 Thử thách' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setDifficulty(lvl.id as DifficultyLevel)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                      difficulty === lvl.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Đang khởi tạo đề...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Bắt đầu làm bài 5 phút
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Quiz Question Screen */}
      {questions.length > 0 && !isSubmitted && (
        <div className="space-y-5">
          {/* Question Stepper */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentIndex === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : typeof selectedOptions[idx] === 'number'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Câu {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* Current Question Box */}
          {questions[currentIndex] && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                <MathRenderer content={questions[currentIndex].question} />
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {questions[currentIndex].options?.map((opt, optIdx) => {
                  const isSelected = selectedOptions[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentIndex, optIdx)}
                      className={`p-3.5 rounded-xl text-left text-xs sm:text-sm border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <div className="flex-1">
                        <MathRenderer content={opt} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nav & Submit Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
            >
              Câu trước
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 active:scale-95"
              >
                Câu tiếp theo
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 active:scale-95"
              >
                Nộp bài & Chấm điểm
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submitted Results Screen */}
      {isSubmitted && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-blue-950">
              Kết Quả Bài Kiểm Tra 5 Phút
            </h4>
            <div className="text-3xl font-black text-blue-900">
              {score} / {questions.length}{' '}
              <span className="text-sm font-normal text-blue-700">
                ({((score / questions.length) * 100).toFixed(0)}%)
              </span>
            </div>
            <p className="text-xs text-blue-800 max-w-md mx-auto">
              {score === questions.length
                ? 'Xuất sắc! Em đã nắm rất vững kiến thức bài học này.'
                : score >= Math.ceil(questions.length * 0.7)
                ? 'Rất tốt! Em chỉ cần xem lại một vài chi tiết nhỏ bên dưới nhé.'
                : 'Em hãy đọc kỹ các giải thích bên dưới để củng cố lại phần kiến thức chưa chắc nhé!'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleStartQuiz}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm đề kiểm tra khác
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h5 className="font-bold text-sm text-slate-800">Xem lại từng câu & Giải thích chi tiết:</h5>
            {questions.map((q: any, idx) => {
              const userAns = selectedOptions[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-3 ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <span className="font-bold text-xs text-slate-900">
                        Câu {idx + 1} ({q.knowledgeNode || 'Toán 6'}):
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? 'Chính xác' : 'Chưa đúng'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 font-medium">
                    <MathRenderer content={q.question} />
                  </div>

                  <div className="p-3 bg-white/80 rounded-lg text-xs text-slate-700 space-y-1 border border-slate-200/50">
                    <div className="font-bold text-slate-800">Giải thích chi tiết:</div>
                    <MathRenderer content={q.explanation} />
                    {q.commonMisconception && (
                      <div className="text-[11px] text-amber-800 italic pt-1">
                        ⚠️ Lỗi sai học sinh thường gặp: {q.commonMisconception}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
