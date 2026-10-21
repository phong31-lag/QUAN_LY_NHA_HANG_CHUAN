/**
 * Các hằng số dùng chung trong hệ thống Frontend Quản lý Nhà hàng
 * Tuân thủ quy chuẩn: Tiếng Việt không dấu, camelCase
 */

export const VAI_TRO = {
  QUAN_LY: 'QUAN_LY',
  THU_NGAN: 'THU_NGAN',
  BEP: 'BEP',
  PHUC_VU: 'PHUC_VU'
};

export const TEN_VAI_TRO = {
  QUAN_LY: 'Quản lý / Chủ quán',
  THU_NGAN: 'Thu ngân',
  BEP: 'Đầu bếp',
  PHUC_VU: 'Phục vụ bàn'
};

export const TRANG_THAI_TAI_KHOAN = {
  DANG_HOAT_DONG: 'DANG_HOAT_DONG',
  DA_KHOA: 'DA_KHOA'
};

export const TEN_TRANG_THAI_TAI_KHOAN = {
  DANG_HOAT_DONG: 'Đang hoạt động',
  DA_KHOA: 'Đã khóa'
};

export const QUYEN_HAN = {
  XEM_DON_BEP: 'xem_don_bep',
  XU_LY_DON_BEP: 'xu_ly_don_bep',
  XEM_SO_DO_BAN: 'xem_so_do_ban',
  THU_TIEN_IN_HOA_DON: 'thu_tien_in_hoa_don',
  CHINH_SUA_THUC_DON: 'chinh_sua_thuc_don',
  XEM_BAO_CAO_DOANH_THU: 'xem_bao_cao_doanh_thu',
  QUAN_LY_NHAN_SU: 'quan_ly_nhan_su',
  PHAN_QUYEN_VAI_TRO: 'phan_quyen_vai_tro',
  CAU_HINH_NHA_HANG: 'cau_hinh_nha_hang',
  XEM_NHAT_KY_HE_THONG: 'xem_nhat_ky_he_thong'
};

export const DANH_MUC_QUYEN = [
  {
    nhom: 'Nghiệp vụ Nhà bếp (KDS)',
    danhSach: [
      { ma: QUYEN_HAN.XEM_DON_BEP, ten: 'Xem danh sách món cần chế biến (KDS)' },
      { ma: QUYEN_HAN.XU_LY_DON_BEP, ten: 'Cập nhật trạng thái món (Đang nấu / Đã xong / Báo hết)' }
    ]
  },
  {
    nhom: 'Nghiệp vụ Thu ngân (POS)',
    danhSach: [
      { ma: QUYEN_HAN.XEM_SO_DO_BAN, ten: 'Xem sơ đồ bàn và chi tiết đơn gọi món' },
      { ma: QUYEN_HAN.THU_TIEN_IN_HOA_DON, ten: 'Thu tiền, áp dụng ưu đãi và xuất hóa đơn' }
    ]
  },
  {
    nhom: 'Quản lý Thực đơn & Doanh thu',
    danhSach: [
      { ma: QUYEN_HAN.CHINH_SUA_THUC_DON, ten: 'Thêm, sửa, xóa món ăn và danh mục thực đơn' },
      { ma: QUYEN_HAN.XEM_BAO_CAO_DOANH_THU, ten: 'Xem báo cáo doanh thu và phân tích kinh doanh' }
    ]
  },
  {
    nhom: 'Quản trị Hệ thống & Nhân sự',
    danhSach: [
      { ma: QUYEN_HAN.QUAN_LY_NHAN_SU, ten: 'Quản lý tài khoản và hồ sơ nhân viên' },
      { ma: QUYEN_HAN.PHAN_QUYEN_VAI_TRO, ten: 'Phân quyền và cấu hình vai trò nhân sự' },
      { ma: QUYEN_HAN.CAU_HINH_NHA_HANG, ten: 'Cấu hình thông tin quán, thuế VAT, VietQR' },
      { ma: QUYEN_HAN.XEM_NHAT_KY_HE_THONG, ten: 'Tra cứu nhật ký hoạt động hệ thống (System Logs)' }
    ]
  }
];

export const DUONG_DAN = {
  DANG_NHAP: '#/dang-nhap',
  HO_SO: '#/ho-so',
  QUAN_LY_NHAN_VIEN: '#/nhan-vien',
  VAI_TRO_QUYEN: '#/vai-tro-quyen',
  LICH_SU_PHAN_QUYEN: '#/lich-su-phan-quyen',
  CAU_HINH_NHA_HANG: '#/cau-hinh-nha-hang',
  NHAT_KY_HE_THONG: '#/nhat-ky-he-thong',
  // Các route dành riêng cho Bếp và Thu ngân (liên kết hiển thị theo US-019, US-020)
  DIEU_PHOI_BEP: '#/dieu-phoi-bep',
  SO_DO_BAN: '#/so-do-ban'
};

export const KHOA_LUU_TRU = {
  TOKEN: 'nha_hang_token',
  REFRESH_TOKEN: 'nha_hang_refresh_token',
  NGUOI_DUNG: 'nha_hang_nguoi_dung',
  GHI_NHO_DANG_NHAP: 'nha_hang_ghi_nho_dang_nhap'
};
