import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Search,
  Calculator,
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';
import { CurriculumBrowser } from './CurriculumBrowser';
import { LessonPlanGenerator } from './LessonPlanGenerator';
import { DiagnosticErrorTool } from './DiagnosticErrorTool';
import { NumberLineTool } from '../DigitalTools/NumberLineTool';
import { GeometryLabTool } from '../DigitalTools/GeometryLabTool';
import { PrimeFactorTool } from '../DigitalTools/PrimeFactorTool';
import { ProbabilitySimulator } from '../DigitalTools/ProbabilitySimulator';

export const TeacherView: React.FC = () => {
  const [activeTeacherTab, setActiveTeacherTab] = useState<
    'lesson_plan' | 'diagnostic' | 'curriculum' | 'teaching_tools'
  >('lesson_plan');

  const [digitalToolSubTab, setDigitalToolSubTab] = useState<
    'number_line' | 'geometry' | 'prime' | 'probability'
  >('number_line');

  const teacherNavItems = [
    {
      id: 'lesson_plan',
      label: 'Soạn Giáo án & Phân hóa',
      icon: FileText,
      emoji: '📝',
      badge: 'Nhóm A/B/C'
    },
    {
      id: 'diagnostic',
      label: 'Chẩn đoán lỗi tập thể',
      icon: Search,
      emoji: '🔍',
      badge: 'Can thiệp'
    },
    {
      id: 'curriculum',
      label: 'Tra cứu chuẩn KNTT',
      icon: BookOpen,
      emoji: '📚'
    },
    {
      id: 'teaching_tools',
      label: 'Bảng tương tác giảng dạy',
      icon: Calculator,
      emoji: '💻',
      badge: 'Công cụ số'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Sleek Teacher Left Sidebar */}
      <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">
              Hoạt động sư phạm
            </p>
            <div className="space-y-1">
              {teacherNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTeacherTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTeacherTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Teacher Professional Framework Info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Khung Năng Lực Số Toán 6
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Hỗ trợ giáo viên xây dựng tiến trình dạy học 5 bước theo Thông tư Bộ GD&ĐT kết hợp phân hóa sư phạm.
          </p>
        </div>
      </aside>

      {/* Main Content Stage */}
      <section className="lg:col-span-9 space-y-4">
        {activeTeacherTab === 'lesson_plan' && <LessonPlanGenerator />}
        {activeTeacherTab === 'diagnostic' && <DiagnosticErrorTool />}
        {activeTeacherTab === 'curriculum' && <CurriculumBrowser />}

        {/* Teaching Tools View */}
        {activeTeacherTab === 'teaching_tools' && (
          <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
              {[
                { id: 'number_line', label: '📏 Trục Số Nguyên Trực Quan' },
                { id: 'geometry', label: '📐 Hình Học & Đối Xứng' },
                { id: 'prime', label: '🧮 Thừa Số Nguyên Tố & ƯCLN/BCNN' },
                { id: 'probability', label: '🎲 Mô Phỏng Xác Suất' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setDigitalToolSubTab(sub.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    digitalToolSubTab === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {digitalToolSubTab === 'number_line' && <NumberLineTool />}
            {digitalToolSubTab === 'geometry' && <GeometryLabTool />}
            {digitalToolSubTab === 'prime' && <PrimeFactorTool />}
            {digitalToolSubTab === 'probability' && <ProbabilitySimulator />}
          </div>
        )}
      </section>
    </div>
  );
};
