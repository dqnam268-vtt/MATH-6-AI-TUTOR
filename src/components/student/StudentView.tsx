import React, { useState } from 'react';
import {
  MessageSquare,
  BookOpen,
  CheckCircle,
  Timer,
  Copy,
  Calculator,
  Compass,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { SocraticChat } from './SocraticChat';
import { LessonExplorer } from './LessonExplorer';
import { SolutionChecker } from './SolutionChecker';
import { QuickQuiz } from './QuickQuiz';
import { SimilarProblemTool } from './SimilarProblemTool';
import { NumberLineTool } from '../DigitalTools/NumberLineTool';
import { GeometryLabTool } from '../DigitalTools/GeometryLabTool';
import { PrimeFactorTool } from '../DigitalTools/PrimeFactorTool';
import { ProbabilitySimulator } from '../DigitalTools/ProbabilitySimulator';

export const StudentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'chat' | 'lesson' | 'check' | 'quiz' | 'similar' | 'digital_tools'
  >('chat');

  const [digitalToolSubTab, setDigitalToolSubTab] = useState<
    'number_line' | 'geometry' | 'prime' | 'probability'
  >('number_line');

  const primaryNav = [
    { id: 'chat', label: 'Gia sư Socratic', icon: MessageSquare, emoji: '💬', badge: 'Chính' },
    { id: 'lesson', label: 'Học bài mới (SGK)', icon: BookOpen, emoji: '📖' },
    { id: 'similar', label: 'Bài tập tương tự', icon: Copy, emoji: '🏆' },
    { id: 'digital_tools', label: 'Toán thực tế & Công cụ số', icon: Calculator, emoji: '🌎' }
  ];

  const supportNav = [
    { id: 'quiz', label: 'Luyện tập lại (5 Phút)', icon: Timer, emoji: '🔄' },
    { id: 'check', label: 'Kiểm tra bài làm', icon: CheckCircle, emoji: '🔍' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Sleek Left Sidebar */}
      <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Main Activities Group */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">
              Hoạt động chính
            </p>
            <div className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
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

          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">
              Hỗ trợ & Ôn tập
            </p>
            <div className="space-y-1">
              {supportNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Learning Progress Widget */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Tiến độ Chương 3 (Số nguyên)
            </span>
            <span className="text-xs font-extrabold text-blue-600">80%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-4/5 rounded-full transition-all duration-500"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Đã hoàn thành 8/10 bài học & 4 thử thách
          </p>
        </div>
      </aside>

      {/* Center / Main Content Area */}
      <section className="lg:col-span-9 space-y-4">
        {/* Main Tab Views */}
        {activeTab === 'chat' && <SocraticChat />}
        {activeTab === 'lesson' && <LessonExplorer />}
        {activeTab === 'check' && <SolutionChecker />}
        {activeTab === 'quiz' && <QuickQuiz />}
        {activeTab === 'similar' && <SimilarProblemTool />}

        {/* Digital Tools Lab */}
        {activeTab === 'digital_tools' && (
          <div className="space-y-4">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
              {[
                { id: 'number_line', label: '📏 Trục Số Nguyên Trực Quan' },
                { id: 'geometry', label: '📐 Hình Học & Tính Đối Xứng' },
                { id: 'prime', label: '🧮 Phân Tích Số Nguyên Tố & ƯCLN/BCNN' },
                { id: 'probability', label: '🎲 Mô Phỏng Xác Suất Thực Nghiệm' }
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
