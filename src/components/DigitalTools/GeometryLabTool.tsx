import React, { useState } from 'react';
import { MathRenderer } from '../MathRenderer';
import { Shapes, Eye, CheckCircle2 } from 'lucide-react';

interface ShapeDef {
  id: string;
  name: string;
  category: string;
  svgPath: React.ReactNode;
  properties: string[];
  perimeterFormula: string;
  areaFormula: string;
  symmetryAxes: number | string;
  hasCenterSymmetry: boolean;
  realWorldExample: string;
}

export const GeometryLabTool: React.FC = () => {
  const [selectedShapeId, setSelectedShapeId] = useState<string>('rhombus');
  const [showSymmetry, setShowSymmetry] = useState<boolean>(true);
  const [paramA, setParamA] = useState<number>(6);
  const [paramB, setParamB] = useState<number>(8);

  const shapes: ShapeDef[] = [
    {
      id: 'equilateral_triangle',
      name: 'Tam giác đều',
      category: 'Đa giác đều',
      svgPath: (
        <polygon
          points="100,20 180,160 20,160"
          fill="#EEF2FF"
          stroke="#4F46E5"
          strokeWidth="3"
        />
      ),
      properties: [
        '3 cạnh có độ dài bằng nhau: $AB = BC = CA = a$',
        '3 góc ở đỉnh bằng nhau: $\\widehat{A} = \\widehat{B} = \\widehat{C} = 60^\\circ$',
        'Không có đường chéo'
      ],
      perimeterFormula: 'C = 3 \\cdot a',
      areaFormula: 'S = \\frac{a^2 \\sqrt{3}}{4} \\approx 0.433 \\cdot a^2',
      symmetryAxes: 3,
      hasCenterSymmetry: false,
      realWorldExample: 'Biển báo nguy hiểm, hoa văn gạch trang trí, kệ treo tường tam giác.'
    },
    {
      id: 'square',
      name: 'Hình vuông',
      category: 'Tứ giác',
      svgPath: (
        <rect
          x="30"
          y="30"
          width="140"
          height="140"
          fill="#ECFDF5"
          stroke="#059669"
          strokeWidth="3"
        />
      ),
      properties: [
        '4 cạnh bằng nhau: $AB = BC = CD = DA = a$',
        '4 góc vuông: $\\widehat{A} = \\widehat{B} = \\widehat{C} = \\widehat{D} = 90^\\circ$',
        '2 đường chéo bằng nhau và vuông góc với nhau tại trung điểm mỗi đường'
      ],
      perimeterFormula: 'C = 4 \\cdot a',
      areaFormula: 'S = a^2',
      symmetryAxes: 4,
      hasCenterSymmetry: true,
      realWorldExample: 'Viên gạch lát sàn 60x60, bàn cờ vua, mặt đồng hồ vuông.'
    },
    {
      id: 'rhombus',
      name: 'Hình thoi',
      category: 'Tứ giác',
      svgPath: (
        <polygon
          points="100,20 180,100 100,180 20,100"
          fill="#FFFBEB"
          stroke="#D97706"
          strokeWidth="3"
        />
      ),
      properties: [
        '4 cạnh bằng nhau: $AB = BC = CD = DA = a$',
        'Các cạnh đối song song với nhau',
        '2 đường chéo vuông góc với nhau tại trung điểm của mỗi đường: $d_1 \\perp d_2$'
      ],
      perimeterFormula: 'C = 4 \\cdot a',
      areaFormula: 'S = \\frac{1}{2} \\cdot d_1 \\cdot d_2',
      symmetryAxes: 2,
      hasCenterSymmetry: true,
      realWorldExample: 'Họa tiết thổ cẩm Tây Bắc, logo Mitsubishi, diều hình thoi.'
    },
    {
      id: 'parallelogram',
      name: 'Hình bình hành',
      category: 'Tứ giác',
      svgPath: (
        <polygon
          points="60,40 180,40 140,160 20,160"
          fill="#FDF2F8"
          stroke="#DB2777"
          strokeWidth="3"
        />
      ),
      properties: [
        'Các cạnh đối song song và bằng nhau: $AB = CD, AD = BC$',
        'Các góc đối bằng nhau',
        '2 đường chéo cắt nhau tại trung điểm mỗi đường'
      ],
      perimeterFormula: 'C = 2 \\cdot (a + b)',
      areaFormula: 'S = a \\cdot h',
      symmetryAxes: 0,
      hasCenterSymmetry: true,
      realWorldExample: 'Thanh giằng lan can cầu thang trượt, khung cửa xếp inox.'
    },
    {
      id: 'regular_hexagon',
      name: 'Lục giác đều',
      category: 'Đa giác đều',
      svgPath: (
        <polygon
          points="100,20 170,60 170,140 100,180 30,140 30,60"
          fill="#F0FDF4"
          stroke="#16A34A"
          strokeWidth="3"
        />
      ),
      properties: [
        '6 cạnh bằng nhau',
        '6 góc ở đỉnh bằng nhau và bằng $120^\\circ$',
        '3 đường chéo chính bằng nhau và cắt nhau tại một điểm'
      ],
      perimeterFormula: 'C = 6 \\cdot a',
      areaFormula: 'S = 6 \\cdot \\frac{a^2 \\sqrt{3}}{4}',
      symmetryAxes: 6,
      hasCenterSymmetry: true,
      realWorldExample: 'Tổ ong mật, đai ốc lục giác, cấu trúc tinh thể tuyết.'
    }
  ];

  const currentShape = shapes.find((s) => s.id === selectedShapeId) || shapes[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shapes className="w-5 h-5 text-indigo-600" />
            Phòng Thí Nghiệm Hình Học Trực Quan & Tính Đối Xứng
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Khám phá đặc điểm, chu vi, diện tích và tính đối xứng các hình phẳng (Chương IV, V Toán 6)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSymmetry(!showSymmetry)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showSymmetry
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showSymmetry ? 'Hiện trục/tâm đối xứng' : 'Ẩn yếu tố đối xứng'}
          </button>
        </div>
      </div>

      {/* Shape Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {shapes.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedShapeId(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedShapeId === s.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Visual Canvas & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Display */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-200/80 p-6 flex flex-col items-center justify-center relative min-h-[260px]">
          <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-sm">
            {currentShape.svgPath}

            {/* Symmetry Overlay */}
            {showSymmetry && (
              <>
                {/* Horizontal / Vertical Axis */}
                {selectedShapeId === 'rhombus' && (
                  <>
                    <line x1="100" y1="10" x2="100" y2="190" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                  </>
                )}
                {selectedShapeId === 'square' && (
                  <>
                    <line x1="100" y1="15" x2="100" y2="185" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="15" y1="100" x2="185" y2="100" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="20" y1="20" x2="180" y2="180" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="20" y1="180" x2="180" y2="20" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                  </>
                )}
                {selectedShapeId === 'equilateral_triangle' && (
                  <>
                    <line x1="100" y1="15" x2="100" y2="165" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="20" y1="160" x2="140" y2="90" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="180" y1="160" x2="60" y2="90" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" />
                  </>
                )}

                {/* Center of symmetry point */}
                {currentShape.hasCenterSymmetry && (
                  <circle cx="100" cy="100" r="4.5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                )}
              </>
            )}
          </svg>

          {showSymmetry && (
            <div className="mt-3 flex items-center gap-3 text-[11px] font-medium text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-red-600 inline-block"></span> Trục đối xứng
              </span>
              {currentShape.hasCenterSymmetry && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span> Tâm đối xứng
                </span>
              )}
            </div>
          )}
        </div>

        {/* Properties & Formulas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-800">{currentShape.name}</h4>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentShape.category}
            </span>
          </div>

          <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div className="text-xs font-bold text-slate-700 mb-1">Đặc điểm hình học:</div>
            {currentShape.properties.map((prop, idx) => (
              <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div><MathRenderer content={prop} /></div>
              </div>
            ))}
          </div>

          {/* Formulas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                Chu vi (C)
              </div>
              <div className="text-sm font-bold text-amber-950 font-serif">
                <MathRenderer content={`$$${currentShape.perimeterFormula}$$`} />
              </div>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
              <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Diện tích (S)
              </div>
              <div className="text-sm font-bold text-emerald-950 font-serif">
                <MathRenderer content={`$$${currentShape.areaFormula}$$`} />
              </div>
            </div>
          </div>

          {/* Symmetry & Real world */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800">Trục đối xứng: </span>
              <span className="text-slate-600">
                {typeof currentShape.symmetryAxes === 'number' && currentShape.symmetryAxes > 0
                  ? `Có ${currentShape.symmetryAxes} trục`
                  : 'Không có trục'}
              </span>
              <br />
              <span className="font-bold text-slate-800">Tâm đối xứng: </span>
              <span className="text-slate-600">
                {currentShape.hasCenterSymmetry ? 'Có (Giao điểm các đường chéo)' : 'Không có'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800">Thực tiễn: </span>
              <span className="text-slate-600">{currentShape.realWorldExample}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
