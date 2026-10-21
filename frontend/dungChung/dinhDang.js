/**
 * Các tiện ích định dạng dữ liệu hiển thị trên giao diện
 * Tuân thủ quy chuẩn: Tiếng Việt không dấu, camelCase
 */
import { TEN_VAI_TRO, TEN_TRANG_THAI_TAI_KHOAN, TRANG_THAI_TAI_KHOAN, VAI_TRO } from './hangSo.js';

/**
 * Định dạng số tiền sang chuẩn Việt Nam Đồng (VND)
 */
export function dinhDangTien(soTien = 0) {
  const giaTri = Number(soTien) || 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(giaTri);
}

/**
 * Định dạng ngày giờ chuẩn hiển thị DD/MM/YYYY HH:mm
 */
export function dinhDangNgayGio(chuoiThoiGian) {
  if (!chuoiThoiGian) return '—';
  const thoiGian = new Date(chuoiThoiGian);
  if (isNaN(thoiGian.getTime())) return chuoiThoiGian;

  const ngay = String(thoiGian.getDate()).padStart(2, '0');
  const thang = String(thoiGian.getMonth() + 1).padStart(2, '0');
  const nam = thoiGian.getFullYear();
  const gio = String(thoiGian.getHours()).padStart(2, '0');
  const phut = String(thoiGian.getMinutes()).padStart(2, '0');

  return `${ngay}/${thang}/${nam} ${gio}:${phut}`;
}

/**
 * Định dạng chỉ ngày DD/MM/YYYY
 */
export function dinhDangNgay(chuoiThoiGian) {
  if (!chuoiThoiGian) return '—';
  const thoiGian = new Date(chuoiThoiGian);
  if (isNaN(thoiGian.getTime())) return chuoiThoiGian;

  const ngay = String(thoiGian.getDate()).padStart(2, '0');
  const thang = String(thoiGian.getMonth() + 1).padStart(2, '0');
  const nam = thoiGian.getFullYear();

  return `${ngay}/${thang}/${nam}`;
}

/**
 * Trả về huy hiệu (badge HTML) thể hiện trạng thái tài khoản
 */
export function layHuyHieuTrangThaiTaiKhoan(trangThai) {
  const tenTrangThai = TEN_TRANG_THAI_TAI_KHOAN[trangThai] || trangThai;
  if (trangThai === TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG) {
    return `<span class="huy-hieu huy-hieu-thanh-cong"><i class="fa-solid fa-circle-check"></i> ${tenTrangThai}</span>`;
  }
  return `<span class="huy-hieu huy-hieu-nguy-hiem"><i class="fa-solid fa-lock"></i> ${tenTrangThai}</span>`;
}

/**
 * Trả về huy hiệu (badge HTML) thể hiện vai trò nhân viên
 */
export function layHuyHieuVaiTro(vaiTro) {
  const tenVaiTro = TEN_VAI_TRO[vaiTro] || vaiTro;
  let lopMau = 'huy-hieu-phu';

  switch (vaiTro) {
    case VAI_TRO.QUAN_LY:
      lopMau = 'huy-hieu-chinh';
      break;
    case VAI_TRO.THU_NGAN:
      lopMau = 'huy-hieu-thong-tin';
      break;
    case VAI_TRO.BEP:
      lopMau = 'huy-hieu-canh-bao';
      break;
    case VAI_TRO.PHUC_VU:
      lopMau = 'huy-hieu-thanh-cong';
      break;
  }

  return `<span class="huy-hieu ${lopMau}">${tenVaiTro}</span>`;
}

/**
 * Làm sạch chuỗi HTML chống XSS ở frontend
 */
export function lamSachChuoi(chuoi) {
  if (typeof chuoi !== 'string') return chuoi;
  return chuoi
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
