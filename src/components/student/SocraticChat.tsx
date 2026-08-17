import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Check,
  X,
  Brain,
  Award,
  Activity
} from 'lucide-react';
import { MathRenderer } from '../MathRenderer';
import { ChatMessage } from '../../types';
import { GRADE_6_CURRICULUM } from '../../data/curriculum';

export const SocraticChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Xin chào em! Thầy là **MATH 6 AI TUTOR** – Trợ lý học Toán 6 (Bộ sách Kết nối tri thức với cuộc sống).

Thầy ở đây để giúp em **tự suy nghĩ và tìm ra cách giải**, không chỉ đơn thuần là đưa ra đáp án.

Em có thể:
1. Gửi một bài toán em đang vướng mắc (nhập chữ hoặc đính kèm ảnh).
2. Yêu cầu gợi ý theo 4 cấp độ (từ gợi ý nhẹ đến hướng dẫn từng bước).
3. Hỏi về bất kỳ khái niệm nào trong chương trình Toán 6!

*Em đã thử làm bài toán đến đâu rồi?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: {
        hintLevel: 1
      }
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Số nguyên (Tập hợp ℤ)');
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim() || 'Em gửi hình ảnh bài toán này, nhờ thầy hướng dẫn.',
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    const curImg = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          role: 'student',
          hintLevel,
          currentTopic: selectedTopic,
          imageBase64: curImg
        })
      });

      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Thầy đã nhận được bài. Em hãy chia sẻ thêm suy nghĩ của em nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meta: {
          hintLevel
        }
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Thầy đang gặp chút sự cố kết nối. Em vui lòng bấm gửi lại câu hỏi nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Dấu ngoặc tròn ( ) tính trước ạ',
    'Thầy ơi, bài này dùng quy tắc chuyển vế đúng không ạ?',
    'Em chưa biết bắt đầu từ đâu, thầy gợi ý giúp em nhé'
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      {/* Main Chat Stage */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[760px] overflow-hidden">
        {/* Sleek Breadcrumb & Topic Selector Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-mono font-bold text-slate-600">
              CHỦ ĐỀ
            </div>
            <span className="text-slate-400">/</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer font-serif italic"
            >
              {GRADE_6_CURRICULUM.map((ch) => (
                <option key={ch.id} value={ch.title}>
                  Chương {ch.number}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* 4 Hint Levels Stepper */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 px-2">Cấp gợi ý:</span>
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setHintLevel(lvl as 1 | 2 | 3 | 4)}
                title={
                  lvl === 1
                    ? 'Cấp 1: Gợi ý nhẹ (chỉ đặt câu hỏi định hướng)'
                    : lvl === 2
                    ? 'Cấp 2: Nhắc lại kiến thức & công thức SGK'
                    : lvl === 3
                    ? 'Cấp 3: Hướng dẫn tư duy từng bước'
                    : 'Cấp 4: Lời giải chi tiết mẫu mực'
                }
                className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                  hintLevel === lvl
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                C{lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3.5 ${
                  isUser ? 'flex-row' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {!isUser ? (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-xs">
                    Σ
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex-shrink-0 flex items-center justify-center text-sm font-semibold">
                    👤
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`flex-1 ${
                    isUser
                      ? 'bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm leading-relaxed border border-slate-200 shadow-2xs max-w-2xl'
                      : 'bg-white border-2 border-blue-100 rounded-2xl rounded-tl-none p-5 shadow-xs max-w-2xl'
                  }`}
                >
                  {/* Topic / Hint badges for AI */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                        📚 Toán 6 Kết Nối Tri Thức
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                        💡 Gợi ý Cấp {msg.meta?.hintLevel || hintLevel}
                      </span>
                    </div>
                  )}

                  {/* Attached Image if any */}
                  {msg.image && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 bg-black/5 max-h-56">
                      <img
                        src={msg.image}
                        alt="Ảnh bài toán"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-slate-800 text-sm leading-relaxed">
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                    ) : (
                      <MathRenderer content={msg.text} />
                    )}
                  </div>

                  <div className="text-[10px] mt-3 text-slate-400 flex items-center justify-between">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <span className="text-blue-600 font-semibold">Socratic Method</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-sm font-bold animate-pulse">
                Σ
              </div>
              <div className="bg-white border-2 border-blue-100 rounded-2xl rounded-tl-none p-4 shadow-xs text-xs text-slate-600 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200"></span>
                <span>Thầy đang phân tích và chuẩn bị câu hỏi gợi mở cho em...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips Prompts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1 flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Gợi ý trả lời:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-all whitespace-nowrap"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Sleek Input Form */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200">
          {selectedImage && (
            <div className="mb-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedImage}
                  alt="Selected preview"
                  className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium text-slate-700">Đã đính kèm ảnh bài toán</span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-slate-400 hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Đính kèm ảnh bài tập trong SGK / vở bài tập"
              className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors flex-shrink-0"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập câu trả lời hoặc câu hỏi của em (VD: Tính (-15) + 38, thứ tự thực hiện phép tính...)"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>GỬI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sleek Right Analytics Panel */}
      <aside className="xl:col-span-4 space-y-4">
        {/* Phân tích năng lực Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Phân tích năng lực</span>
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Mức độ</p>
              <p className="text-base font-extrabold text-emerald-900 mt-0.5">THÔNG HIỂU</p>
            </div>
            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100">
              <p className="text-[10px] text-blue-700 font-bold uppercase">Tư duy độc lập</p>
              <p className="text-base font-extrabold text-blue-900 mt-0.5">⭐⭐⭐</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Tư duy lập luận toán học</span>
                <span className="text-slate-900 font-bold">75%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[75%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Kỹ năng tính toán chuẩn xác</span>
                <span className="text-slate-900 font-bold">85%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[85%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Vận dụng bối cảnh thực tế</span>
                <span className="text-slate-900 font-bold">70%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[70%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ghi chú Socratic Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Nhật ký Sư phạm AI</span>
            <Brain className="w-3.5 h-3.5 text-blue-600" />
          </h2>

          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Đang kích hoạt kiến thức cũ về thứ tự ưu tiên các dấu ngoặc và phép tính.
              </p>
            </div>

            <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Sẵn sàng gợi ý Cấp 2 nếu học sinh gặp khó khăn trong việc biến đổi số âm.
              </p>
            </div>

            <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Khuyến khích học sinh tự kiểm tra lại từng bước tính sau khi có kết quả.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 border border-slate-200 font-mono">
              AI SOCRATIC ENGINE • LEVEL {hintLevel}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
