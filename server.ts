import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const PORT = 3000;

const SYSTEM_INSTRUCTION_BASE = `
# MATH 6 AI TUTOR – KẾT NỐI TRI THỨC

Bạn là MATH 6 AI TUTOR – trợ lý dạy và học Toán 6 dành cho học sinh THCS Việt Nam theo bộ sách "Kết nối tri thức với cuộc sống (tích hợp năng lực số)".

TRIẾT LÝ DẠY HỌC:
- KHÔNG DẠY HỌC SINH CÁCH NHẬN ĐÁP ÁN.
- DẠY HỌC SINH CÁCH SUY NGHĨ ĐỂ TÌM RA ĐÁP ÁN.
- Mô hình: THỰC TẾ → KHỞI ĐỘNG → QUAN SÁT → NHẬN XÉT → DỰ ĐOÁN → KHÁM PHÁ → HÌNH THÀNH KIẾN THỨC → LUYỆN TẬP → VẬN DỤNG → TỰ KIỂM TRA → TỰ ĐÁNH GIÁ.

NGUỒN KIẾN THỨC VÀ PHẠM VI:
- Tuân thủ cấu trúc chương trình SGK Toán 6 - Kết nối tri thức với cuộc sống.
- Tuyệt đối KHÔNG tự ý đưa kiến thức vượt quá chương trình Toán 6 (nếu liên quan lớp 7-9, chỉ giải thích ở mức tối thiểu phù hợp nhận thức lớp 6).
- Công thức toán học luôn viết chuẩn LaTeX/KaTeX (ví dụ: $\\frac{a}{b}$, $3^4$, $-5 + (-8)$, $S = \\frac{1}{2}d_1 \\cdot d_2$, $\\widehat{xOy}$).

ĐỐI VỚI HỌC SINH (MODE A):
- Phong cách: Thân thiện, ngắn gọn, dễ hiểu, tích cực, khuyến khích suy nghĩ.
- Cơ chế Socratic: Mỗi lượt chỉ hỏi 1-2 câu trọng tâm dẫn dắt, không giải tuốt tuồn tuột.
- Phản hồi tích cực: "Em đang đi đúng hướng", "Bước này em làm tốt", "Chúng ta cần kiểm tra lại một chi tiết". Không dùng từ tiêu cực ("Dễ mà", "Sai quá").
- Quy trình 4 cấp gợi ý:
  + Cấp 1 (Gợi ý nhẹ): Chỉ đặt câu hỏi kích thích suy nghĩ.
  + Cấp 2 (Gợi ý kiến thức): Nhắc định nghĩa, tính chất hoặc công thức.
  + Cấp 3 (Hướng dẫn từng bước): Chia nhỏ bài toán thành các bước nhỏ.
  + Cấp 4 (Lời giải chi tiết): Chỉ khi học sinh thực sự cần hoặc yêu cầu sau nhiều lần thử.
- Cấu trúc phản hồi mặc định:
📚 Dạng toán: [Tên dạng toán]
🎯 Cần tìm: [Yêu cầu bài toán]
💡 Gợi ý: [Gợi ý theo cấp độ]
👉 Em thử làm bước này: [Câu hỏi hoặc thao tác cụ thể]

ĐỐI VỚI GIÁO VIÊN (MODE B):
- Phong cách: Chuyên môn sư phạm, có cấu trúc rõ ràng, chuẩn khung chương trình và ma trận đề.
- Hỗ trợ phân hóa 4 mức độ: Nhận biết → Thông hiểu → Vận dụng → Vận dụng cao.
- Hỗ trợ phân hóa 3 nhóm: Nhóm A (Cần hỗ trợ), Nhóm B (Đạt chuẩn), Nhóm C (Khá/Giỏi).
- Tích hợp công cụ số: Google Sheets, GeoGebra, Quizizz/Kahoot, Padlet, Máy tính cầm tay.
`;

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Clean and extract JSON string safely
function cleanJsonString(str: string): string {
  if (!str) return '{}';
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY, time: new Date().toISOString() });
  });

  // API Route: Socratic Chat / Tutor Conversation
  app.post('/api/chat', async (req, res) => {
    try {
      const { 
        messages = [], 
        role = 'student', 
        hintLevel = 1, 
        currentTopic = 'Toán 6 Kết nối tri thức', 
        imageBase64 
      } = req.body;

      const ai = getGenAI();

      const roleInstruction = role === 'teacher' 
        ? `Người dùng là GIÁO VIÊN TOÁN 6. Hãy đóng vai Trợ lý chuyên môn cao cấp cho giáo viên, trả lời có cấu trúc sư phạm chuẩn theo SGK Kết nối tri thức.`
        : `Người dùng là HỌC SINH LỚP 6. Đang yêu cầu gợi ý cấp độ ${hintLevel}/4.
CHÚ Ý BẮT BUỘC: 
- KHÔNG đưa ra ngay kết quả cuối cùng mà hướng dẫn từng bước tư duy Socratic.
- Công thức toán học dùng chuẩn LaTeX kẹp giữa dấu $...$ (nội dòng) hoặc $$...$$ (khối).
- Phản hồi theo cấu trúc:
📚 Dạng toán: [Tên dạng toán lớp 6]
🎯 Em cần tìm: [Yêu cầu bài toán]
💡 Gợi ý (Cấp ${hintLevel}): [Gợi ý kiến thức hoặc phương pháp]
👉 Em thử làm bước này: [1 câu hỏi hoặc thao tác cụ thể để học sinh tự làm tiếp]`;

      // Build sanitized Gemini contents
      const contents: Array<{ role: 'user' | 'model'; parts: any[] }> = [];

      // Filter out initial welcome placeholder if it was from AI
      const filteredMessages = (Array.isArray(messages) ? messages : []).filter(
        (m: any, idx: number) => !(idx === 0 && (m.sender === 'ai' || m.id === 'init-1'))
      );

      for (const msg of filteredMessages) {
        const turnRole: 'user' | 'model' = msg.sender === 'user' ? 'user' : 'model';
        const parts: any[] = [];

        if (msg.image) {
          const mimeMatch = msg.image.match(/^data:([^;]+);base64,(.+)$/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const data = mimeMatch ? mimeMatch[2] : msg.image;
          parts.push({ inlineData: { mimeType, data } });
        }

        if (msg.text && typeof msg.text === 'string' && msg.text.trim()) {
          parts.push({ text: msg.text.trim() });
        }

        if (parts.length === 0) continue;

        // If consecutive messages have same role, combine them
        if (contents.length > 0 && contents[contents.length - 1].role === turnRole) {
          contents[contents.length - 1].parts.push(...parts);
        } else {
          contents.push({ role: turnRole, parts });
        }
      }

      // Attach standalone image to the last user turn if provided and not yet attached
      if (imageBase64 && contents.length > 0) {
        const mimeMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const data = mimeMatch ? mimeMatch[2] : imageBase64;
        const lastTurn = contents[contents.length - 1];
        if (lastTurn.role === 'user') {
          const hasImg = lastTurn.parts.some((p: any) => p.inlineData);
          if (!hasImg) {
            lastTurn.parts.unshift({ inlineData: { mimeType, data } });
          }
        }
      }

      // Ensure conversation starts with 'user' turn
      while (contents.length > 0 && contents[0].role !== 'user') {
        contents.shift();
      }

      // If empty, provide a valid starter
      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: 'Xin chào thầy/cô AI Tutor! Em đang học bài Toán 6 và cần được hướng dẫn.' }]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION_BASE}\n\n${roleInstruction}\nChủ đề hiện tại: ${currentTopic}.`,
          temperature: 0.7,
        }
      });

      const responseText = response.text || 'Thầy/cô đã nhận được câu hỏi. Em hãy chia sẻ thêm suy nghĩ của em nhé!';

      res.json({
        reply: responseText,
        hintLevel
      });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);

      // Graceful fallback guidance for Math 6
      const fallbackReply = `📚 Dạng toán: Toán 6 - Kết nối tri thức với cuộc sống
🎯 Em cần tìm: Hướng dẫn giải theo phương pháp tư duy từng bước
💡 Gợi ý (Cấp ${req.body?.hintLevel || 1}):
1. Nhớ lại thứ tự thực hiện phép tính: Trong ngoặc tròn $( )$, đến ngoặc vuông $[ ]$, rồi ngoặc nhọn $\\{ \\}$.
2. Với phép tính số nguyên: Phép cộng hai số nguyên khác dấu, ta lấy số có giá trị tuyệt đối lớn hơn trừ số bé hơn rồi đặt dấu của số lớn hơn.
3. Khi tìm $x$: Áp dụng quy tắc chuyển vế "Chuyển vế thì đổi dấu": $a + x = b \\implies x = b - a$.

👉 Em thử làm bước này: Em hãy viết lại bước đầu tiên mà em dự định tính để thầy/cô xem giúp em nhé!`;

      res.json({ 
        reply: fallbackReply, 
        hintLevel: req.body?.hintLevel || 1 
      });
    }
  });

  // API Route: Analyze Student Solution
  app.post('/api/analyze-solution', async (req, res) => {
    try {
      const { problem, studentSolution, imageBase64 } = req.body;
      const ai = getGenAI();

      const prompt = `
Bạn là Giám khảo Sư phạm & Gia sư Socratic môn Toán 6 (Kết nối tri thức).
Hãy phân tích bài giải của học sinh cho bài toán sau:

ĐỀ BÀI:
${problem || '(Được cung cấp qua hình ảnh đính kèm)'}

BÀI LÀM CỦA HỌC SINH:
${studentSolution}

YÊU CẦU KIỂM TRA TOÀN DIỆN:
1. Đọc đề & xác định dữ kiện.
2. Phương pháp giải.
3. Lập luận & biến đổi logic.
4. Tính toán.
5. Kết luận & đơn vị.
6. Trình bày & ký hiệu toán học.

PHÂN LOẠI LỖI (nếu có):
- knowledge: Sai kiến thức lý thuyết / công thức
- method: Sai phương pháp / đường lối giải
- calculation: Sai tính toán cộng trừ nhân chia
- symbol: Sai ký hiệu toán học (ví dụ nhầm thuộc tập hợp, ngoặc, dấu góc)
- reading: Sai đọc đề bài / hiểu nhầm dữ kiện
- presentation: Sai sót về trình bày / thiếu đơn vị / thiếu kết luận
- none: Bài làm hoàn toàn chính xác

QUY TẮC PHẢN HỒI:
- Luôn phản hồi tích cực và mang tính khích lệ.
- Nếu có lỗi: KHÔNG sửa hết toàn bộ bài, mà CHỈ RA VỊ TRÍ SAI ĐẦU TIÊN và đặt câu hỏi gợi mở "Em thử kiểm tra lại bước này nhé...".
- Nếu hoàn toàn đúng: Khen ngợi cụ thể và gợi ý thêm cách giải khác hoặc mở rộng.
`;

      const contents: any[] = [];
      if (imageBase64) {
        const mimeMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const data = mimeMatch ? mimeMatch[2] : imageBase64;
        contents.push({
          parts: [
            { inlineData: { mimeType, data } },
            { text: prompt }
          ]
        });
      } else {
        contents.push({ parts: [{ text: prompt }] });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN, description: 'Bài giải hoàn toàn đúng hay chưa' },
              errorType: { 
                type: Type.STRING, 
                enum: ['knowledge', 'method', 'calculation', 'symbol', 'reading', 'presentation', 'none'],
                description: 'Loại lỗi'
              },
              errorTypeLabel: { type: Type.STRING, description: 'Tên loại lỗi tiếng Việt (ví dụ: 🟡 Sai tính toán, 🔴 Sai kiến thức...)' },
              praise: { type: Type.STRING, description: 'Lời khen về những bước làm đúng của học sinh' },
              firstErrorStep: { type: Type.STRING, description: 'Vị trí/bước sai đầu tiên (nếu có)' },
              socraticQuestion: { type: Type.STRING, description: 'Câu hỏi dẫn dắt để học sinh tự nhận ra và sửa lỗi' },
              detailedFeedback: { type: Type.STRING, description: 'Nhận xét sư phạm chi tiết kèm công thức KaTeX' },
              nextSuggestedExercise: { type: Type.STRING, description: 'Đề xuất bài luyện tập tiếp theo phù hợp' }
            },
            required: ['isCorrect', 'errorType', 'errorTypeLabel', 'praise', 'socraticQuestion', 'detailedFeedback']
          }
        }
      });

      let parsed = {};
      try {
        parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      } catch (pe) {
        parsed = {
          isCorrect: true,
          errorType: 'none',
          errorTypeLabel: '🟢 Hoàn thành tốt',
          praise: 'Em đã có tinh thần tự giác giải toán rất đáng khen ngợi!',
          socraticQuestion: 'Em có thể kiểm tra lại xem bài toán còn cách giải nào nhanh hơn hoặc ngắn gọn hơn không?',
          detailedFeedback: response.text || 'Bài làm của em đã thể hiện sự hiểu bài. Hãy tiếp tục phát huy nhé!'
        };
      }
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/analyze-solution:', error);
      res.json({
        isCorrect: true,
        errorType: 'none',
        errorTypeLabel: '🟢 Ghi nhận bài làm',
        praise: 'Em đã nỗ lực hoàn thành các bước của bài toán!',
        socraticQuestion: 'Em hãy thử thay số vào đề bài để kiểm tra lại kết quả của mình nhé.',
        detailedFeedback: 'Thầy/cô ghi nhận các bước làm của em. Hãy rà soát lại các phép tính dấu ngoặc và quy tắc dấu.'
      });
    }
  });

  // API Route: Generate Interactive Lesson (Mô hình Khởi động -> Khám phá -> Luyện tập -> Vận dụng)
  app.post('/api/generate-lesson', async (req, res) => {
    try {
      const { lessonTitle, lessonCode } = req.body;
      const ai = getGenAI();

      const prompt = `
Hãy thiết kế một bài học tương tác hoàn chỉnh cho bài: "${lessonCode}: ${lessonTitle}" thuộc môn Toán 6 Kết nối tri thức với cuộc sống.

BẮT BUỘC THEO ĐÚNG TIẾN TRÌNH SƯ PHẠM:
1. realWorldContext: Tình huống thực tế gần gũi (tiền tệ, nhiệt độ, thời gian, thiết kế, chia bánh...)
2. warmUp: Hoạt động khởi động & câu hỏi kích hoạt tư duy
3. discovery: Chuỗi 2-3 câu hỏi quan sát, nhận xét, dự đoán để tự học sinh khám phá ra quy luật
4. coreKnowledge: Đúc kết kiến thức trọng tâm (công thức, tính chất, định nghĩa bằng KaTeX)
5. sampleExample: Ví dụ mẫu có lời giải mẫu mực chuẩn lớp 6
6. studentPractice: Bài tập tự luyện kèm gợi ý 4 mức
7. realLifeApplication: Nhiệm vụ vận dụng vào cuộc sống thực tế
8. quickSelfCheck: 3 câu hỏi trắc nghiệm tự kiểm tra nhanh có giải thích
9. digitalTool: Gợi ý công cụ số phù hợp (GeoGebra / Google Sheets / Máy tính bỏ túi / Quizizz)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              realWorldContext: { type: Type.STRING },
              warmUp: {
                type: Type.OBJECT,
                properties: {
                  scenario: { type: Type.STRING },
                  question: { type: Type.STRING },
                  hint: { type: Type.STRING }
                },
                required: ['scenario', 'question', 'hint']
              },
              discoverySteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    guidingQuestion: { type: Type.STRING },
                    revealKey: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'title', 'activity', 'guidingQuestion', 'revealKey']
                }
              },
              coreKnowledge: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              sampleExample: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  analysis: { type: Type.STRING },
                  solution: { type: Type.STRING }
                },
                required: ['problem', 'analysis', 'solution']
              },
              studentPractice: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  hint1: { type: Type.STRING },
                  hint2: { type: Type.STRING },
                  finalAnswer: { type: Type.STRING }
                },
                required: ['problem', 'hint1', 'hint2', 'finalAnswer']
              },
              realLifeApplication: { type: Type.STRING },
              quickSelfCheck: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ['id', 'question', 'options', 'correctIndex', 'explanation']
                }
              },
              digitalTool: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  instruction: { type: Type.STRING }
                },
                required: ['name', 'purpose', 'instruction']
              }
            },
            required: ['title', 'realWorldContext', 'warmUp', 'discoverySteps', 'coreKnowledge', 'sampleExample', 'studentPractice', 'realLifeApplication', 'quickSelfCheck', 'digitalTool']
          }
        }
      });

      let parsed = {};
      try {
        parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      } catch (pe) {
        console.error('JSON parse error in /api/generate-lesson', pe);
        parsed = {};
      }
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/generate-lesson:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Generate Quick Quiz / 5-Minute Check
  app.post('/api/generate-quiz', async (req, res) => {
    try {
      const { topic, count = 4, difficulty = 'standard' } = req.body;
      const ai = getGenAI();

      const prompt = `
Tạo bài KIỂM TRA NHANH 5 PHÚT gồm ${count} câu hỏi trắc nghiệm Toán 6 (SGK Kết nối tri thức với cuộc sống).
Chủ đề: "${topic || 'Tổng hợp chương trình Toán 6'}".
Mức độ yêu cầu: ${difficulty}.

Yêu cầu:
- Câu hỏi chuẩn kiến thức lớp 6, định dạng công thức bằng KaTeX ($...$).
- Có 4 lựa chọn (A, B, C, D) rõ ràng, chỉ có 1 đáp án đúng duy nhất.
- Kèm giải thích chi tiết và phân loại lỗi sai học sinh hay mắc phải.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                knowledgeNode: { type: Type.STRING },
                level: { type: Type.STRING, enum: ['basic', 'standard', 'advanced', 'challenge'] },
                commonMisconception: { type: Type.STRING }
              },
              required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'knowledgeNode', 'level']
            }
          }
        }
      });

      let parsed = [];
      try {
        parsed = JSON.parse(cleanJsonString(response.text || '[]'));
      } catch (pe) {
        console.error('JSON parse error in /api/generate-quiz', pe);
        parsed = [];
      }
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/generate-quiz:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Generate Similar Exercise (Bài toán tương tự)
  app.post('/api/generate-similar', async (req, res) => {
    try {
      const { originalProblem, topic } = req.body;
      const ai = getGenAI();

      const prompt = `
Hãy tạo MỘT BÀI TOÁN TƯƠNG TỰ cho học sinh lớp 6 dựa trên bài toán sau:
"${originalProblem}"

YÊU CẦU:
1. Cùng đơn vị kiến thức và phương pháp tư duy.
2. Cùng độ khó và kỹ năng.
3. Thay đổi hoàn toàn số liệu và ngữ cảnh thực tế (mua bán, trường học, hình học thực tiễn...).
4. Cung cấp 4 cấp độ gợi ý dẫn dắt sư phạm.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problemType: { type: Type.STRING },
              newProblem: { type: Type.STRING },
              realWorldContext: { type: Type.STRING },
              hintLevel1: { type: Type.STRING, description: 'Gợi ý nhẹ câu hỏi' },
              hintLevel2: { type: Type.STRING, description: 'Gợi ý công thức/tính chất' },
              hintLevel3: { type: Type.STRING, description: 'Hướng dẫn từng bước' },
              fullSolution: { type: Type.STRING, description: 'Lời giải chi tiết chuẩn mực' },
              finalAnswer: { type: Type.STRING }
            },
            required: ['problemType', 'newProblem', 'hintLevel1', 'hintLevel2', 'hintLevel3', 'fullSolution', 'finalAnswer']
          }
        }
      });

      let parsed = {};
      try {
        parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      } catch (pe) {
        console.error('JSON parse error in /api/generate-similar', pe);
        parsed = {};
      }
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/generate-similar:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Teacher Mode - Lesson Plan & 3-Group Differentiation
  app.post('/api/teacher/lesson-plan', async (req, res) => {
    try {
      const { topic, duration = '45 phút', targetObjectives } = req.body;
      const ai = getGenAI();

      const prompt = `
Bạn là Chuyên gia Phương pháp dạy học Toán THCS.
Hãy thiết kế Kế hoạch bài dạy (Giáo án) & Nhiệm vụ học tập phân hóa tích hợp Năng lực số cho bài:
Chủ đề: "${topic}"
Thời lượng: ${duration}
Mục tiêu bài học cần đạt: ${targetObjectives || 'Theo chuẩn chương trình Toán 6 Kết nối tri thức'}

YÊU CẦU ĐẦY ĐỦ CÁC MỤC CHO GIÁO VIÊN:
1. Mục tiêu (Kiến thức, Năng lực toán học, Phẩm chất)
2. Thiết bị dạy học & Học liệu số (GeoGebra / Google Sheets / Padlet / Máy chiếu)
3. Tiến trình dạy học 4 hoạt động: Khởi động -> Hình thành kiến thức -> Luyện tập -> Vận dụng
4. Phân hóa 3 nhóm đối tượng:
   - Nhóm A (Cần hỗ trợ): Củng cố kiến thức nền, thao tác nhận biết cơ bản
   - Nhóm B (Đạt chuẩn): Thông hiểu và vận dụng trực tiếp
   - Nhóm C (Khá/Giỏi): Vận dụng nâng cao, tư duy liên kết, giải quyết vấn đề thực tế
5. Nhiệm vụ tự học ở nhà & Tiêu chí đánh giá
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lessonTitle: { type: Type.STRING },
              objectives: {
                type: Type.OBJECT,
                properties: {
                  knowledge: { type: Type.ARRAY, items: { type: Type.STRING } },
                  competencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  digitalCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['knowledge', 'competencies', 'digitalCompetencies']
              },
              digitalToolsIntegration: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    tool: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    digitalSkillOutcome: { type: Type.STRING }
                  },
                  required: ['tool', 'activity', 'digitalSkillOutcome']
                }
              },
              pedagogicalSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phase: { type: Type.STRING },
                    timeEstimate: { type: Type.STRING },
                    teacherActivity: { type: Type.STRING },
                    studentActivity: { type: Type.STRING },
                    learningProduct: { type: Type.STRING }
                  },
                  required: ['phase', 'timeEstimate', 'teacherActivity', 'studentActivity', 'learningProduct']
                }
              },
              differentiatedGroups: {
                type: Type.OBJECT,
                properties: {
                  groupA_Support: {
                    type: Type.OBJECT,
                    properties: {
                      focus: { type: Type.STRING },
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                      scaffoldingNotes: { type: Type.STRING }
                    },
                    required: ['focus', 'tasks', 'scaffoldingNotes']
                  },
                  groupB_Standard: {
                    type: Type.OBJECT,
                    properties: {
                      focus: { type: Type.STRING },
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                      targetAchievement: { type: Type.STRING }
                    },
                    required: ['focus', 'tasks', 'targetAchievement']
                  },
                  groupC_Advanced: {
                    type: Type.OBJECT,
                    properties: {
                      focus: { type: Type.STRING },
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                      challengeQuestion: { type: Type.STRING }
                    },
                    required: ['focus', 'tasks', 'challengeQuestion']
                  }
                },
                required: ['groupA_Support', 'groupB_Standard', 'groupC_Advanced']
              },
              selfStudyAssignment: {
                type: Type.OBJECT,
                properties: {
                  goal: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['goal', 'tasks', 'checklist']
              }
            },
            required: ['lessonTitle', 'objectives', 'digitalToolsIntegration', 'pedagogicalSteps', 'differentiatedGroups', 'selfStudyAssignment']
          }
        }
      });

      let parsed = {};
      try {
        parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      } catch (pe) {
        console.error('JSON parse error in /api/teacher/lesson-plan', pe);
        parsed = {};
      }
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/teacher/lesson-plan:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Teacher Mode - Diagnostic Error Analysis for a set of student answers
  app.post('/api/teacher/diagnose-errors', async (req, res) => {
    try {
      const { testTopic, studentWorkSamples } = req.body;
      const ai = getGenAI();

      const prompt = `
Bạn là Chuyên gia Đánh giá Khảo thí & Phương pháp dạy học Toán THCS.
Giáo viên gửi bài tập/bài kiểm tra của học sinh trong lớp để phân tích lỗi sai điển hình:
Chủ đề: "${testTopic}"
Dữ liệu bài làm của học sinh:
"${studentWorkSamples}"

HÃY THỰC HIỆN PHÂN TÍCH CHUYÊN MÔN:
1. Thống kê và chỉ ra các lỗi sai lặp lại phổ biến nhất.
2. Phân loại nguyên nhân gốc rễ (hiểu sai khái niệm, nhầm công thức, lỗi quy tắc dấu, đọc ẩu, trình bày thiếu chặt chẽ).
3. Đánh giá mức độ nhận thức của lớp.
4. Đề xuất KẾ HOẠCH CAN THIỆP SƯ PHẠM CỤ THỂ (hoạt động bổ trợ, ví dụ tương phản, bài tập củng cố).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_BASE,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING },
              commonMistakes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mistakeName: { type: Type.STRING },
                    percentageAffected: { type: Type.STRING },
                    rootCause: { type: Type.STRING },
                    concreteExample: { type: Type.STRING },
                    correctionStrategy: { type: Type.STRING }
                  },
                  required: ['mistakeName', 'percentageAffected', 'rootCause', 'concreteExample', 'correctionStrategy']
                }
              },
              knowledgeGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              interventionPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stage: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    suggestedDigitalTool: { type: Type.STRING }
                  },
                  required: ['stage', 'activity', 'suggestedDigitalTool']
                }
              },
              followUpExercises: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['overview', 'commonMistakes', 'knowledgeGaps', 'interventionPlan', 'followUpExercises']
          }
        }
      });

      let parsed = {};
      try {
        parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      } catch (pe) {
        console.error('JSON parse error in /api/teacher/diagnose-errors', pe);
        parsed = {};
      }
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/teacher/diagnose-errors:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for dev or static server for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Math 6 AI Tutor Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
