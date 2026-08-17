import React, { useState } from 'react';
import { FileText, Sparkles, Users, Laptop, CheckSquare, Layers, Download } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';
import { GRADE_6_CURRICULUM } from '../../data/curriculum';

export const LessonPlanGenerator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    'Phép cộng và phép trừ số nguyên (Bài 14)'
  );
  const [duration, setDuration] = useState<string>('45 phút');
  const [customGoals, setCustomGoals] = useState<string>(
    'Học sinh thực hiện đúng quy tắc cộng trừ số nguyên, vận dụng vào biến động nhiệt độ và tài khoản.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [planData, setPlanData] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPlanData(null);

    try {
      const response = await fetch('/api/teacher/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          duration,
          targetObjectives: customGoals
        })
      });

      const data = await response.json();
      setPlanData(data);
    } catch (err) {
      console.error('Error generating lesson plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Thiết Kế Kế Hoạch Bài Dạy & Phân Hóa 3 Nhóm Lớp
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tích hợp Năng lực số (GeoGebra/Sheets) • Phân hóa Nhóm A (Cần hỗ trợ), Nhóm B (Đạt chuẩn), Nhóm C (Khá/Giỏi)
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div className="sm:col-span-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Bài học / Chủ đề:
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full text-xs font-medium p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500"
          >
            {GRADE_6_CURRICULUM.flatMap((ch) =>
              ch.lessons.map((ls) => (
                <option key={ls.id} value={`${ls.title} (${ls.code})`}>
                  {ls.code}: {ls.title} (Chương {ch.number})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Thời lượng:
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full text-xs font-medium p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="45 phút (1 tiết)">45 phút (1 tiết)</option>
            <option value="90 phút (2 tiết)">90 phút (2 tiết)</option>
            <option value="Chuyên đề tự học / Ôn tập">Chuyên đề tự học</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang soạn giáo án...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Tạo Kế hoạch bài dạy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Lesson Plan Output */}
      {planData && (
        <div className="space-y-6 pt-2">
          {/* Header & Objectives */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-4">
            <h4 className="text-base font-bold text-indigo-950">
              KẾ HOẠCH BÀI DẠY: {planData.lessonTitle}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">1. Kiến thức:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {planData.objectives?.knowledge?.map((k: string, i: number) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">2. Năng lực toán học:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {planData.objectives?.competencies?.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">3. Năng lực số:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {planData.objectives?.digitalCompetencies?.map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Digital Tools Integration Section */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-purple-600" />
              Tích hợp Phương tiện & Công cụ số trong bài học:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planData.digitalToolsIntegration?.map((dt: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs space-y-1">
                  <div className="font-bold text-purple-900">{dt.tool}</div>
                  <div className="text-slate-700">{dt.activity}</div>
                  <div className="text-purple-800 font-medium text-[11px] pt-1">
                    🎯 Năng lực số hình thành: {dt.digitalSkillOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pedagogical Stages Table */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Tiến trình hoạt động dạy học:
            </h5>
            <div className="space-y-3">
              {planData.pedagogicalSteps?.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                    <span>{step.phase}</span>
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {step.timeEstimate}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-800">Hoạt động Giáo viên: </span>
                      <p className="text-slate-600 mt-1">{step.teacherActivity}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-800">Hoạt động Học sinh: </span>
                      <p className="text-slate-600 mt-1">{step.studentActivity}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-800">Sản phẩm học tập: </span>
                      <p className="text-slate-600 mt-1">{step.learningProduct}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Tier Differentiated Groups Section */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Nhiệm vụ học tập phân hóa theo 3 nhóm đối tượng (Quy tắc Phần 20):
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group A: Support */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>NHÓM A – CẦN HỖ TRỢ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                    Cơ bản
                  </span>
                </div>
                <p className="text-slate-700 italic">{planData.differentiatedGroups?.groupA_Support?.focus}</p>
                <div className="space-y-1 pt-1">
                  <div className="font-bold text-amber-900">Nhiệm vụ cụ thể:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {planData.differentiatedGroups?.groupA_Support?.tasks?.map((t: string, i: number) => (
                      <li key={i}><MathRenderer content={t} /></li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 bg-white/80 rounded-lg text-[11px] text-amber-900 border border-amber-100">
                  💡 Ghi chú hỗ trợ: {planData.differentiatedGroups?.groupA_Support?.scaffoldingNotes}
                </div>
              </div>

              {/* Group B: Standard */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-2">
                <div className="font-bold text-indigo-950 flex items-center justify-between">
                  <span>NHÓM B – ĐẠT CHUẨN</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-200 text-indigo-900 font-bold">
                    Thông hiểu
                  </span>
                </div>
                <p className="text-slate-700 italic">{planData.differentiatedGroups?.groupB_Standard?.focus}</p>
                <div className="space-y-1 pt-1">
                  <div className="font-bold text-indigo-900">Nhiệm vụ cụ thể:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {planData.differentiatedGroups?.groupB_Standard?.tasks?.map((t: string, i: number) => (
                      <li key={i}><MathRenderer content={t} /></li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 bg-white/80 rounded-lg text-[11px] text-indigo-900 border border-indigo-100">
                  🎯 Yêu cầu cần đạt: {planData.differentiatedGroups?.groupB_Standard?.targetAchievement}
                </div>
              </div>

              {/* Group C: Advanced */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>NHÓM C – KHÁ / GIỎI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                    Vận dụng cao
                  </span>
                </div>
                <p className="text-slate-700 italic">{planData.differentiatedGroups?.groupC_Advanced?.focus}</p>
                <div className="space-y-1 pt-1">
                  <div className="font-bold text-emerald-900">Nhiệm vụ cụ thể:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {planData.differentiatedGroups?.groupC_Advanced?.tasks?.map((t: string, i: number) => (
                      <li key={i}><MathRenderer content={t} /></li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 bg-white/80 rounded-lg text-[11px] text-emerald-900 border border-emerald-100">
                  🏆 Câu hỏi thử thách: <MathRenderer content={planData.differentiatedGroups?.groupC_Advanced?.challengeQuestion || ''} />
                </div>
              </div>
            </div>
          </div>

          {/* Self-study tasks for students at home */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Nhiệm vụ tự học & Checklist hoàn thành ở nhà:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="font-semibold text-slate-800 mb-1">Nội dung tự học:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {planData.selfStudyAssignment?.tasks?.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-800 mb-1">Checklist tự đánh giá của học sinh:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {planData.selfStudyAssignment?.checklist?.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
