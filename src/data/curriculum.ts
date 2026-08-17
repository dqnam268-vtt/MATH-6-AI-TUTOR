import { CurriculumChapter } from '../types';

export const GRADE_6_CURRICULUM: CurriculumChapter[] = [
  {
    id: 'ch1',
    number: 1,
    semester: 1,
    title: 'Tập hợp các số tự nhiên',
    lessons: [
      {
        id: 'bai1',
        code: 'Bài 1',
        title: 'Tập hợp. Phần tử của tập hợp',
        objectives: [
          'Nhận biết được tập hợp và các phần tử của một tập hợp',
          'Sử dụng đúng các kí hiệu ∈, ∉',
          'Biết biểu diễn một tập hợp bằng cách liệt kê hoặc chỉ ra tính chất đặc trưng'
        ],
        keyKnowledge: ['Kí hiệu tập hợp (chữ in hoa)', 'Phần tử thuộc/không thuộc tập hợp', 'Cách cho tập hợp'],
        realWorldContext: 'Tập hợp các đồ dùng học tập trong cặp sách, danh sách học sinh tổ 1.',
        digitalToolSuggestion: 'Google Sheets để quản lý danh sách và biểu diễn tập hợp.',
        sampleProblems: [
          {
            level: 'basic',
            question: 'Cho tập hợp $A = \\{2; 3; 5; 7\\}$. Khẳng định nào sau đây là đúng: $5 \\in A$ hay $6 \\in A$?',
            hint: 'Quan sát các số nằm bên trong cặp dấu ngoặc nhọn $\{...\}$ của tập hợp $A$.'
          }
        ]
      },
      {
        id: 'bai2',
        code: 'Bài 2',
        title: 'Cách ghi số tự nhiên',
        objectives: [
          'Biết cấu tạo thập phân của số tự nhiên',
          'Đọc và viết các số La Mã từ 1 đến 30'
        ],
        keyKnowledge: ['Hệ thập phân', 'Giá trị của các chữ số theo hàng', 'Chữ số La Mã (I, V, X)'],
        realWorldContext: 'Đọc số thế kỉ trên bia lịch sử, xem mặt đồng hồ số La Mã.',
        digitalToolSuggestion: 'Công cụ chuyển đổi số La Mã trực tuyến.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Viết số XXIV và XIX sang chữ số trong hệ thập phân.',
            hint: 'Nhớ lại quy tắc ghép chữ số: X = 10, V = 5, I = 1. Khi chữ số nhỏ hơn đứng trước thì làm phép trừ, đứng sau làm phép cộng.'
          }
        ]
      },
      {
        id: 'bai3',
        code: 'Bài 3',
        title: 'Thứ tự trong tập hợp các số tự nhiên',
        objectives: [
          'Biết so sánh hai số tự nhiên',
          'Biểu diễn số tự nhiên trên tia số'
        ],
        keyKnowledge: ['So sánh số tự nhiên', 'Tia số', 'Số liền trước, số liền sau'],
        realWorldContext: 'Xếp thứ hạng học tập, so sánh dân số giữa các tỉnh thành.',
        digitalToolSuggestion: 'GeoGebra vẽ tia số động và đánh dấu vị trí các số.',
        sampleProblems: [
          {
            level: 'basic',
            question: 'Tìm số tự nhiên $x$ biết $15 < x < 18$.',
            hint: 'Các số tự nhiên lớn hơn 15 và nhỏ hơn 18 là những số nào?'
          }
        ]
      },
      {
        id: 'bai4',
        code: 'Bài 4',
        title: 'Phép cộng và phép trừ số tự nhiên',
        objectives: [
          'Thực hiện thành thạo phép cộng và phép trừ',
          'Vận dụng các tính chất giao hoán, kết hợp để tính nhẩm, tính hợp lí'
        ],
        keyKnowledge: ['Tính chất giao hoán: $a + b = b + a$', 'Tính chất kết hợp: $(a + b) + c = a + (b + c)$', 'Điều kiện phép trừ trong $\\mathbb{N}$'],
        realWorldContext: 'Tính tổng hóa đơn mua hàng ở siêu thị, tính tiền thối lại.',
        digitalToolSuggestion: 'Máy tính bỏ túi để kiểm tra kết quả tính nhanh.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Tính một cách hợp lí: $135 + 360 + 65 + 40$.',
            hint: 'Hãy nhóm các số có tổng là số tròn trăm lại với nhau bằng tính chất kết hợp.'
          }
        ]
      },
      {
        id: 'bai5',
        code: 'Bài 5',
        title: 'Phép nhân và phép chia số tự nhiên',
        objectives: [
          'Thực hiện thành thạo phép nhân và phép chia hết, phép chia có dư',
          'Áp dụng tính chất phân phối của phép nhân đối với phép cộng'
        ],
        keyKnowledge: ['Tính chất phân phối: $a(b + c) = ab + ac$', 'Phép chia có dư: $a = b \\cdot q + r \\ (0 \\le r < b)$'],
        realWorldContext: 'Chia đều số kẹo cho các bạn, tính số xe cần thuê để chở học sinh đi dã ngoại.',
        digitalToolSuggestion: 'Bảng tính Excel/Google Sheets để lập bảng tính chi phí chuyến đi.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Tính nhanh: $27 \\cdot 36 + 27 \\cdot 64$.',
            hint: 'Thừa số 27 xuất hiện ở cả hai tích. Em hãy dùng tính chất phân phối $a \\cdot b + a \\cdot c = a \\cdot (b + c)$.'
          }
        ]
      },
      {
        id: 'bai6',
        code: 'Bài 6',
        title: 'Lũy thừa với số mũ tự nhiên',
        objectives: [
          'Hiểu định nghĩa lũy thừa bậc $n$ của $a$',
          'Nắm vững quy tắc nhân và chia hai lũy thừa cùng cơ số'
        ],
        keyKnowledge: ['$a^n = a \\cdot a \\dots a$ ($n$ thừa số $a$)', '$a^m \\cdot a^n = a^{m+n}$', '$a^m : a^n = a^{m-n} (a \\neq 0, m \\ge n)$'],
        realWorldContext: 'Sự tăng trưởng vi khuẩn gấp đôi sau mỗi giờ ($2^n$), khoảng cách thiên văn.',
        digitalToolSuggestion: 'GeoGebra mô phỏng đồ thị tăng trưởng số mũ.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Viết kết quả phép tính sau dưới dạng một lũy thừa: $3^4 \\cdot 3^5$.',
            hint: 'Khi nhân hai lũy thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ: $a^m \\cdot a^n = a^{m+n}$.'
          }
        ]
      },
      {
        id: 'bai7',
        code: 'Bài 7',
        title: 'Thứ tự thực hiện các phép tính',
        objectives: [
          'Thực hiện đúng thứ tự phép tính trong biểu thức không có ngoặc và có ngoặc',
          'Biết sử dụng ngoặc tròn $( )$, vuông $[ ]$, nhọn $\\{ \\}$'
        ],
        keyKnowledge: ['Không ngoặc: Lũy thừa $\\rightarrow$ Nhân/Chia $\\rightarrow$ Cộng/Trừ', 'Có ngoặc: $( ) \\rightarrow [ ] \\rightarrow \\{ \\}$'],
        realWorldContext: 'Lập công thức tính tổng chi phí mua đồ kèm thuế và mã giảm giá.',
        digitalToolSuggestion: 'Máy tính Casio/Vinacal để kiểm tra thứ tự nhập biểu thức.',
        sampleProblems: [
          {
            level: 'advanced',
            question: 'Thực hiện phép tính: $120 : [54 - (50 - 2^3)]$.',
            hint: 'Hãy tính giá trị lũy thừa $2^3$ trước, sau đó tính trong ngoặc tròn $( )$, tiếp theo trong ngoặc vuông $[ ]$, cuối cùng mới làm phép chia ngoài cùng.'
          }
        ]
      },
      {
        id: 'bai8',
        code: 'Bài 8-12',
        title: 'Quan hệ chia hết, Số nguyên tố, ƯCLN và BCNN',
        objectives: [
          'Nhận biết tính chất chia hết của một tổng, dấu hiệu chia hết cho 2, 3, 5, 9',
          'Phân biệt số nguyên tố và hợp số, phân tích một số ra thừa số nguyên tố',
          'Tìm ƯCLN, BCNN và vận dụng vào giải bài toán thực tế'
        ],
        keyKnowledge: ['Dấu hiệu chia hết', 'Số nguyên tố', 'Quy tắc tìm ƯCLN và BCNN bằng cách phân tích ra TSNT'],
        realWorldContext: 'Chia đều số cây bút và vở thành các phần quà nhiều nhất có thể (ƯCLN), tìm thời gian hai xe cùng xuất bến trở lại (BCNN).',
        digitalToolSuggestion: 'Công cụ lập trình thuật toán Euclid tìm ƯCLN trên máy tính.',
        sampleProblems: [
          {
            level: 'advanced',
            question: 'Một lớp học có 24 nam và 18 nữ. Cô giáo muốn chia đều số nam và nữ vào các tổ. Hỏi có thể chia thành nhiều nhất bao nhiêu tổ?',
            hint: 'Số tổ phải là ước chung của 24 và 18. Vì cần chia nhiều nhất nên số tổ chính là ƯCLN(24, 18).'
          }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    number: 2,
    semester: 1,
    title: 'Số nguyên (Tập hợp ℤ)',
    lessons: [
      {
        id: 'bai13',
        code: 'Bài 13',
        title: 'Tập hợp các số nguyên',
        objectives: [
          'Nhận biết số nguyên âm, số nguyên dương, số 0',
          'Biểu diễn các số nguyên trên trục số'
        ],
        keyKnowledge: ['Số nguyên âm mang dấu trừ: $-1, -2, -3...$', 'Tập hợp $\\mathbb{Z} = \\{..., -2, -1, 0, 1, 2, ...\\}$', 'Số đối của $a$ là $-a$'],
        realWorldContext: 'Nhiệt độ dưới $0^\\circ\\text{C}$, độ cao dưới mực nước biển, số tiền nợ/lãi trong kinh doanh.',
        digitalToolSuggestion: 'GeoGebra vẽ trục số nằm ngang và trục số thẳng đứng.',
        sampleProblems: [
          {
            level: 'basic',
            question: 'Nếu $+50\\,000$ đồng biểu diễn số tiền có thêm, thì số tiền nợ $30\\,000$ đồng được biểu diễn bằng số nguyên nào?',
            hint: 'Số nguyên âm dùng để biểu diễn các đại lượng mang ý nghĩa ngược lại với số dương.'
          }
        ]
      },
      {
        id: 'bai14',
        code: 'Bài 14',
        title: 'Phép cộng và phép trừ số nguyên',
        objectives: [
          'Cộng hai số nguyên cùng dấu, khác dấu',
          'Trừ hai số nguyên: $a - b = a + (-b)$',
          'Áp dụng quy tắc dấu ngoặc: khi bỏ dấu ngoặc có dấu "-" đằng trước phải đổi dấu tất cả các số hạng'
        ],
        keyKnowledge: ['Cộng cùng dấu: Cộng phần tự nhiên rồi đặt dấu chung', 'Cộng khác dấu: Lấy số lớn trừ số bé (phần tự nhiên) rồi lấy dấu của số có phần tự nhiên lớn hơn', 'Quy tắc dấu ngoặc'],
        realWorldContext: 'Biến động nhiệt độ từ ngày sang đêm, biến động tài khoản ngân hàng.',
        digitalToolSuggestion: 'Phần mềm mô phỏng bước nhảy trên trục số.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Tính: $(-15) + (-25)$ và $12 + (-20)$.',
            hint: 'Với $(-15) + (-25)$, hai số cùng âm nên cộng hai giá trị lại rồi đặt dấu "-" phía trước. Với $12 + (-20)$, đây là cộng hai số khác dấu.'
          }
        ]
      },
      {
        id: 'bai15',
        code: 'Bài 15-17',
        title: 'Phép nhân số nguyên & Quan hệ chia hết trong ℤ',
        objectives: [
          'Nắm vững quy tắc dấu trong phép nhân: cùng dấu ra dương, khác dấu ra âm',
          'Biết tìm bội và ước của một số nguyên'
        ],
        keyKnowledge: ['$(+) \\cdot (+) = (+)$', '(-) \\cdot (-) = (+)$', '$(+) \\cdot (-) = (-)$', 'Nếu $a = b \\cdot q$ thì $a$ là bội của $b$, $b$ là ước của $a$'],
        realWorldContext: 'Tính lỗ/lãi qua nhiều tháng kinh doanh.',
        digitalToolSuggestion: 'Bảng tính nhân ma trận số nguyên.',
        sampleProblems: [
          {
            level: 'advanced',
            question: 'Tìm các số nguyên $x$ sao cho $x + 3$ là ước của $7$.',
            hint: 'Ước của 7 trong tập số nguyên $\\mathbb{Z}$ là $\\{1; -1; 7; -7\\}$. Em hãy cho $x + 3$ lần lượt bằng các giá trị này để tìm $x$.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch3',
    number: 3,
    semester: 1,
    title: 'Hình học trực quan & Tính đối xứng',
    lessons: [
      {
        id: 'bai18',
        code: 'Bài 18-20',
        title: 'Tam giác đều, Hình vuông, Lục giác đều, Hình chữ nhật, Hình thoi, Hình bình hành, Hình thang cân',
        objectives: [
          'Mô tả được các yếu tố cơ bản (cạnh, góc, đường chéo) của các hình phẳng quen thuộc',
          'Vẽ và gấp, cắt các hình phẳng bằng dụng cụ học tập'
        ],
        keyKnowledge: ['Tam giác đều (3 cạnh bằng nhau, 3 góc bằng nhau)', 'Hình thoi (4 cạnh bằng nhau, 2 đường chéo vuông góc)', 'Hình bình hành (các cạnh đối song song và bằng nhau)'],
        realWorldContext: 'Gạch lát nền tổ ong (lục giác đều), họa tiết thổ cẩm (hình thoi), khung giàn cầu đường (tam giác).',
        digitalToolSuggestion: 'GeoGebra dựng các hình đa giác đều và đo góc.',
        sampleProblems: [
          {
            level: 'basic',
            question: 'Nêu các đặc điểm về cạnh và góc của một tam giác đều $ABC$.',
            hint: 'Hãy nhớ lại: Ba cạnh có bằng nhau không? Ba góc tại các đỉnh $A, B, C$ có bằng nhau không?'
          }
        ]
      },
      {
        id: 'bai21',
        code: 'Bài 21',
        title: 'Chu vi và diện tích một số hình phẳng trong thực tế',
        objectives: [
          'Tính được chu vi và diện tích của hình chữ nhật, hình vuông, tam giác, hình thoi, hình bình hành, hình thang'
        ],
        keyKnowledge: ['$S_{\\text{hình thoi}} = \\frac{1}{2} m \\cdot n$', '$S_{\\text{hình bình hành}} = a \\cdot h$', '$S_{\\text{hình thang}} = \\frac{(a+b)h}{2}$'],
        realWorldContext: 'Tính diện tích mảnh đất trồng hoa hình bình hành, tính số tiền sơn tường nhà.',
        digitalToolSuggestion: 'GeoGebra chia nhỏ đa giác để tính diện tích.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Một mảnh vườn hình thoi có độ dài hai đường chéo là $8\\,\\text{m}$ và $6\\,\\text{m}$. Tính diện tích mảnh vườn đó.',
            hint: 'Công thức tính diện tích hình thoi theo độ dài hai đường chéo $d_1, d_2$ là: $S = \\frac{1}{2} d_1 \\cdot d_2$.'
          }
        ]
      },
      {
        id: 'bai22',
        code: 'Bài 22',
        title: 'Hình có trục đối xứng và tâm đối xứng',
        objectives: [
          'Nhận biết được trục đối xứng và tâm đối xứng của các hình học và hình ảnh trong tự nhiên'
        ],
        keyKnowledge: ['Trục đối xứng: Khi gấp theo trục, hai nửa hình trùng khít', 'Tâm đối xứng: Khi quay $180^\\circ$ quanh tâm, hình trùng với chính nó'],
        realWorldContext: 'Cánh bướm, bông tuyết, cánh quạt máy bay, logo biển báo giao thông.',
        digitalToolSuggestion: 'Phần mềm đồ họa thực hiện phép quay và phép phản chiếu.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Hình tròn có bao nhiêu trục đối xứng và có tâm đối xứng không?',
            hint: 'Mỗi đường thẳng đi qua tâm của hình tròn có phải là một trục đối xứng không? Điểm chính giữa hình tròn là gì?'
          }
        ]
      }
    ]
  },
  {
    id: 'ch4',
    number: 4,
    semester: 2,
    title: 'Phân số & Số thập phân',
    lessons: [
      {
        id: 'bai23',
        code: 'Bài 23-27',
        title: 'Phân số. Các phép tính với phân số',
        objectives: [
          'Hiểu khái niệm phân số mở rộng $\\frac{a}{b} (a, b \\in \\mathbb{Z}, b \\neq 0)$',
          'Rút gọn phân số, quy đồng mẫu số',
          'Cộng, trừ, nhân, chia phân số thành thạo'
        ],
        keyKnowledge: ['Phân số bằng nhau: $\\frac{a}{b} = \\frac{c}{d} \\Leftrightarrow a \\cdot d = b \\cdot c$', 'Quy tắc cộng trừ cùng mẫu và khác mẫu', 'Phép nhân: $\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$'],
        realWorldContext: 'Pha chế công thức nấu ăn, chia phần bánh pizza, phân bổ thời gian trong ngày.',
        digitalToolSuggestion: 'Trực quan hóa phân số bằng hình tròn và thanh bar.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Tính giá trị biểu thức: $\\frac{-3}{7} + \\frac{5}{14}$.',
            hint: 'Mẫu số chung là bao nhiêu? Em hãy quy đồng mẫu số của $\\frac{-3}{7}$ về mẫu 14 trước khi cộng hai tử số.'
          }
        ]
      },
      {
        id: 'bai28',
        code: 'Bài 28-31',
        title: 'Số thập phân & Tỉ số phần trăm',
        objectives: [
          'Hiểu số thập phân âm và dương',
          'Thực hiện cộng, trừ, nhân, chia số thập phân',
          'Làm tròn số thập phân và giải bài toán tỉ số, tỉ số phần trăm'
        ],
        keyKnowledge: ['Làm tròn số theo hàng quy định', 'Tìm giá trị phân số của một số: $a \\cdot \\frac{m}{n}$', 'Tìm một số biết giá trị phân số: $b : \\frac{m}{n}$', 'Tỉ số phần trăm $\\frac{a}{b} \\cdot 100\\%$'],
        realWorldContext: 'Tính tiền giảm giá $20\\%$ khi mua quần áo, tính lãi suất gửi tiết kiệm ngân hàng.',
        digitalToolSuggestion: 'Google Sheets lập bảng tính tỉ lệ phần trăm và vẽ biểu đồ hình quạt.',
        sampleProblems: [
          {
            level: 'advanced',
            question: 'Một chiếc áo có giá niêm yết là $250\\,000$ đồng. Nhân dịp khai trương, cửa hàng giảm giá $15\\%$. Hỏi người mua phải trả bao nhiêu tiền?',
            hint: 'Cách 1: Tính số tiền được giảm ($250\\,000 \\times 15\\%$) rồi lấy giá gốc trừ đi. Cách 2: Giá sau giảm bằng $100\\% - 15\\% = 85\\%$ giá gốc.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch5',
    number: 5,
    semester: 2,
    title: 'Hình học phẳng cơ bản & Dữ liệu xác suất',
    lessons: [
      {
        id: 'bai32',
        code: 'Bài 32-37',
        title: 'Điểm, Đường thẳng, Đoạn thẳng, Tia, Góc',
        objectives: [
          'Nhận biết điểm thuộc/không thuộc đường thẳng, điểm nằm giữa',
          'Độ dài đoạn thẳng, trung điểm của đoạn thẳng',
          'Khái niệm góc, số đo góc, phân biệt góc nhọn, góc vuông, góc tù, góc bẹt'
        ],
        keyKnowledge: ['Trung điểm $M$ của đoạn thẳng $AB$: $M$ nằm giữa $A, B$ và $MA = MB = \\frac{AB}{2}$', 'Số đo góc từ $0^\\circ$ đến $180^\\circ$', 'Góc nhọn ($<90^\\circ$), Vuông ($=90^\\circ$), Tù ($90^\\circ < \\alpha < 180^\\circ$), Bẹt ($=180^\\circ$)'],
        realWorldContext: 'Đo khoảng cách trên bản đồ, góc mở của cánh cửa, kim đồng hồ chỉ góc.',
        digitalToolSuggestion: 'GeoGebra vẽ đoạn thẳng, thước đo góc trực tuyến.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Trên tia $Ox$, lấy hai điểm $A$ và $B$ sao cho $OA = 3\\,\\text{cm}, OB = 6\\,\\text{cm}$. Điểm $A$ có là trung điểm của đoạn thẳng $OB$ không? Vì sao?',
            hint: 'Em hãy kiểm tra hai điều kiện: 1) Điểm $A$ có nằm giữa $O$ và $B$ không? 2) Độ dài $OA$ có bằng $AB$ (và bằng $\\frac{OB}{2}$) không?'
          }
        ]
      },
      {
        id: 'bai38',
        code: 'Bài 38-43',
        title: 'Dữ liệu và Xác suất thực nghiệm',
        objectives: [
          'Thu thập, phân loại, biểu diễn dữ liệu bằng bảng và biểu đồ cột, biểu đồ cột kép',
          'Tính xác suất thực nghiệm của một sự kiện: $\\frac{\\text{Số lần sự kiện xảy ra}}{\\text{Tổng số lần thực nghiệm}}$'
        ],
        keyKnowledge: ['Bảng kiểm đếm', 'Biểu đồ tranh, biểu đồ cột, biểu đồ cột kép', 'Xác suất thực nghiệm trong trò chơi tung đồng xu, gieo xúc xắc'],
        realWorldContext: 'Thống kê điểm kiểm tra của lớp, điều tra sở thích học sinh, xác suất trúng thưởng trò chơi dân gian.',
        digitalToolSuggestion: 'Google Forms thu thập ý kiến, Google Sheets vẽ biểu đồ tự động.',
        sampleProblems: [
          {
            level: 'standard',
            question: 'Gieo một con xúc xắc 20 lần liên tiếp, thấy có 4 lần xuất hiện mặt 6 chấm. Tính xác suất thực nghiệm của sự kiện "Mặt xuất hiện của xúc xắc là 6 chấm".',
            hint: 'Xác suất thực nghiệm = (Số lần xuất hiện mặt 6 chấm) : (Tổng số lần gieo xúc xắc).'
          }
        ]
      }
    ]
  }
];
