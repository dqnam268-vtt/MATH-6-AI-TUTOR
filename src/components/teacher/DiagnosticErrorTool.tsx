import React, { useState } from 'react';
import { Search, AlertOctagon, Sparkles, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';

export const DiagnosticErrorTool: React.FC = () => {
  const [topic, setTopic] = useState<string>('Phép trừ số nguyên và quy tắc dấu ngoặc');
  const [sampleExamInput, setSampleExamInput] = useState<string>(
    `Trong bài kiểm tra 15 phút, 18/35 học sinh làm sai câu:
Tính A = 15 - (24 - 30) + (-7)
Các lỗi phổ biến thu được từ bài làm học sinh:
- Học sinh tính 15 - 24 - 30 + (-7) = -9 - 30 - 7 = -46 (quên đổi dấu khi bỏ ngoặc có dấu trừ đằng trước)
- Học sinh tính 24 - 30 = 6 thay vì -6, rồi lấy 15 - 6 - 7 = 2
- Học sinh lúng túng khi gặp liên tiếp dấu trừ và số âm: -(-6)`
  );
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null);

  const handleDiagnose = async () => {
    if (!sampleExamInput.trim()) return;

    setIsDiagnosing(true);
    setDiagnosticResult(null);

    try {
      const response = await fetch('/api/teacher/diagnose-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          studentWorkSamples: sampleExamInput
        })
      });

      const data = await response.json();
      setDiagnosticResult(data);
    } catch (err) {
      console.error('Error diagnosing errors:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            Chẩn Đoán Lỗi Sai Tập Thể & Kế Hoạch Can Thiệp Sư Phạm
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phân tích số liệu bài thi/vở học sinh • Tìm nguồn gốc nhận thức • Kế hoạch bù đắp 3 tiết
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Chủ đề / Đơn vị kiến thức kiểm tra:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mô tả lỗi sai ghi nhận từ bài kiểm tra / vở học sinh:
          </label>
          <textarea
            rows={4}
            value={sampleExamInput}
            onChange={(e) => setSampleExamInput(e.target.value)}
            placeholder="Dán các dạng lỗi học sinh làm sai vào đây..."
            className="w-full p-3 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleDiagnose}
            disabled={isDiagnosing || !sampleExamInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            {isDiagnosing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang phân tích dữ liệu lỗi...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Chẩn đoán nguyên nhân & Đề xuất can thiệp
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnosis Report Output */}
      {diagnosticResult && (
        <div className="space-y-6 pt-2">
          {/* Summary Banner */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              Tổng Quan Chẩn Đoán Sư Phạm
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {diagnosticResult.summary}
            </p>
          </div>

          {/* Identified Error Types */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900">
              Phân loại chi tiết các dạng lỗi & Nguồn gốc nhận thức:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticResult.identifiedErrors?.map((err: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-rose-700">❌ {err.errorCategory}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                      {err.affectedPercentage}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                    <span className="font-bold text-slate-900">Biểu hiện cụ thể: </span>
                    <MathRenderer content={err.specificMistake} />
                  </div>
                  <div className="text-slate-600">
                    <span className="font-bold text-indigo-900">Nguyên nhân gốc rễ: </span>
                    {err.rootCause}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pedagogical Intervention Activities */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Hoạt động sư phạm can thiệp & Khắc phục tại lớp:
            </h5>
            <div className="space-y-3">
              {diagnosticResult.remedialActivities?.map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2"
                >
                  <div className="font-bold text-emerald-950 text-sm flex items-center justify-between">
                    <span>{act.activityName}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {act.targetError}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{act.implementation}</p>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-100 text-emerald-900">
                    <span className="font-bold">Công cụ hỗ trợ trực quan: </span>
                    {act.visualOrDigitalTool}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scaffolded Corrective Exercises */}
          <div className="p-5 rounded-2xl bg-indigo-900 text-white space-y-3 shadow-sm">
            <h5 className="font-bold text-sm text-indigo-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Hệ thống bài tập bù đắp lỗ hổng kiến thức:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {diagnosticResult.correctiveExercises?.map((ex: any, idx: number) => (
                <div key={idx} className="p-3 bg-indigo-800/70 border border-indigo-700 rounded-xl space-y-1.5">
                  <div className="font-bold text-indigo-100">
                    Bài {idx + 1} ({ex.level}):
                  </div>
                  <div className="text-indigo-50 font-serif text-sm">
                    <MathRenderer content={ex.problem} />
                  </div>
                  <div className="text-[11px] text-indigo-300">
                    🎯 Mục đích: {ex.pedagogicalGoal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
