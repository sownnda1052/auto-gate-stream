// Dữ liệu mẫu mô phỏng WMS của U&I (kho ngoại quan Nam Tân Uyên)
export interface PackingLine {
  itemId: string;
  po: string;
  description: string;
  qty: number;
  cbm: number;
  gw: number;
}

export interface Plan {
  id: string;
  containerNo: string;
  customer: string;
  cargoType: string;
  direction: "nhap" | "xuat";
  arrival: string; // "HH:mm"
  lines: PackingLine[];
  warehouseId?: string;
  gate?: number;
  windowEnd?: string;
  deviation?: string; // cảnh báo sai lệch kế hoạch vs thực tế
  status?: string; // trạng thái lô hàng: đang xử lý / xe đã rời đi / đã hoàn tất
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number; // m³
  used: number; // m³
  customers: string[];
  cargoTypes: string[];
  gates: number[];
}

// 10 kho của U&I (rút gọn, dữ liệu mô phỏng)
export const WAREHOUSES: Warehouse[] = [
  { id: "02", name: "Kho ngoại quan số 2", address: "Đường N2, KCN Nam Tân Uyên", capacity: 1200, used: 936, customers: ["Ashley Furniture", "Customer A"], cargoTypes: ["Nội thất", "Điện tử"], gates: [1, 2, 12, 14, 17, 18] },
  { id: "03", name: "Kho ngoại quan số 3", address: "Đường N13, KCN Nam Tân Uyên", capacity: 1000, used: 610, customers: ["Customer A", "Vinamilk"], cargoTypes: ["Nội thất", "Thực phẩm khô"], gates: [20, 21, 22, 23, 24, 25] },
  { id: "04", name: "Kho ngoại quan số 4", address: "Đường N14, KCN Nam Tân Uyên", capacity: 900, used: 855, customers: ["Samsung"], cargoTypes: ["Điện tử"], gates: [26, 28, 29, 30] },
  { id: "05", name: "Kho ngoại quan số 5", address: "Đường N13, KCN Nam Tân Uyên", capacity: 800, used: 320, customers: ["Customer A"], cargoTypes: ["Nội thất", "May mặc"], gates: [31, 32, 34] },
  { id: "06", name: "Kho ngoại quan số 6", address: "Đường D6, KCN Nam Tân Uyên", capacity: 700, used: 658, customers: ["Ashley Furniture"], cargoTypes: ["Nội thất"], gates: [37, 38] },
];

// Packing list mẫu lấy từ Packing List AP-367 / Invoice LDB26431
export const SAMPLE_LINES: PackingLine[] = [
  { itemId: "I07-402-COC-1", po: "10871T6", description: "Queen Rails", qty: 4, cbm: 0.34, gw: 104 },
  { itemId: "I07-412-COC-1", po: "10874T6", description: "Queen Panel HB", qty: 5, cbm: 1.69, gw: 180 },
  { itemId: "I07-456-COC-2", po: "10871T6", description: "5 Drawer Chest", qty: 3, cbm: 2.66, gw: 302.7 },
  { itemId: "I3046-400", po: "11037T6", description: "Queen Sleigh HB", qty: 4, cbm: 1.1, gw: 144.6 },
  { itemId: "I3046-450", po: "11051T6", description: "2 Drawer Nightstand", qty: 14, cbm: 4.56, gw: 445.9 },
  { itemId: "I3046-453", po: "11051T6", description: "Dresser", qty: 6, cbm: 5.73, gw: 528.2 },
  { itemId: "I3330-303-CRN", po: "11251T6", description: '66" Executive Desk', qty: 7, cbm: 8.72, gw: 946.4 },
  { itemId: "I3365-453", po: "10929T6", description: "Dresser", qty: 8, cbm: 6.98, gw: 776 },
];

// Các kế hoạch đã xác nhận (lấy từ tờ giấy 41 cửa trong tài liệu)
export const SEED_PLANS: Plan[] = [
  {
    id: "p1", containerNo: "CSNU 8709142", customer: "Customer A", cargoType: "Nội thất",
    direction: "nhap", arrival: "08:30", lines: [], warehouseId: "02", gate: 14, windowEnd: "10:15",
  },
  {
    id: "p2", containerNo: "SEGU 5038733", customer: "Ashley Furniture", cargoType: "Nội thất",
    direction: "nhap", arrival: "09:00", lines: [], warehouseId: "02", gate: 12, windowEnd: "10:45",
    deviation: "Xe đến trễ 25 phút so với kế hoạch",
  },
  {
    id: "p3", containerNo: "HLBU 1710233", customer: "Customer A", cargoType: "Điện tử",
    direction: "nhap", arrival: "09:00", lines: [], warehouseId: "02", gate: 1, windowEnd: "10:30",
  },
  {
    id: "p4", containerNo: "VIA 352", customer: "Vinamilk", cargoType: "Thực phẩm khô",
    direction: "xuat", arrival: "10:30", lines: [], warehouseId: "03", gate: 24, windowEnd: "12:00",
  },
];
