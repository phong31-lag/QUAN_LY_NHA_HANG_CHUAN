/**
 * Bộ định tuyến điều hướng SPA & Kiểm soát quyền truy cập (Route Guard)
 * Đáp ứng US-003, US-004, US-019, US-020, US-021:
 * - Chặn truy cập trái phép khi chưa đăng nhập (US-004)
 * - Tự động chuyển hướng hoặc bảo vệ route theo vai trò (US-019, US-020, US-021)
 */
import { DUONG_DAN, VAI_TRO } from '../dungChung/hangSo.js';
import { layToken, layNguoiDungHienTai } from '../dungChung/api.js';
import { dungKhungQuanTri, ganSuKienKhungQuanTri } from '../thanhPhan/khungQuanTri.js';
import { taoGiaoDienDangNhap, ganSuKienDangNhap } from '../trang/dangNhap/dangNhap.js';
import { taoGiaoDienHoSo, ganSuKienHoSo } from '../trang/taiKhoan/hoSoCaNhan.js';
import { taoGiaoDienNhanVien, ganSuKienNhanVien } from '../trang/nhanVien/quanLyNhanVien.js';
import { taoGiaoDienVaiTro, ganSuKienVaiTro } from '../trang/quanTri/vaiTroVaQuyen.js';
import { taoGiaoDienLichSuPhanQuyen, ganSuKienLichSuPhanQuyen } from '../trang/quanTri/lichSuPhanQuyen.js';
import { taoGiaoDienCauHinh, ganSuKienCauHinh } from '../trang/quanTri/cauHinhNhaHang.js';
import { taoGiaoDienNhatKy, ganSuKienNhatKy } from '../trang/quanTri/nhatKyHeThong.js';
import { hienThiThongBao } from '../thanhPhan/thongBao.js';

export function khoiTaoBoDinhTuyen() {
  window.addEventListener('hashchange', xuLyDieuHuong);
  window.addEventListener('load', xuLyDieuHuong);
}

export async function xuLyDieuHuong() {
  const hash = window.location.hash || DUONG_DAN.DANG_NHAP;
  const token = layToken();
  const nguoiDung = layNguoiDungHienTai();
  const gocApp = document.getElementById('ung-dung');

  if (!gocApp) return;

  // ROUTE 1: TRANG ĐĂNG NHẬP
  if (hash === DUONG_DAN.DANG_NHAP) {
    // Nếu đã đăng nhập thì chuyển vào trang tương ứng vai trò
    if (token && nguoiDung) {
      dieuHuongTheoVaiTro(nguoiDung.vaiTro);
      return;
    }
    gocApp.innerHTML = taoGiaoDienDangNhap();
    ganSuKienDangNhap();
    return;
  }

  // BẢO VỆ ROUTE (US-004): Chưa đăng nhập thì chặn và chuyển hướng về đăng nhập
  if (!token || !nguoiDung) {
    hienThiThongBao('Vui lòng đăng nhập để truy cập chức năng này (US-004)!', 'canh-bao');
    window.location.hash = DUONG_DAN.DANG_NHAP;
    return;
  }

  // KIỂM TRA PHÂN QUYỀN TRUY CẬP THEO VAI TRÒ (US-019, US-020, US-021)
  const vaiTro = nguoiDung.vaiTro;

  // Route chỉ dành cho Quản lý (US-021)
  const routeChiQuanLy = [
    DUONG_DAN.QUAN_LY_NHAN_VIEN,
    DUONG_DAN.VAI_TRO_QUYEN,
    DUONG_DAN.LICH_SU_PHAN_QUYEN,
    DUONG_DAN.CAU_HINH_NHA_HANG,
    DUONG_DAN.NHAT_KY_HE_THONG
  ];

  if (routeChiQuanLy.includes(hash) && vaiTro !== VAI_TRO.QUAN_LY) {
    hienThiThongBao('Bạn không có quyền truy cập vào chức năng quản trị này (US-021)!', 'that-bai');
    dieuHuongTheoVaiTro(vaiTro);
    return;
  }

  // RENDER GIAO DIỆN CỦA TỪNG TRANG
  let noiDungHtml = '';
  let ganSuKienTrang = null;
  let tieuDeTrang = 'Hệ thống Quản lý';

  switch (hash) {
    case DUONG_DAN.HO_SO:
      tieuDeTrang = 'Hồ sơ cá nhân & Bảo mật';
      noiDungHtml = taoGiaoDienHoSo();
      ganSuKienTrang = ganSuKienHoSo;
      break;

    case DUONG_DAN.QUAN_LY_NHAN_VIEN:
      tieuDeTrang = 'Quản lý Nhân sự & Tài khoản';
      noiDungHtml = taoGiaoDienNhanVien();
      ganSuKienTrang = ganSuKienNhanVien;
      break;

    case DUONG_DAN.VAI_TRO_QUYEN:
      tieuDeTrang = 'Vai trò & Phân quyền chức năng';
      noiDungHtml = taoGiaoDienVaiTro();
      ganSuKienTrang = ganSuKienVaiTro;
      break;

    case DUONG_DAN.LICH_SU_PHAN_QUYEN:
      tieuDeTrang = 'Lịch sử phân quyền nhân sự';
      noiDungHtml = taoGiaoDienLichSuPhanQuyen();
      ganSuKienTrang = ganSuKienLichSuPhanQuyen;
      break;

    case DUONG_DAN.CAU_HINH_NHA_HANG:
      tieuDeTrang = 'Cấu hình thông tin & VietQR';
      noiDungHtml = taoGiaoDienCauHinh();
      ganSuKienTrang = ganSuKienCauHinh;
      break;

    case DUONG_DAN.NHAT_KY_HE_THONG:
      tieuDeTrang = 'Nhật ký hoạt động (System Logs)';
      noiDungHtml = taoGiaoDienNhatKy();
      ganSuKienTrang = ganSuKienNhatKy;
      break;

    // Các route màn hình Bếp / Sơ đồ bàn (phần giao thoa phân luồng US-019, US-020)
    case DUONG_DAN.DIEU_PHOI_BEP:
      tieuDeTrang = 'Màn hình điều phối Bếp (KDS)';
      noiDungHtml = `
        <div class="khung-the chu-can-giua" style="padding: 40px;">
          <i class="fa-solid fa-fire-burner" style="font-size: 50px; color: var(--mau-chinh); margin-bottom: 15px;"></i>
          <h2>Màn hình Điều phối Bếp (KDS) - US-019</h2>
          <p class="mo-ta-phu" style="margin-top: 10px;">
            Đã phân luồng thành công quyền cho tài khoản Bếp (<b>${nguoiDung.tenDangNhap}</b>).<br/>
            (Phần giao diện danh sách món gọi và cập nhật nấu món do thành viên <b>Quân</b> hoàn thiện).
          </p>
        </div>
      `;
      break;

    case DUONG_DAN.SO_DO_BAN:
      tieuDeTrang = 'Sơ đồ bàn & Thu ngân (POS)';
      noiDungHtml = `
        <div class="khung-the chu-can-giua" style="padding: 40px;">
          <i class="fa-solid fa-table-cells-large" style="font-size: 50px; color: var(--mau-thong-tin); margin-bottom: 15px;"></i>
          <h2>Sơ đồ Bàn & Điểm bán hàng (POS) - US-020</h2>
          <p class="mo-ta-phu" style="margin-top: 10px;">
            Đã phân luồng thành công quyền cho tài khoản Thu ngân (<b>${nguoiDung.tenDangNhap}</b>).<br/>
            (Phần giao diện lưới bàn và hóa đơn do thành viên <b>Quân</b> hoàn thiện).
          </p>
        </div>
      `;
      break;

    default:
      dieuHuongTheoVaiTro(vaiTro);
      return;
  }

  // Bọc trong Admin Layout
  gocApp.innerHTML = dungKhungQuanTri(noiDungHtml, hash);
  const elTieuDe = document.getElementById('tieu-de-trang-hien-tai');
  if (elTieuDe) elTieuDe.innerText = tieuDeTrang;

  ganSuKienKhungQuanTri();
  if (ganSuKienTrang) {
    ganSuKienTrang();
  }
}

function dieuHuongTheoVaiTro(vaiTro) {
  if (vaiTro === VAI_TRO.BEP) {
    window.location.hash = DUONG_DAN.DIEU_PHOI_BEP;
  } else if (vaiTro === VAI_TRO.THU_NGAN) {
    window.location.hash = DUONG_DAN.SO_DO_BAN;
  } else {
    window.location.hash = DUONG_DAN.QUAN_LY_NHAN_VIEN;
  }
}
