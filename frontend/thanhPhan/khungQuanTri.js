/**
 * Khung giao diện Quản trị (Admin Layout)
 * Đáp ứng US-003, US-004, US-019, US-020, US-021:
 * - Điều hướng theo vai trò (Role-based Sidebar)
 * - Header hiển thị hồ sơ cá nhân và nút đăng xuất
 */
import { DUONG_DAN, VAI_TRO, TEN_VAI_TRO } from '../dungChung/hangSo.js';
import { layNguoiDungHienTai, xoaPhienDangNhap } from '../dungChung/api.js';
import { layHuyHieuVaiTro } from '../dungChung/dinhDang.js';
import { moHopThoaiXacNhan } from './hopThoai.js';
import { hienThiThongBao } from './thongBao.js';

export function dungKhungQuanTri(noiDungTrangHtml, duongDanHienTai = '') {
  const nguoiDung = layNguoiDungHienTai() || {
    tenDangNhap: 'khach',
    hoTen: 'Người dùng',
    vaiTro: VAI_TRO.PHUC_VU
  };

  const vaiTro = nguoiDung.vaiTro;

  // Xây dựng danh sách menu theo quyền hạn (US-019, US-020, US-021)
  let danhSachMenu = [];

  if (vaiTro === VAI_TRO.QUAN_LY) {
    danhSachMenu = [
      {
        nhom: 'TỔNG QUAN & BÁN HÀNG',
        items: [
          { duongDan: DUONG_DAN.SO_DO_BAN, bieuTuong: 'fa-table-cells-large', tieuDe: 'Sơ đồ bàn & Thu ngân' },
          { duongDan: DUONG_DAN.DIEU_PHOI_BEP, bieuTuong: 'fa-fire-burner', tieuDe: 'Màn hình Bếp (KDS)' }
        ]
      },
      {
        nhom: 'QUẢN LÝ NHÂN SỰ & QUYỀN',
        items: [
          { duongDan: DUONG_DAN.QUAN_LY_NHAN_VIEN, bieuTuong: 'fa-users', tieuDe: 'Danh sách nhân viên' },
          { duongDan: DUONG_DAN.VAI_TRO_QUYEN, bieuTuong: 'fa-shield-halved', tieuDe: 'Vai trò & Phân quyền' },
          { duongDan: DUONG_DAN.LICH_SU_PHAN_QUYEN, bieuTuong: 'fa-clock-rotate-left', tieuDe: 'Lịch sử phân quyền' }
        ]
      },
      {
        nhom: 'CẤU HÌNH & HỆ THỐNG',
        items: [
          { duongDan: DUONG_DAN.CAU_HINH_NHA_HANG, bieuTuong: 'fa-sliders', tieuDe: 'Cấu hình nhà hàng' },
          { duongDan: DUONG_DAN.NHAT_KY_HE_THONG, bieuTuong: 'fa-clipboard-list', tieuDe: 'Nhật ký hệ thống (Logs)' }
        ]
      }
    ];
  } else if (vaiTro === VAI_TRO.BEP) {
    // US-019: Bếp chỉ truy cập đơn bếp
    danhSachMenu = [
      {
        nhom: 'NGHIỆP VỤ NHÀ BẾP',
        items: [
          { duongDan: DUONG_DAN.DIEU_PHOI_BEP, bieuTuong: 'fa-fire-burner', tieuDe: 'Màn hình điều phối Bếp (KDS)' }
        ]
      }
    ];
  } else if (vaiTro === VAI_TRO.THU_NGAN) {
    // US-020: Thu ngân chỉ truy cập thu tiền & bàn
    danhSachMenu = [
      {
        nhom: 'NGHIỆP VỤ THU NGÂN',
        items: [
          { duongDan: DUONG_DAN.SO_DO_BAN, bieuTuong: 'fa-table-cells-large', tieuDe: 'Sơ đồ bàn & Thanh toán' }
        ]
      }
    ];
  } else {
    // Phục vụ
    danhSachMenu = [
      {
        nhom: 'PHỤC VỤ BÀN',
        items: [
          { duongDan: DUONG_DAN.SO_DO_BAN, bieuTuong: 'fa-table-cells-large', tieuDe: 'Sơ đồ bàn phục vụ' }
        ]
      }
    ];
  }

  // Luôn có mục tài khoản cá nhân cho mọi vai trò
  danhSachMenu.push({
    nhom: 'TÀI KHOẢN CÁ NHÂN',
    items: [
      { duongDan: DUONG_DAN.HO_SO, bieuTuong: 'fa-id-card', tieuDe: 'Hồ sơ & Đổi mật khẩu' }
    ]
  });

  // Render menu HTML
  const menuHtml = danhSachMenu.map(nhom => `
    <div class="menu-nhom">
      <div class="menu-nhom-tieu-de">${nhom.nhom}</div>
      <ul class="menu-danh-sach">
        ${nhom.items.map(item => {
          const kichHoat = duongDanHienTai === item.duongDan ? 'kich-hoat' : '';
          return `
            <li class="menu-muc">
              <a href="${item.duongDan}" class="menu-lien-ket ${kichHoat}">
                <i class="fa-solid ${item.bieuTuong} menu-bieu-tuong"></i>
                <span class="menu-chu">${item.tieuDe}</span>
              </a>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `).join('');

  return `
    <div class="khung-quan-tri" id="khung-quan-tri">
      <!-- THANH ĐIỀU HƯỚNG BÊN TRÁI (SIDEBAR) -->
      <aside class="thanh-ben" id="thanh-ben">
        <div class="thanh-ben-dau">
          <div class="logo-nha-hang">
            <i class="fa-solid fa-utensils logo-bieu-tuong"></i>
            <div class="logo-chu">
              <span class="logo-ten">QUÁN MỘC</span>
              <span class="logo-phu">Hệ thống quản lý QR</span>
            </div>
          </div>
          <button class="nut-dong-thanh-ben" id="nut-dong-thanh-ben" title="Thu gọn">&times;</button>
        </div>

        <nav class="thanh-ben-than">
          ${menuHtml}
        </nav>

        <div class="thanh-ben-chan">
          <div class="thong-tin-nhan-vien">
            <div class="anh-dai-dien">${nguoiDung.hoTen ? nguoiDung.hoTen.charAt(0).toUpperCase() : 'U'}</div>
            <div class="chi-tiet-nhan-vien">
              <div class="ten-nhan-vien">${nguoiDung.hoTen || nguoiDung.tenDangNhap}</div>
              <div class="vai-tro-nhan-vien">${layHuyHieuVaiTro(nguoiDung.vaiTro)}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- PHẦN CHÍNH (HEADER & NỘI DUNG) -->
      <div class="khu-vuc-chinh">
        <!-- HEADER -->
        <header class="thanh-dau">
          <div class="thanh-dau-trai">
            <button class="nut-mo-thanh-ben" id="nut-mo-thanh-ben">
              <i class="fa-solid fa-bars"></i>
            </button>
            <div class="thanh-dau-tieu-de-trang">
              <h2 id="tieu-de-trang-hien-tai">Trang quản trị</h2>
            </div>
          </div>

          <div class="thanh-dau-phai">
            <div class="hop-nguoi-dung">
              <a href="${DUONG_DAN.HO_SO}" class="nut-ho-so" title="Xem hồ sơ cá nhân">
                <i class="fa-solid fa-user-gear"></i>
                <span class="an-mobile">${nguoiDung.hoTen || nguoiDung.tenDangNhap}</span>
              </a>
              <button class="nut-dang-xuat" id="nut-dang-xuat-header" title="Đăng xuất khỏi hệ thống">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span class="an-mobile">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        <!-- VÙNG NỘI DUNG CHÍNH -->
        <main class="vung-noi-dung" id="vung-noi-dung-chinh">
          ${noiDungTrangHtml}
        </main>
      </div>
    </div>
  `;
}

/**
 * Gắn các sự kiện tương tác cho khung Admin Layout
 */
export function ganSuKienKhungQuanTri() {
  const nutDangXuat = document.getElementById('nut-dang-xuat-header');
  if (nutDangXuat) {
    nutDangXuat.onclick = async () => {
      const xacNhan = await moHopThoaiXacNhan({
        tieuDe: 'Đăng xuất khỏi hệ thống',
        noiDung: 'Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại không?',
        chuXacNhan: 'Đăng xuất',
        loai: 'nguy-hiem'
      });

      if (xacNhan) {
        xoaPhienDangNhap();
        hienThiThongBao('Đăng xuất thành công!', 'thanh-cong');
        window.location.hash = DUONG_DAN.DANG_NHAP;
      }
    };
  }

  // Xử lý đóng/mở sidebar trên màn hình di động/tablet
  const nutMoSidebar = document.getElementById('nut-mo-thanh-ben');
  const nutDongSidebar = document.getElementById('nut-dong-thanh-ben');
  const thanhBen = document.getElementById('thanh-ben');

  if (nutMoSidebar && thanhBen) {
    nutMoSidebar.onclick = () => {
      thanhBen.classList.add('hien-thi-mobile');
    };
  }
  if (nutDongSidebar && thanhBen) {
    nutDongSidebar.onclick = () => {
      thanhBen.classList.remove('hien-thi-mobile');
    };
  }
}
