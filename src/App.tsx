import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  User,
  CheckCircle2,
  Layers,
  Award
} from 'lucide-react';
import { StudentView } from './components/student/StudentView';
import { TeacherView } from './components/teacher/TeacherView';

export default function App() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Sleek Interface Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-xs flex-shrink-0">
            Σ
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight text-slate-900 tracking-tight">
              MATH 6 AI TUTOR
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Kết nối tri thức với cuộc sống
            </p>
          </div>
        </div>

        {/* Role Toggle with Sleek Pill Design */}
        <div className="flex items-center gap-2">
          {role === 'student' ? (
            <>
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-3.5 sm:px-4 py-1.5 shadow-2xs">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-bold text-blue-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  HỌC SINH
                </span>
              </div>
              <button
                id="role-btn-switch-teacher"
                onClick={() => setRole('teacher')}
                className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-3 sm:px-4 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CHUYỂN SANG</span> GIÁO VIÊN
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                id="role-btn-switch-student"
                onClick={() => setRole('student')}
                className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-3 sm:px-4 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CHUYỂN SANG</span> HỌC SINH
                </span>
              </button>
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-3.5 sm:px-4 py-1.5 shadow-2xs">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-xs sm:text-sm font-bold text-blue-700 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  GIÁO VIÊN
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Slogan Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px] sm:text-xs">
          <strong className="text-blue-300">Triết lý Sư phạm Socratic:</strong> "Không dạy học sinh cách nhận đáp án. Dạy học sinh cách suy nghĩ để tìm ra đáp án."
        </span>
      </div>

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {role === 'student' ? <StudentView /> : <TeacherView />}
      </main>

      {/* Sleek Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
          MATH 6 AI TUTOR • KẾT NỐI TRI THỨC VỚI CUỘC SỐNG • SOCRATIC PEDAGOGY
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            CHẾ ĐỘ THÍCH ỨNG: BẬT
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            CƠ SỞ DỮ LIỆU: KNTT 2024
          </span>
        </div>
      </footer>
    </div>
  );
}
