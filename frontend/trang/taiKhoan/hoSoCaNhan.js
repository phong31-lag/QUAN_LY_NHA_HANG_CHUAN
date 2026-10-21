/**
 * Màn hình Hồ sơ cá nhân & Đổi mật khẩu (US-009, US-010)
 */
import { layNguoiDungHienTai, goiApi } from '../../dungChung/api.js';
import { layHuyHieuVaiTro, dinhDangNgayGio } from '../../dungChung/dinhDang.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';

export function taoGiaoDienHoSo() {
  const nguoiDung = layNguoiDungHienTai() || {};

  return `
    <div class="trang-ho-so">
      <div class="the-tieu-de-trang">
        <div>
          <h2 class="tieu-de-chinh"><i class="fa-solid fa-id-card-clip"></i> Tài khoản của tôi</h2>
          <p class="mo-ta-phu">Quản lý thông tin hồ sơ cá nhân và bảo mật tài khoản</p>
        </div>
      </div>

      <div class="luoi-ho-so">
        <!-- CỘT TRÁI: THẺ TÓM TẮT THÔNG TIN -->
        <div class="khung-the the-tom-tat-tai-khoan">
          <div class="avatar-lon">
            ${nguoiDung.hoTen ? nguoiDung.hoTen.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3 class="ten-lon">${nguoiDung.hoTen || nguoiDung.tenDangNhap}</h3>
          <p class="user-phu">@${nguoiDung.tenDangNhap || 'nguoidung'}</p>
          <div class="vai-tro-hop">${layHuyHieuVaiTro(nguoiDung.vaiTro)}</div>

          <div class="duong-ke-ngang"></div>

          <div class="chi-tiet-nhanh">
            <div class="dong-thong-tin">
              <span class="nhan"><i class="fa-solid fa-phone"></i> Điện thoại:</span>
              <span class="gia-tri">${nguoiDung.soDienThoai || 'Chưa cập nhật'}</span>
            </div>
            <div class="dong-thong-tin">
              <span class="nhan"><i class="fa-solid fa-envelope"></i> Email:</span>
              <span class="gia-tri">${nguoiDung.email || 'Chưa cập nhật'}</span>
            </div>
            <div class="dong-thong-tin">
              <span class="nhan"><i class="fa-solid fa-calendar"></i> Ngày tham gia:</span>
              <span class="gia-tri">${dinhDangNgayGio(nguoiDung.ngayTao)}</span>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI: FORM CHỈNH SỬA & FORM ĐỔI MẬT KHẨU -->
        <div class="khung-the the-form-tai-khoan">
          <div class="thanh-chuyen-tab">
            <button class="nut-tab kich-hoat" id="tab-ho-so"><i class="fa-solid fa-user-pen"></i> Thông tin hồ sơ (US-010)</button>
            <button class="nut-tab" id="tab-mat-khau"><i class="fa-solid fa-key"></i> Đổi mật khẩu (US-009)</button>
          </div>

          <!-- TAB 1: FORM CẬP NHẬT HỒ SƠ -->
          <div class="noi-dung-tab kich-hoat" id="vung-tab-ho-so">
            <form id="form-cap-nhat-ho-so" class="bieu-mau">
              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu">Tên đăng nhập</label>
                <input type="text" class="o-nhap-lieu o-khoa" value="${nguoiDung.tenDangNhap || ''}" disabled />
                <small class="chu-thich">Tên đăng nhập không thể thay đổi</small>
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="ho-ten">Họ và tên *</label>
                <input type="text" id="ho-ten" class="o-nhap-lieu" value="${nguoiDung.hoTen || ''}" required />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="so-dien-thoai">Số điện thoại *</label>
                <input type="tel" id="so-dien-thoai" class="o-nhap-lieu" value="${nguoiDung.soDienThoai || ''}" required />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="email">Địa chỉ Email</label>
                <input type="email" id="email" class="o-nhap-lieu" value="${nguoiDung.email || ''}" />
              </div>

              <div class="nut-thao-tac">
                <button type="submit" class="nut-bam nut-bam-chinh" id="nut-luu-ho-so">
                  <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi hồ sơ
                </button>
              </div>
            </form>
          </div>

          <!-- TAB 2: FORM ĐỔI MẬT KHẨU -->
          <div class="noi-dung-tab" id="vung-tab-mat-khau">
            <form id="form-doi-mat-khau" class="bieu-mau">
              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="mat-khau-hien-tai">Mật khẩu hiện tại *</label>
                <input type="password" id="mat-khau-hien-tai" class="o-nhap-lieu" placeholder="Nhập mật khẩu đang dùng" required />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="mat-khau-moi">Mật khẩu mới *</label>
                <input type="password" id="mat-khau-moi" class="o-nhap-lieu" placeholder="Tối thiểu 6 ký tự" required minlength="6" />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="xac-nhan-mat-khau">Xác nhận mật khẩu mới *</label>
                <input type="password" id="xac-nhan-mat-khau" class="o-nhap-lieu" placeholder="Nhập lại mật khẩu mới" required minlength="6" />
              </div>

              <div class="nut-thao-tac">
                <button type="submit" class="nut-bam nut-bam-chinh" id="nut-luu-mat-khau">
                  <i class="fa-solid fa-lock"></i> Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function ganSuKienHoSo() {
  const tabHoSo = document.getElementById('tab-ho-so');
  const tabMatKhau = document.getElementById('tab-mat-khau');
  const vungHoSo = document.getElementById('vung-tab-ho-so');
  const vungMatKhau = document.getElementById('vung-tab-mat-khau');

  if (tabHoSo && tabMatKhau) {
    tabHoSo.onclick = () => {
      tabHoSo.classList.add('kich-hoat');
      tabMatKhau.classList.remove('kich-hoat');
      vungHoSo.classList.add('kich-hoat');
      vungMatKhau.classList.remove('kich-hoat');
    };

    tabMatKhau.onclick = () => {
      tabMatKhau.classList.add('kich-hoat');
      tabHoSo.classList.remove('kich-hoat');
      vungMatKhau.classList.add('kich-hoat');
      vungHoSo.classList.remove('kich-hoat');
    };
  }

  // Xử lý cập nhật hồ sơ (US-010)
  const formHoSo = document.getElementById('form-cap-nhat-ho-so');
  if (formHoSo) {
    formHoSo.onsubmit = async (e) => {
      e.preventDefault();
      const hoTen = document.getElementById('ho-ten').value.trim();
      const soDienThoai = document.getElementById('so-dien-thoai').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!hoTen || !soDienThoai) {
        hienThiThongBao('Vui lòng điền đủ họ tên và số điện thoại!', 'canh-bao');
        return;
      }

      const res = await goiApi('/tai-khoan/cap-nhat-ho-so', {
        method: 'PUT',
        body: JSON.stringify({ hoTen, soDienThoai, email })
      });

      if (res.ok) {
        hienThiThongBao(res.msg || 'Cập nhật thông tin thành công!', 'thanh-cong');
        // Refresh lại giao diện
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        hienThiThongBao(res.msg || 'Cập nhật thất bại!', 'that-bai');
      }
    };
  }

  // Xử lý đổi mật khẩu (US-009)
  const formMatKhau = document.getElementById('form-doi-mat-khau');
  if (formMatKhau) {
    formMatKhau.onsubmit = async (e) => {
      e.preventDefault();
      const matKhauCu = document.getElementById('mat-khau-hien-tai').value;
      const matKhauMoi = document.getElementById('mat-khau-moi').value;
      const xacNhan = document.getElementById('xac-nhan-mat-khau').value;

      if (matKhauMoi !== xacNhan) {
        hienThiThongBao('Xác nhận mật khẩu mới không trùng khớp!', 'canh-bao');
        return;
      }

      const res = await goiApi('/tai-khoan/doi-mat-khau', {
        method: 'POST',
        body: JSON.stringify({ matKhauCu, matKhauMoi })
      });

      if (res.ok) {
        hienThiThongBao(res.msg || 'Đổi mật khẩu thành công!', 'thanh-cong');
        formMatKhau.reset();
      } else {
        hienThiThongBao(res.msg || 'Đổi mật khẩu thất bại!', 'that-bai');
      }
    };
  }
}
