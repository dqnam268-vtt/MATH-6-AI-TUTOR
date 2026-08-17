import React, { useState } from 'react';
import { BookOpen, CheckCircle, Laptop, Compass, Sparkles } from 'lucide-react';
import { GRADE_6_CURRICULUM } from '../../data/curriculum';
import { MathRenderer } from '../MathRenderer';

export const CurriculumBrowser: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredChapters = GRADE_6_CURRICULUM.filter(
    (ch) => ch.semester === selectedSemester
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Tra Cứu Khung Chương Trình & Chuẩn Kiến Thức Toán 6
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bộ sách "Kết nối tri thức với cuộc sống" tích hợp năng lực số
          </p>
        </div>

        {/* Semester selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedSemester(1)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSemester === 1
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học kỳ I
          </button>
          <button
            onClick={() => setSelectedSemester(2)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSemester === 2
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học kỳ II
          </button>
        </div>
      </div>

      {/* Chapters & Lessons Accordion / Cards */}
      <div className="space-y-6">
        {filteredChapters.map((chapter) => (
          <div
            key={chapter.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-base font-bold text-indigo-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                  {chapter.number}
                </span>
                Chương {chapter.number}: {chapter.title}
              </h4>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                {chapter.lessons.length} bài học
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-3 hover:border-indigo-200 transition-all shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5 className="font-bold text-sm text-slate-800">
                      {lesson.code}: {lesson.title}
                    </h5>
                  </div>

                  {/* Objectives */}
                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="font-semibold text-indigo-900">Mục tiêu cần đạt:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {lesson.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Knowledge KaTeX */}
                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-slate-800">Đơn vị kiến thức:</div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {lesson.keyKnowledge.map((k, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                        >
                          <MathRenderer content={k} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Digital tool & context */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900 flex items-start gap-2">
                      <Compass className="w-3.5 h-3.5 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Bối cảnh thực tế: </span>
                        {lesson.realWorldContext}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 text-purple-900 flex items-start gap-2">
                      <Laptop className="w-3.5 h-3.5 mt-0.5 text-purple-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Tích hợp năng lực số: </span>
                        {lesson.digitalToolSuggestion}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
