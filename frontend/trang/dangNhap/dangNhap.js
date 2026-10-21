/**
 * Trang Đăng nhập hệ thống (US-007, US-008)
 * - Đăng nhập tài khoản / mật khẩu
 * - Chuyển hướng theo đúng phân quyền vai trò (US-019, US-020, US-021)
 */
import { goiApi, luuPhienDangNhap } from '../../dungChung/api.js';
import { DUONG_DAN, VAI_TRO } from '../../dungChung/hangSo.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';

export function taoGiaoDienDangNhap() {
  return `
    <div class="trang-dang-nhap">
      <div class="hop-dang-nhap">
        <div class="dang-nhap-dau">
          <div class="dang-nhap-logo">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <h1 class="dang-nhap-tieu-de">ĐĂNG NHẬP HỆ THỐNG</h1>
          <p class="dang-nhap-mo-ta">Hệ thống Quản lý Nhà hàng & Gọi món QR - Quán Mộc</p>
        </div>

        <form id="form-dang-nhap" class="bieu-mau-dang-nhap">
          <div class="nhom-nhap-lieu">
            <label for="ten-dang-nhap" class="nhan-nhap-lieu">
              <i class="fa-solid fa-user"></i> Tên đăng nhập
            </label>
            <input 
              type="text" 
              id="ten-dang-nhap" 
              class="o-nhap-lieu" 
              placeholder="Nhập tên đăng nhập (ví dụ: admin)" 
              required 
              autocomplete="username"
            />
          </div>

          <div class="nhom-nhap-lieu">
            <label for="mat-khau" class="nhan-nhap-lieu">
              <i class="fa-solid fa-lock"></i> Mật khẩu
            </label>
            <div class="hop-o-mat-khau">
              <input 
                type="password" 
                id="mat-khau" 
                class="o-nhap-lieu" 
                placeholder="Nhập mật khẩu" 
                required 
                autocomplete="current-password"
              />
              <button type="button" class="nut-an-hien-mk" id="nut-an-hien-mk" title="Hiện/Ẩn mật khẩu">
                <i class="fa-solid fa-eye" id="icon-mat-khau"></i>
              </button>
            </div>
          </div>

          <div class="tuy-chon-dang-nhap">
            <label class="nhan-ghi-nho">
              <input type="checkbox" id="ghi-nho-dang-nhap" checked /> Ghi nhớ đăng nhập
            </label>
            <a href="javascript:void(0)" id="nut-quen-mat-khau" class="lien-ket-phu">Quên mật khẩu?</a>
          </div>

          <button type="submit" class="nut-bam nut-bam-chinh nut-rong" id="nut-submit-dang-nhap">
            <i class="fa-solid fa-right-to-bracket"></i> Đăng nhập
          </button>
        </form>

        <!-- HỘP HỖ TRỢ TRẢI NGHIỆM TÀI KHOẢN MẪU DÀNH CHO GIẢNG VIÊN / TESTER -->
        <div class="tai-khoan-mau-hop">
          <div class="tai-khoan-mau-tieu-de">
            <i class="fa-solid fa-key"></i> Tài khoản trải nghiệm nhanh (Mật khẩu: <b>123456</b>):
          </div>
          <div class="danh-sach-nut-mau">
            <button class="nut-tai-khoan-mau" data-user="admin" data-role="Quản lý">
              👑 Quản lý (admin)
            </button>
            <button class="nut-tai-khoan-mau" data-user="thungan01" data-role="Thu ngân">
              💳 Thu ngân (thungan01)
            </button>
            <button class="nut-tai-khoan-mau" data-user="bepchinh" data-role="Bếp">
              🍳 Đầu bếp (bepchinh)
            </button>
          </div>
        </div>

        <div class="dang-nhap-chan">
          <span>Hệ thống nội bộ Quán Mộc © 2026 - Sprint 1</span>
        </div>
      </div>
    </div>
  `;
}

export function ganSuKienDangNhap() {
  const form = document.getElementById('form-dang-nhap');
  const inputUser = document.getElementById('ten-dang-nhap');
  const inputPass = document.getElementById('mat-khau');
  const nutTogglePass = document.getElementById('nut-an-hien-mk');
  const iconPass = document.getElementById('icon-mat-khau');

  // Toggle ẩn/hiện mật khẩu
  if (nutTogglePass) {
    nutTogglePass.onclick = () => {
      const dangLaPass = inputPass.type === 'password';
      inputPass.type = dangLaPass ? 'text' : 'password';
      iconPass.className = dangLaPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    };
  }

  // Click vào tài khoản mẫu để điền nhanh
  const cacNutMau = document.querySelectorAll('.nut-tai-khoan-mau');
  cacNutMau.forEach(btn => {
    btn.onclick = () => {
      inputUser.value = btn.getAttribute('data-user');
      inputPass.value = '123456';
      hienThiThongBao(`Đã điền tài khoản: ${btn.getAttribute('data-role')}`, 'thong-tin', 1500);
    };
  });

  // Quên mật khẩu
  const nutQuenMk = document.getElementById('nut-quen-mat-khau');
  if (nutQuenMk) {
    nutQuenMk.onclick = () => {
      hienThiThongBao('Vui lòng liên hệ Quản lý nhà hàng (Admin) để đặt lại mật khẩu của bạn (US-013).', 'canh-bao', 5000);
    };
  }

  // Xử lý gửi form đăng nhập (US-007)
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const tenDangNhap = inputUser.value.trim();
      const matKhau = inputPass.value;

      if (!tenDangNhap || !matKhau) {
        hienThiThongBao('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!', 'canh-bao');
        return;
      }

      const nutSubmit = document.getElementById('nut-submit-dang-nhap');
      nutSubmit.disabled = true;
      nutSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xác thực...';

      const ketQua = await goiApi('/tai-khoan/dang-nhap', {
        method: 'POST',
        body: JSON.stringify({ tenDangNhap, matKhau })
      });

      nutSubmit.disabled = false;
      nutSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng nhập';

      if (ketQua.ok) {
        hienThiThongBao(ketQua.msg || 'Đăng nhập thành công!', 'thanh-cong');
        
        // Điều hướng theo vai trò (US-019, US-020, US-021)
        const vaiTro = ketQua.data.nguoiDung.vaiTro;
        if (vaiTro === VAI_TRO.BEP) {
          window.location.hash = DUONG_DAN.DIEU_PHOI_BEP;
        } else if (vaiTro === VAI_TRO.THU_NGAN) {
          window.location.hash = DUONG_DAN.SO_DO_BAN;
        } else {
          // Quản lý
          window.location.hash = DUONG_DAN.QUAN_LY_NHAN_VIEN;
        }
      } else {
        hienThiThongBao(ketQua.msg || 'Đăng nhập thất bại!', 'that-bai');
      }
    };
  }
}
