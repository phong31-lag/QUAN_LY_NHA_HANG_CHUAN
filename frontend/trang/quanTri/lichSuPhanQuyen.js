/**
 * Màn hình Nhật ký / Lịch sử thay đổi quyền hạn nhân sự (US-022)
 */
import { goiApi } from '../../dungChung/api.js';
import { dinhDangNgayGio, lamSachChuoi } from '../../dungChung/dinhDang.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';

export function taoGiaoDienLichSuPhanQuyen() {
  return `
    <div class="trang-lich-su-phan-quyen">
      <div class="the-tieu-de-trang">
        <div>
          <h2 class="tieu-de-chinh"><i class="fa-solid fa-clock-rotate-left"></i> Lịch sử Thay đổi Quyền hạn</h2>
          <p class="mo-ta-phu">Theo dõi toàn bộ lịch sử phân quyền, gán vai trò và cập nhật chức năng nhân sự (US-022)</p>
        </div>
        <div>
          <button class="nut-bam nut-bam-phu" id="nut-lam-moi-ls">
            <i class="fa-solid fa-arrows-rotate"></i> Làm mới
          </button>
        </div>
      </div>

      <div class="khung-the khung-bang">
        <div class="hop-bang-cuon">
          <table class="bang-du-lieu" id="bang-lich-su-pq">
            <thead>
              <tr>
                <th width="60">STT</th>
                <th>Người thực hiện</th>
                <th>Hành động ghi nhận</th>
                <th>Thời gian</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody id="than-bang-lich-su-pq">
              <tr>
                <td colspan="5" class="chu-can-giua dang-tai-dong">
                  <i class="fa-solid fa-spinner fa-spin"></i> Đang tải lịch sử phân quyền...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export async function ganSuKienLichSuPhanQuyen() {
  await taiLichSu();

  const nutLamMoi = document.getElementById('nut-lam-moi-ls');
  if (nutLamMoi) {
    nutLamMoi.onclick = async () => {
      await taiLichSu();
      hienThiThongBao('Đã cập nhật dữ liệu lịch sử mới nhất!', 'thanh-cong', 1500);
    };
  }
}

async function taiLichSu() {
  const tbody = document.getElementById('than-bang-lich-su-pq');
  if (!tbody) return;

  const res = await goiApi('/vai-tro/lich-su');
  if (res.ok) {
    const danhSach = res.data || [];
    if (danhSach.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="chu-can-giua du-lieu-trong">
            Chưa có lịch sử thay đổi quyền hạn nào
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = danhSach.map((item, idx) => `
      <tr>
        <td class="chu-can-giua">${idx + 1}</td>
        <td><b><i class="fa-solid fa-user-shield"></i> ${lamSachChuoi(item.nguoiThucHien)}</b></td>
        <td>${lamSachChuoi(item.hanhDong)}</td>
        <td><i class="fa-regular fa-clock"></i> ${dinhDangNgayGio(item.thoiGian)}</td>
        <td><span class="chu-thich">${lamSachChuoi(item.ghiChu || '—')}</span></td>
      </tr>
    `).join('');
  }
}
