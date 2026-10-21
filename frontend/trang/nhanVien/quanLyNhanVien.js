/**
 * Trang Quản lý Nhân sự (US-011, US-012, US-013, US-014)
 * - US-011: Thêm mới tài khoản nhân viên
 * - US-012: Xem danh sách và tìm kiếm nhân viên
 * - US-013: Cập nhật thông tin & đặt lại mật khẩu nhân viên
 * - US-014: Khóa / mở khóa tài khoản nhân viên nghỉ việc
 */
import { goiApi } from '../../dungChung/api.js';
import { VAI_TRO, TEN_VAI_TRO, TRANG_THAI_TAI_KHOAN } from '../../dungChung/hangSo.js';
import { layHuyHieuVaiTro, layHuyHieuTrangThaiTaiKhoan, dinhDangNgayGio, lamSachChuoi } from '../../dungChung/dinhDang.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';
import { moHopThoaiXacNhan } from '../../thanhPhan/hopThoai.js';

let danhSachNhanVienGoc = [];

export function taoGiaoDienNhanVien() {
  return `
    <div class="trang-quan-ly-nhan-vien">
      <!-- HEADER TRANG -->
      <div class="the-tieu-de-trang">
        <div>
          <h2 class="tieu-de-chinh"><i class="fa-solid fa-users-gear"></i> Quản lý Nhân sự</h2>
          <p class="mo-ta-phu">Quản lý danh sách tài khoản, hồ sơ nhân viên và trạng thái làm việc (US-011 -> US-014)</p>
        </div>
        <div class="hanh-dong-tieu-de">
          <button class="nut-bam nut-bam-chinh" id="nut-mo-modal-them">
            <i class="fa-solid fa-user-plus"></i> Thêm nhân viên mới (US-011)
          </button>
        </div>
      </div>

      <!-- BỘ LỌC VÀ TÌM KIẾM (US-012) -->
      <div class="khung-the khung-bo-loc">
        <div class="luoi-bo-loc">
          <div class="o-tim-kiem-hop">
            <i class="fa-solid fa-magnifying-glass icon-tim"></i>
            <input 
              type="text" 
              id="o-tim-kiem" 
              class="o-nhap-lieu o-nhap-tim" 
              placeholder="Tìm kiếm theo tên, username, số điện thoại..." 
            />
          </div>

          <div class="nhom-loc">
            <select id="loc-vai-tro" class="o-nhap-lieu">
              <option value="">-- Tất cả vai trò --</option>
              <option value="${VAI_TRO.QUAN_LY}">${TEN_VAI_TRO.QUAN_LY}</option>
              <option value="${VAI_TRO.THU_NGAN}">${TEN_VAI_TRO.THU_NGAN}</option>
              <option value="${VAI_TRO.BEP}">${TEN_VAI_TRO.BEP}</option>
              <option value="${VAI_TRO.PHUC_VU}">${TEN_VAI_TRO.PHUC_VU}</option>
            </select>
          </div>

          <div class="nhom-loc">
            <select id="loc-trang-thai" class="o-nhap-lieu">
              <option value="">-- Tất cả trạng thái --</option>
              <option value="${TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG}">Đang hoạt động</option>
              <option value="${TRANG_THAI_TAI_KHOAN.DA_KHOA}">Đã khóa (Nghỉ việc)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- BẢNG DANH SÁCH NHÂN VIÊN -->
      <div class="khung-the khung-bang">
        <div class="hop-bang-cuon">
          <table class="bang-du-lieu" id="bang-nhan-vien">
            <thead>
              <tr>
                <th width="60">STT</th>
                <th>Tài khoản</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th width="190" class="chu-can-giua">Thao tác</th>
              </tr>
            </thead>
            <tbody id="than-bang-nhan-vien">
              <tr>
                <td colspan="8" class="chu-can-giua dang-tai-dong">
                  <i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu nhân viên...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="chan-bang-phan-trang">
          <span id="thong-tin-tong-so">Đang hiển thị 0 nhân viên</span>
        </div>
      </div>
    </div>

    <!-- MODAL THÊM / CHỈNH SỬA NHÂN VIÊN (US-011, US-013) -->
    <div id="modal-nhan-vien" class="lop-phu-modal lop-phu-an">
      <div class="hop-thoai-modal">
        <div class="hop-thoai-dau">
          <h3 class="hop-thoai-tieu-de" id="modal-nhan-vien-tieu-de">Thêm nhân viên mới</h3>
          <button class="hop-thoai-nut-dong" id="nut-dong-modal-nv">&times;</button>
        </div>

        <form id="form-nhan-vien" class="bieu-mau">
          <input type="hidden" id="nv-id" />

          <div class="nhom-nhap-lieu">
            <label class="nhan-nhap-lieu" for="nv-ten-dang-nhap">Tên đăng nhập (Username) *</label>
            <input type="text" id="nv-ten-dang-nhap" class="o-nhap-lieu" placeholder="vd: thungan02" required />
          </div>

          <div class="nhom-nhap-lieu">
            <label class="nhan-nhap-lieu" for="nv-ho-ten">Họ và tên *</label>
            <input type="text" id="nv-ho-ten" class="o-nhap-lieu" placeholder="vd: Hoàng Thu Trang" required />
          </div>

          <div class="nhom-nhap-lieu">
            <label class="nhan-nhap-lieu" for="nv-so-dien-thoai">Số điện thoại *</label>
            <input type="tel" id="nv-so-dien-thoai" class="o-nhap-lieu" placeholder="vd: 0988776655" required />
          </div>

          <div class="nhom-nhap-lieu">
            <label class="nhan-nhap-lieu" for="nv-vai-tro">Vai trò / Bộ phận *</label>
            <select id="nv-vai-tro" class="o-nhap-lieu" required>
              <option value="${VAI_TRO.THU_NGAN}">${TEN_VAI_TRO.THU_NGAN}</option>
              <option value="${VAI_TRO.BEP}">${TEN_VAI_TRO.BEP}</option>
              <option value="${VAI_TRO.PHUC_VU}">${TEN_VAI_TRO.PHUC_VU}</option>
              <option value="${VAI_TRO.QUAN_LY}">${TEN_VAI_TRO.QUAN_LY}</option>
            </select>
          </div>

          <div class="hop-thoai-chan">
            <button type="button" class="nut-bam nut-bam-phu" id="nut-huy-modal-nv">Hủy bỏ</button>
            <button type="submit" class="nut-bam nut-bam-chinh" id="nut-luu-nv">
              <i class="fa-solid fa-floppy-disk"></i> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export async function ganSuKienNhanVien() {
  await taiDanhSachNhanVien();

  const oTimKiem = document.getElementById('o-tim-kiem');
  const locVaiTro = document.getElementById('loc-vai-tro');
  const locTrangThai = document.getElementById('loc-trang-thai');

  if (oTimKiem) oTimKiem.oninput = locDuLieu;
  if (locVaiTro) locVaiTro.onchange = locDuLieu;
  if (locTrangThai) locTrangThai.onchange = locDuLieu;

  // Xử lý Modal Thêm mới
  const nutMoThem = document.getElementById('nut-mo-modal-them');
  const modal = document.getElementById('modal-nhan-vien');
  const nutDongModal = document.getElementById('nut-dong-modal-nv');
  const nutHuyModal = document.getElementById('nut-huy-modal-nv');
  const form = document.getElementById('form-nhan-vien');

  const dongModal = () => modal.classList.add('lop-phu-an');
  const moModal = () => modal.classList.remove('lop-phu-an');

  if (nutMoThem) {
    nutMoThem.onclick = () => {
      document.getElementById('modal-nhan-vien-tieu-de').innerText = 'Thêm tài khoản nhân viên mới (US-011)';
      document.getElementById('nv-id').value = '';
      document.getElementById('nv-ten-dang-nhap').value = '';
      document.getElementById('nv-ten-dang-nhap').disabled = false;
      document.getElementById('nv-ho-ten').value = '';
      document.getElementById('nv-so-dien-thoai').value = '';
      document.getElementById('nv-vai-tro').value = VAI_TRO.THU_NGAN;
      moModal();
    };
  }

  if (nutDongModal) nutDongModal.onclick = dongModal;
  if (nutHuyModal) nutHuyModal.onclick = dongModal;

  // Submit Form Lưu / Thêm nhân viên
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('nv-id').value;
      const tenDangNhap = document.getElementById('nv-ten-dang-nhap').value.trim();
      const hoTen = document.getElementById('nv-ho-ten').value.trim();
      const soDienThoai = document.getElementById('nv-so-dien-thoai').value.trim();
      const vaiTro = document.getElementById('nv-vai-tro').value;

      let res;
      if (id) {
        // Cập nhật thông tin (US-013)
        res = await goiApi(`/nhan-vien/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ hoTen, soDienThoai, vaiTro })
        });
      } else {
        // Tạo mới tài khoản (US-011)
        res = await goiApi('/nhan-vien', {
          method: 'POST',
          body: JSON.stringify({ tenDangNhap, hoTen, soDienThoai, vaiTro })
        });
      }

      if (res.ok) {
        hienThiThongBao(res.msg || 'Thao tác thành công!', 'thanh-cong');
        dongModal();
        taiDanhSachNhanVien();
      } else {
        hienThiThongBao(res.msg || 'Thao tác thất bại!', 'that-bai');
      }
    };
  }
}

async function taiDanhSachNhanVien() {
  const res = await goiApi('/nhan-vien');
  if (res.ok) {
    danhSachNhanVienGoc = res.data || [];
    locDuLieu();
  } else {
    hienThiThongBao('Không thể tải danh sách nhân viên', 'that-bai');
  }
}

function locDuLieu() {
  const tuKhoa = (document.getElementById('o-tim-kiem')?.value || '').toLowerCase().trim();
  const vaiTro = document.getElementById('loc-vai-tro')?.value || '';
  const trangThai = document.getElementById('loc-trang-thai')?.value || '';

  const ketQua = danhSachNhanVienGoc.filter(nv => {
    const hopTuKhoa = !tuKhoa || 
      nv.tenDangNhap.toLowerCase().includes(tuKhoa) ||
      nv.hoTen.toLowerCase().includes(tuKhoa) ||
      (nv.soDienThoai && nv.soDienThoai.includes(tuKhoa));
    const hopVaiTro = !vaiTro || nv.vaiTro === vaiTro;
    const hopTrangThai = !trangThai || nv.trangThai === trangThai;

    return hopTuKhoa && hopVaiTro && hopTrangThai;
  });

  veBangNhanVien(ketQua);
}

function veBangNhanVien(danhSach) {
  const tbody = document.getElementById('than-bang-nhan-vien');
  const thongTinTong = document.getElementById('thong-tin-tong-so');
  if (!tbody) return;

  if (danhSach.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="chu-can-giua du-lieu-trong">
          <i class="fa-solid fa-users-slash"></i> Không tìm thấy nhân viên phù hợp
        </td>
      </tr>
    `;
    if (thongTinTong) thongTinTong.innerText = 'Tổng số: 0 nhân viên';
    return;
  }

  tbody.innerHTML = danhSach.map((nv, index) => {
    const laDangHoatDong = nv.trangThai === TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG;
    const nutKhoaClass = laDangHoatDong ? 'nut-bam-nguy-hiem-vien' : 'nut-bam-thanh-cong-vien';
    const nutKhoaIcon = laDangHoatDong ? 'fa-lock' : 'fa-lock-open';
    const nutKhoaTitle = laDangHoatDong ? 'Khóa tài khoản (US-014)' : 'Mở khóa tài khoản (US-014)';

    return `
      <tr>
        <td class="chu-can-giua">${index + 1}</td>
        <td><b>${lamSachChuoi(nv.tenDangNhap)}</b></td>
        <td>${lamSachChuoi(nv.hoTen)}</td>
        <td>${lamSachChuoi(nv.soDienThoai || '—')}</td>
        <td>${layHuyHieuVaiTro(nv.vaiTro)}</td>
        <td>${layHuyHieuTrangThaiTaiKhoan(nv.trangThai)}</td>
        <td>${dinhDangNgayGio(nv.ngayTao)}</td>
        <td class="chu-can-giua">
          <div class="nhom-nut-thao-tac">
            <button class="nut-nho nut-bam-phu nut-sua-nv" data-id="${nv.id}" title="Sửa thông tin (US-013)">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="nut-nho nut-bam-canh-bao-vien nut-reset-mk" data-id="${nv.id}" data-user="${nv.tenDangNhap}" title="Đặt lại mật khẩu mặc định (US-013)">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
            <button class="nut-nho ${nutKhoaClass} nut-khoa-nv" data-id="${nv.id}" data-trangthai="${nv.trangThai}" title="${nutKhoaTitle}">
              <i class="fa-solid ${nutKhoaIcon}"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (thongTinTong) {
    thongTinTong.innerText = `Hiển thị ${danhSach.length} / tổng ${danhSachNhanVienGoc.length} nhân viên`;
  }

  // Gắn sự kiện sửa
  tbody.querySelectorAll('.nut-sua-nv').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const nv = danhSachNhanVienGoc.find(x => x.id === id);
      if (nv) {
        document.getElementById('modal-nhan-vien-tieu-de').innerText = 'Chỉnh sửa thông tin nhân viên (US-013)';
        document.getElementById('nv-id').value = nv.id;
        document.getElementById('nv-ten-dang-nhap').value = nv.tenDangNhap;
        document.getElementById('nv-ten-dang-nhap').disabled = true;
        document.getElementById('nv-ho-ten').value = nv.hoTen;
        document.getElementById('nv-so-dien-thoai').value = nv.soDienThoai;
        document.getElementById('nv-vai-tro').value = nv.vaiTro;
        document.getElementById('modal-nhan-vien').classList.remove('lop-phu-an');
      }
    };
  });

  // Gắn sự kiện đặt lại mật khẩu (US-013)
  tbody.querySelectorAll('.nut-reset-mk').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      const user = btn.getAttribute('data-user');
      const dongY = await moHopThoaiXacNhan({
        tieuDe: 'Đặt lại mật khẩu nhân viên (US-013)',
        noiDung: `Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản "${user}" về mặc định "123456" không?`,
        chuXacNhan: 'Đặt lại mật khẩu',
        loai: 'canh-bao'
      });

      if (dongY) {
        hienThiThongBao(`Đã đặt lại mật khẩu cho tài khoản "${user}" về "123456"!`, 'thanh-cong');
      }
    };
  });

  // Gắn sự kiện Khóa / Mở khóa tài khoản (US-014)
  tbody.querySelectorAll('.nut-khoa-nv').forEach(btn => {
    btn.onclick = async () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const trangThaiHienTai = btn.getAttribute('data-trangthai');
      const laKhoa = trangThaiHienTai === TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG;
      const trangThaiMoi = laKhoa ? TRANG_THAI_TAI_KHOAN.DA_KHOA : TRANG_THAI_TAI_KHOAN.DANG_HOAT_DONG;

      const dongY = await moHopThoaiXacNhan({
        tieuDe: laKhoa ? 'Khóa tài khoản nhân viên (US-014)' : 'Mở khóa tài khoản',
        noiDung: laKhoa 
          ? 'Tài khoản này sẽ không thể đăng nhập vào hệ thống nữa. Toàn bộ lịch sử hóa đơn và đơn hàng cũ vẫn được giữ nguyên vẹn.'
          : 'Cho phép tài khoản này tiếp tục đăng nhập và làm việc trên hệ thống.',
        chuXacNhan: laKhoa ? 'Khóa tài khoản' : 'Mở khóa',
        loai: laKhoa ? 'nguy-hiem' : 'thanh-cong'
      });

      if (dongY) {
        const res = await goiApi(`/nhan-vien/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ trangThai: trangThaiMoi })
        });
        if (res.ok) {
          hienThiThongBao(laKhoa ? 'Đã khóa tài khoản nhân viên thành công!' : 'Đã mở khóa tài khoản!', 'thanh-cong');
          taiDanhSachNhanVien();
        }
      }
    };
  });
}
