import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Laptop, Lightbulb, Play } from 'lucide-react';
import { GRADE_6_CURRICULUM } from '../../data/curriculum';
import { MathRenderer } from '../MathRenderer';

export const LessonExplorer: React.FC = () => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [revealedSteps, setRevealedSteps] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizExplanations, setShowQuizExplanations] = useState<boolean>(false);

  const currentChapter = GRADE_6_CURRICULUM[selectedChapterIndex];
  const currentLesson = currentChapter.lessons[selectedLessonIndex];

  const handleGenerateLesson = async () => {
    setIsGenerating(true);
    setRevealedSteps({});
    setQuizAnswers({});
    setShowQuizExplanations(false);

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: currentLesson.title,
          lessonCode: currentLesson.code
        })
      });

      const data = await response.json();
      setLessonData(data);
    } catch (err) {
      console.error('Error generating lesson:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStep = (idx: number) => {
    setRevealedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Khám Phá & Học Bài Tương Tác (Tiến trình Sư Phạm)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Thực tế → Khởi động → Dự đoán → Khám phá → Hình thành kiến thức → Luyện tập → Vận dụng
          </p>
        </div>
      </div>

      {/* Chapter & Lesson Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="sm:col-span-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Chương:</label>
          <select
            value={selectedChapterIndex}
            onChange={(e) => {
              setSelectedChapterIndex(parseInt(e.target.value));
              setSelectedLessonIndex(0);
              setLessonData(null);
            }}
            className="w-full text-xs font-medium p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            {GRADE_6_CURRICULUM.map((ch, idx) => (
              <option key={ch.id} value={idx}>
                Chương {ch.number}: {ch.title} (Học kỳ {ch.semester})
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Bài Học:</label>
          <select
            value={selectedLessonIndex}
            onChange={(e) => {
              setSelectedLessonIndex(parseInt(e.target.value));
              setLessonData(null);
            }}
            className="w-full text-xs font-medium p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            {currentChapter.lessons.map((ls, idx) => (
              <option key={ls.id} value={idx}>
                {ls.code}: {ls.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Card from Curriculum */}
      <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-base font-bold text-blue-950">
            {currentLesson.code}: {currentLesson.title}
          </h4>
          <button
            onClick={handleGenerateLesson}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-blue-200 self-start sm:self-auto active:scale-95"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang mở tiến trình học...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Bắt đầu học bài tương tác
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-slate-700 space-y-1">
          <div className="font-bold text-blue-900">Mục tiêu bài học cần đạt:</div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            {currentLesson.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Lesson Generated Stream */}
      {lessonData && (
        <div className="space-y-6 pt-2">
          {/* Phase 1: Real-world & Warm-up */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-amber-100/30 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                1
              </span>
              Khởi Động & Tình Huống Thực Tế
            </div>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {lessonData.realWorldContext}
            </p>
            <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs text-slate-800 space-y-1.5">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Câu hỏi khởi động:
              </div>
              <div className="text-slate-700 leading-relaxed">{lessonData.warmUp?.question}</div>
              <div className="text-[11px] text-slate-500 italic mt-1">
                💡 Gợi ý: {lessonData.warmUp?.hint}
              </div>
            </div>
          </div>

          {/* Phase 2: Discovery Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                2
              </span>
              Quan Sát – Nhận Xét – Khám Phá Quy Luật
            </div>

            <div className="grid grid-cols-1 gap-3">
              {lessonData.discoverySteps?.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2"
                >
                  <div className="font-bold text-blue-900 text-sm flex items-center justify-between">
                    <span>{step.stepNumber}. {step.title}</span>
                    <button
                      onClick={() => toggleStep(idx)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      {revealedSteps[idx] ? 'Ẩn kết luận' : 'Xem kết luận'}
                    </button>
                  </div>
                  <div className="text-slate-700 leading-relaxed">{step.activity}</div>
                  <div className="p-2.5 bg-blue-50/60 rounded-lg text-blue-950 font-medium">
                    ❓ {step.guidingQuestion}
                  </div>
                  {revealedSteps[idx] && (
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs font-semibold animate-fadeIn">
                      ✅ Đúc kết: <MathRenderer content={step.revealKey} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: Core Knowledge Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">
                3
              </span>
              Kiến Thức Trọng Tâm Cần Nhớ
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-100">
              {lessonData.coreKnowledge?.map((k: string, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <MathRenderer content={k} />
                </div>
              ))}
            </div>
          </div>

          {/* Phase 4: Sample Example with pedagogical analysis */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Ví dụ mẫu mực
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800">
              <span className="font-bold">Bài toán: </span>
              <MathRenderer content={lessonData.sampleExample?.problem || ''} />
            </div>
            <div className="text-slate-600 leading-relaxed">
              <span className="font-bold text-blue-900">Phân tích: </span>
              <MathRenderer content={lessonData.sampleExample?.analysis || ''} />
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950">
              <span className="font-bold">Lời giải chuẩn: </span>
              <MathRenderer content={lessonData.sampleExample?.solution || ''} />
            </div>
          </div>

          {/* Phase 5: Digital Tool & Real-life Application */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-purple-600" />
                Ứng dụng công cụ số ({lessonData.digitalTool?.name})
              </div>
              <p className="text-purple-800">{lessonData.digitalTool?.purpose}</p>
              <div className="text-slate-600 text-[11px] bg-white p-2 rounded-lg border border-purple-100">
                {lessonData.digitalTool?.instruction}
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
              <div className="font-bold text-emerald-900">Vận dụng vào thực tế</div>
              <p className="text-emerald-800 leading-relaxed">
                {lessonData.realLifeApplication}
              </p>
            </div>
          </div>

          {/* Phase 6: Quick Self Check Quiz */}
          {lessonData.quickSelfCheck && lessonData.quickSelfCheck.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm">
                  ⚡ Tự kiểm tra nhanh (3 câu)
                </div>
                <button
                  onClick={() => setShowQuizExplanations(!showQuizExplanations)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {showQuizExplanations ? 'Ẩn đáp án & giải thích' : 'Hiện đáp án & giải thích'}
                </button>
              </div>

              <div className="space-y-3">
                {lessonData.quickSelfCheck.map((q: any, qIdx: number) => {
                  const userAns = quizAnswers[q.id];
                  const isAnswered = typeof userAns === 'number';
                  const isCorrect = userAns === q.correctIndex;

                  return (
                    <div
                      key={q.id || qIdx}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs"
                    >
                      <div className="font-semibold text-slate-800">
                        Câu {qIdx + 1}: <MathRenderer content={q.question} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options?.map((opt: string, optIdx: number) => {
                          const isSelected = userAns === optIdx;
                          const isThisCorrect = optIdx === q.correctIndex;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                                isSelected
                                  ? showQuizExplanations
                                    ? isThisCorrect
                                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                                      : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                                    : 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                                  : showQuizExplanations && isThisCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <MathRenderer content={opt} />
                            </button>
                          );
                        })}
                      </div>

                      {showQuizExplanations && (
                        <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800">Giải thích: </span>
                          <MathRenderer content={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
