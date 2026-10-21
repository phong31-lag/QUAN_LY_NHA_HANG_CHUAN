/**
 * Tầng giao tiếp API Backend
 * Thống nhất cấu trúc phản hồi: { ok: boolean, data: any, msg: string }
 * Đáp ứng US-003: Tự động xử lý khi hết hạn token / đăng xuất an toàn
 * Tích hợp Mock Storage thông minh để có thể chạy thử nghiệm độc lập
 */
import { KHOA_LUU_TRU, VAI_TRO, TRANG_THAI_TAI_KHOAN } from './hangSo.js';

const CAU_HINH_API = {
  DIEM_CUOI: 'http://localhost:3000/api',
  THOI_GIAN_CHO: 8000
};

// Dữ liệu mẫu khởi tạo ban đầu cho các module của Phong
const DU_LIEU_MAU = {
  nguoiDung: [
    {
      id: 1,
      tenDangNhap: 'admin',
      hoTen: 'Nguyễn Văn Quản Lý',
      soDienThoai: '0901234567',
      email: 'quanly@quanmoc.com',
      vaiTro: VAI_TRO.QUAN_LY,
      trangThai: TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG,
      ngayTao: '2026-10-01T08:00:00'
    },
    {
      id: 2,
      tenDangNhap: 'thungan01',
      hoTen: 'Trần Thị Thu Ngân',
      soDienThoai: '0912345678',
      email: 'thungan@quanmoc.com',
      vaiTro: VAI_TRO.THU_NGAN,
      trangThai: TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG,
      ngayTao: '2026-10-05T09:00:00'
    },
    {
      id: 3,
      tenDangNhap: 'bepchinh',
      hoTen: 'Lê Văn Bếp',
      soDienThoai: '0987654321',
      email: 'bep@quanmoc.com',
      vaiTro: VAI_TRO.BEP,
      trangThai: TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG,
      ngayTao: '2026-10-06T10:30:00'
    },
    {
      id: 4,
      tenDangNhap: 'phucvu01',
      hoTen: 'Phạm Văn Phục Vụ',
      soDienThoai: '0933221100',
      email: 'phucvu@quanmoc.com',
      vaiTro: VAI_TRO.PHUC_VU,
      trangThai: TRANG_THAI_TAI_KHOAN.DA_KHOA,
      ngayTao: '2026-10-10T14:15:00'
    }
  ],
  vaiTro: [
    {
      ma: VAI_TRO.QUAN_LY,
      ten: 'Quản lý / Chủ quán',
      moTa: 'Toàn quyền điều hành nhà hàng, quản lý nhân sự, thực đơn và báo cáo doanh thu',
      quyenHan: ['xem_don_bep', 'xu_ly_don_bep', 'xem_so_do_ban', 'thu_tien_in_hoa_don', 'chinh_sua_thuc_don', 'xem_bao_cao_doanh_thu', 'quan_ly_nhan_su', 'phan_quyen_vai_tro', 'cau_hinh_nha_hang', 'xem_nhat_ky_he_thong']
    },
    {
      ma: VAI_TRO.THU_NGAN,
      ten: 'Thu ngân',
      moTa: 'Quản lý bàn, tiếp nhận đơn gọi món, thu tiền, in hóa đơn và tích điểm khách hàng',
      quyenHan: ['xem_so_do_ban', 'thu_tien_in_hoa_don']
    },
    {
      ma: VAI_TRO.BEP,
      ten: 'Đầu bếp',
      moTa: 'Xem danh sách món cần làm trên màn hình KDS, cập nhật tiến độ nấu và thông báo xong món',
      quyenHan: ['xem_don_bep', 'xu_ly_don_bep']
    },
    {
      ma: VAI_TRO.PHUC_VU,
      ten: 'Phục vụ bàn',
      moTa: 'Hỗ trợ khách hàng tại bàn, tiếp nhận yêu cầu gọi nhân viên / thanh toán',
      quyenHan: ['xem_so_do_ban']
    }
  ],
  cauHinhQuan: {
    tenNhaHang: 'Quán Mộc - Nhà Hàng Lẩu Nướng & Cơm Niêu',
    diaChi: '123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh',
    hotline: '0909 888 999',
    tenWifi: 'QuanMoc_KhachHang',
    matKhauWifi: 'quanmoc2026',
    tyLeVat: 8,
    phiPhucVu: 0,
    tenNganHang: 'MBBank',
    soTaiKhoan: '090123456789',
    tenChuTaiKhoan: 'NGUYEN VAN QUAN LY'
  },
  lichSuPhanQuyen: [
    {
      id: 1,
      nguoiThucHien: 'admin',
      hanhDong: 'Gán vai trò Thu ngân cho tài khoản thungan01',
      thoiGian: '2026-10-05T09:05:00',
      ghiChu: 'Khởi tạo tài khoản đầu ca'
    },
    {
      id: 2,
      nguoiThucHien: 'admin',
      hanhDong: 'Khóa tài khoản phucvu01',
      thoiGian: '2026-10-18T16:20:00',
      ghiChu: 'Nhân viên xin nghỉ việc (US-014)'
    }
  ],
  nhatKyHeThong: [
    {
      id: 1,
      thoiGian: '2026-10-21T08:30:15',
      nguoiThucHien: 'admin',
      loaiNhatKy: 'INFO',
      noiDung: 'Đăng nhập hệ thống quản trị thành công từ IP 192.168.1.10'
    },
    {
      id: 2,
      thoiGian: '2026-10-21T08:45:00',
      nguoiThucHien: 'admin',
      loaiNhatKy: 'INFO',
      noiDung: 'Cập nhật cấu hình thuế VAT thành 8%'
    },
    {
      id: 3,
      thoiGian: '2026-10-21T09:10:22',
      nguoiThucHien: 'thungan01',
      loaiNhatKy: 'INFO',
      noiDung: 'Thanh toán hoàn tất bàn số 05, tổng tiền 420.000 đ'
    },
    {
      id: 4,
      thoiGian: '2026-10-21T09:15:00',
      nguoiThucHien: 'bepchinh',
      loaiNhatKy: 'WARN',
      noiDung: 'Báo tạm hết món Lẩu Bò Nhúng Giấm trên hệ thống'
    }
  ]
};

// Khởi tạo bộ nhớ giả lập nếu chưa có
function khoiTaoBoNhoGiaLap() {
  if (!localStorage.getItem('mock_nguoi_dung')) {
    localStorage.setItem('mock_nguoi_dung', JSON.stringify(DU_LIEU_MAU.nguoiDung));
  }
  if (!localStorage.getItem('mock_vai_tro')) {
    localStorage.setItem('mock_vai_tro', JSON.stringify(DU_LIEU_MAU.vaiTro));
  }
  if (!localStorage.getItem('mock_cau_hinh')) {
    localStorage.setItem('mock_cau_hinh', JSON.stringify(DU_LIEU_MAU.cauHinhQuan));
  }
  if (!localStorage.getItem('mock_lich_su_pq')) {
    localStorage.setItem('mock_lich_su_pq', JSON.stringify(DU_LIEU_MAU.lichSuPhanQuyen));
  }
  if (!localStorage.getItem('mock_nhat_ky')) {
    localStorage.setItem('mock_nhat_ky', JSON.stringify(DU_LIEU_MAU.nhatKyHeThong));
  }
}
khoiTaoBoNhoGiaLap();

/**
 * Lấy Token từ LocalStorage
 */
export function layToken() {
  return localStorage.getItem(KHOA_LUU_TRU.TOKEN);
}

/**
 * Lưu Token và thông tin người dùng
 */
export function luuPhienDangNhap(token, nguoiDung, refreshToken = null) {
  localStorage.setItem(KHOA_LUU_TRU.TOKEN, token);
  localStorage.setItem(KHOA_LUU_TRU.NGUOI_DUNG, JSON.stringify(nguoiDung));
  if (refreshToken) {
    localStorage.setItem(KHOA_LUU_TRU.REFRESH_TOKEN, refreshToken);
  }
}

/**
 * Xóa thông tin đăng nhập (US-008, US-003)
 */
export function xoaPhienDangNhap() {
  localStorage.removeItem(KHOA_LUU_TRU.TOKEN);
  localStorage.removeItem(KHOA_LUU_TRU.REFRESH_TOKEN);
  localStorage.removeItem(KHOA_LUU_TRU.NGUOI_DUNG);
}

/**
 * Lấy thông tin người dùng hiện tại đang đăng nhập
 */
export function layNguoiDungHienTai() {
  const chuoi = localStorage.getItem(KHOA_LUU_TRU.NGUOI_DUNG);
  try {
    return chuoi ? JSON.parse(chuoi) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Hàm gọi API tổng quát chuẩn quy ước { ok, data, msg }
 */
export async function goiApi(duongDan, tuyChon = {}) {
  const token = layToken();
  const tieuDe = {
    'Content-Type': 'application/json',
    ...(tuyChon.headers || {})
  };

  if (token) {
    tieuDe['Authorization'] = `Bearer ${token}`;
  }

  try {
    const phanHoi = await fetch(`${CAU_HINH_API.DIEM_CUOI}${duongDan}`, {
      ...tuyChon,
      headers: tieuDe
    });

    // Xử lý hết hạn phiên (US-003)
    if (phanHoi.status === 401) {
      xoaPhienDangNhap();
      window.location.hash = '#/dang-nhap';
      return { ok: false, data: null, msg: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!' };
    }

    const ketQua = await phanHoi.json();
    return ketQua;
  } catch (loiKetNoi) {
    // Khi Backend chưa bật hoặc đang dev, kích hoạt Mock Service tương ứng
    return xuLyApiGiaLap(duongDan, tuyChon);
  }
}

/**
 * Mock Service xử lý đầy đủ các User Story của Phong khi Backend offline
 */
function xuLyApiGiaLap(duongDan, tuyChon) {
  const phuongThuc = (tuyChon.method || 'GET').toUpperCase();
  const thanDuLieu = tuyChon.body ? JSON.parse(tuyChon.body) : {};

  // US-007: Đăng nhập
  if (duongDan === '/tai-khoan/dang-nhap' && phuongThuc === 'POST') {
    const { tenDangNhap, matKhau } = thanDuLieu;
    const danhSach = JSON.parse(localStorage.getItem('mock_nguoi_dung') || '[]');
    const nguoiDung = danhSach.find(u => u.tenDangNhap === tenDangNhap);

    if (!nguoiDung) {
      return { ok: false, data: null, msg: 'Tài khoản không tồn tại trong hệ thống!' };
    }
    if (nguoiDung.trangThai === TRANG_THAI_TAI_KHOAN.DA_KHOA) {
      return { ok: false, data: null, msg: 'Tài khoản này đã bị khóa. Vui lòng liên hệ Quản lý!' };
    }
    if (matKhau !== '123456' && matKhau !== 'admin123') {
      return { ok: false, data: null, msg: 'Mật khẩu không chính xác (Thử: 123456)!' };
    }

    const tokenGia = 'token_mock_' + Date.now();
    luuPhienDangNhap(tokenGia, nguoiDung, 'refresh_token_mock_' + Date.now());
    themNhatKyHeThong('INFO', `Đăng nhập thành công với tài khoản: ${nguoiDung.tenDangNhap}`);

    return {
      ok: true,
      data: {
        token: tokenGia,
        nguoiDung: nguoiDung
      },
      msg: 'Đăng nhập thành công!'
    };
  }

  // US-008: Đăng xuất
  if (duongDan === '/tai-khoan/dang-xuat') {
    const cur = layNguoiDungHienTai();
    if (cur) themNhatKyHeThong('INFO', `Tài khoản ${cur.tenDangNhap} đã đăng xuất`);
    xoaPhienDangNhap();
    return { ok: true, data: null, msg: 'Đăng xuất thành công!' };
  }

  // US-009: Đổi mật khẩu
  if (duongDan === '/tai-khoan/doi-mat-khau' && phuongThuc === 'POST') {
    const { matKhauCu, matKhauMoi } = thanDuLieu;
    if (!matKhauMoi || matKhauMoi.length < 6) {
      return { ok: false, data: null, msg: 'Mật khẩu mới phải có ít nhất 6 ký tự!' };
    }
    const cur = layNguoiDungHienTai();
    if (cur) themNhatKyHeThong('INFO', `Tài khoản ${cur.tenDangNhap} đã đổi mật khẩu cá nhân`);
    return { ok: true, data: null, msg: 'Đổi mật khẩu thành công!' };
  }

  // US-010: Cập nhật hồ sơ cá nhân
  if (duongDan === '/tai-khoan/cap-nhat-ho-so' && phuongThuc === 'PUT') {
    const cur = layNguoiDungHienTai();
    if (!cur) return { ok: false, data: null, msg: 'Chưa đăng nhập' };
    const capNhat = { ...cur, ...thanDuLieu };
    localStorage.setItem(KHOA_LUU_TRU.NGUOI_DUNG, JSON.stringify(capNhat));

    const danhSach = JSON.parse(localStorage.getItem('mock_nguoi_dung') || '[]');
    const index = danhSach.findIndex(u => u.id === cur.id);
    if (index !== -1) {
      danhSach[index] = capNhat;
      localStorage.setItem('mock_nguoi_dung', JSON.stringify(danhSach));
    }
    themNhatKyHeThong('INFO', `Tài khoản ${cur.tenDangNhap} đã cập nhật thông tin hồ sơ`);
    return { ok: true, data: capNhat, msg: 'Cập nhật hồ sơ thành công!' };
  }

  // US-012: Xem danh sách nhân viên
  if (duongDan === '/nhan-vien' && phuongThuc === 'GET') {
    const danhSach = JSON.parse(localStorage.getItem('mock_nguoi_dung') || '[]');
    return { ok: true, data: danhSach, msg: 'Lấy danh sách nhân viên thành công!' };
  }

  // US-011: Thêm mới nhân viên
  if (duongDan === '/nhan-vien' && phuongThuc === 'POST') {
    const danhSach = JSON.parse(localStorage.getItem('mock_nguoi_dung') || '[]');
    const { tenDangNhap, hoTen, soDienThoai, vaiTro, email } = thanDuLieu;

    if (danhSach.some(u => u.tenDangNhap === tenDangNhap)) {
      return { ok: false, data: null, msg: 'Tên đăng nhập đã tồn tại trong hệ thống!' };
    }

    const nhanVienMoi = {
      id: Date.now(),
      tenDangNhap,
      hoTen,
      soDienThoai,
      email: email || `${tenDangNhap}@quanmoc.com`,
      vaiTro: vaiTro || VAI_TRO.PHUC_VU,
      trangThai: TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG,
      ngayTao: new Date().toISOString()
    };
    danhSach.push(nhanVienMoi);
    localStorage.setItem('mock_nguoi_dung', JSON.stringify(danhSach));
    themNhatKyHeThong('INFO', `Thêm mới nhân viên: ${tenDangNhap} (${hoTen}) - Vai trò: ${vaiTro}`);
    return { ok: true, data: nhanVienMoi, msg: 'Tạo tài khoản nhân viên mới thành công!' };
  }

  // US-013 & US-014: Sửa/Khóa/Mở khóa/Đặt lại mật khẩu nhân viên
  if (duongDan.startsWith('/nhan-vien/') && phuongThuc === 'PUT') {
    const id = parseInt(duongDan.split('/')[2]);
    const danhSach = JSON.parse(localStorage.getItem('mock_nguoi_dung') || '[]');
    const index = danhSach.findIndex(u => u.id === id);

    if (index === -1) {
      return { ok: false, data: null, msg: 'Không tìm thấy nhân viên!' };
    }

    danhSach[index] = { ...danhSach[index], ...thanDuLieu };
    localStorage.setItem('mock_nguoi_dung', JSON.stringify(danhSach));
    themNhatKyHeThong('INFO', `Cập nhật thông tin nhân viên ID: ${id}`);
    return { ok: true, data: danhSach[index], msg: 'Cập nhật tài khoản nhân viên thành công!' };
  }

  // US-015: Xem danh sách vai trò
  if (duongDan === '/vai-tro' && phuongThuc === 'GET') {
    const danhSach = JSON.parse(localStorage.getItem('mock_vai_tro') || '[]');
    return { ok: true, data: danhSach, msg: 'Lấy danh sách vai trò thành công!' };
  }

  // US-016 & US-018: Cập nhật quyền hạn cho vai trò
  if (duongDan.startsWith('/vai-tro/') && phuongThuc === 'PUT') {
    const maVaiTro = duongDan.split('/')[2];
    const danhSach = JSON.parse(localStorage.getItem('mock_vai_tro') || '[]');
    const index = danhSach.findIndex(v => v.ma === maVaiTro);

    if (index === -1) {
      return { ok: false, data: null, msg: 'Không tìm thấy vai trò!' };
    }

    danhSach[index] = { ...danhSach[index], ...thanDuLieu };
    localStorage.setItem('mock_vai_tro', JSON.stringify(danhSach));

    // US-022: Ghi nhận lịch sử phân quyền
    themNhatKyPhanQuyen(`Cập nhật ma trận quyền hạn cho vai trò: ${danhSach[index].ten}`);
    themNhatKyHeThong('INFO', `Phân quyền vai trò: ${maVaiTro}`);
    return { ok: true, data: danhSach[index], msg: 'Cập nhật phân quyền vai trò thành công!' };
  }

  // US-022: Xem lịch sử phân quyền
  if (duongDan === '/vai-tro/lich-su' && phuongThuc === 'GET') {
    const lichSu = JSON.parse(localStorage.getItem('mock_lich_su_pq') || '[]');
    return { ok: true, data: lichSu, msg: 'Lấy lịch sử phân quyền thành công!' };
  }

  // US-041, US-042, US-043: Lấy & Lưu cấu hình nhà hàng
  if (duongDan === '/cau-hinh-nha-hang' && phuongThuc === 'GET') {
    const cauHinh = JSON.parse(localStorage.getItem('mock_cau_hinh') || '{}');
    return { ok: true, data: cauHinh, msg: 'Lấy cấu hình nhà hàng thành công!' };
  }
  if (duongDan === '/cau-hinh-nha-hang' && phuongThuc === 'PUT') {
    const cauHinh = { ...thanDuLieu };
    localStorage.setItem('mock_cau_hinh', JSON.stringify(cauHinh));
    themNhatKyHeThong('INFO', 'Cập nhật thông tin quán, thuế VAT và tài khoản VietQR');
    return { ok: true, data: cauHinh, msg: 'Lưu cấu hình nhà hàng thành công!' };
  }

  // US-044: Xem nhật ký hệ thống
  if (duongDan === '/nhat-ky-he-thong' && phuongThuc === 'GET') {
    const nhatKy = JSON.parse(localStorage.getItem('mock_nhat_ky') || '[]');
    return { ok: true, data: nhatKy, msg: 'Lấy nhật ký hệ thống thành công!' };
  }

  return { ok: true, data: null, msg: 'Thao tác thực hiện thành công' };
}

function themNhatKyHeThong(loai, noiDung) {
  const cur = layNguoiDungHienTai();
  const danhSach = JSON.parse(localStorage.getItem('mock_nhat_ky') || '[]');
  danhSach.unshift({
    id: Date.now(),
    thoiGian: new Date().toISOString(),
    nguoiThucHien: cur ? cur.tenDangNhap : 'HeThong',
    loaiNhatKy: loai,
    noiDung: noiDung
  });
  localStorage.setItem('mock_nhat_ky', JSON.stringify(danhSach.slice(0, 50)));
}

function themNhatKyPhanQuyen(hanhDong) {
  const cur = layNguoiDungHienTai();
  const danhSach = JSON.parse(localStorage.getItem('mock_lich_su_pq') || '[]');
  danhSach.unshift({
    id: Date.now(),
    nguoiThucHien: cur ? cur.tenDangNhap : 'admin',
    hanhDong: hanhDong,
    thoiGian: new Date().toISOString(),
    ghiChu: 'Cập nhật từ màn hình phân quyền quản trị'
  });
  localStorage.setItem('mock_lich_su_pq', JSON.stringify(danhSach));
}
