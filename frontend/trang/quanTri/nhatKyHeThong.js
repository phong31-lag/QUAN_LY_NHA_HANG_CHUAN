/**
 * Màn hình Tra cứu Nhật ký Hệ thống (System Logs) (US-044)
 */
import { goiApi } from '../../dungChung/api.js';
import { dinhDangNgayGio, lamSachChuoi } from '../../dungChung/dinhDang.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';

let danhSachNhatKyGoc = [];

export function taoGiaoDienNhatKy() {
  return `
    <div class="trang-nhat-ky-he-thong">
      <div class="the-tieu-de-trang">
        <div>
          <h2 class="tieu-de-chinh"><i class="fa-solid fa-clipboard-list"></i> Nhật ký Hệ thống (System Logs)</h2>
          <p class="mo-ta-phu">Tra cứu và kiểm soát toàn bộ nhật ký truy cập, biến động dữ liệu và cảnh báo (US-044)</p>
        </div>
        <div>
          <button class="nut-bam nut-bam-phu" id="nut-lam-moi-log">
            <i class="fa-solid fa-arrows-rotate"></i> Làm mới logs
          </button>
        </div>
      </div>

      <!-- BỘ LỌC NHẬT KÝ -->
      <div class="khung-the khung-bo-loc">
        <div class="luoi-bo-loc">
          <div class="o-tim-kiem-hop">
            <i class="fa-solid fa-magnifying-glass icon-tim"></i>
            <input 
              type="text" 
              id="tim-kiem-log" 
              class="o-nhap-lieu o-nhap-tim" 
              placeholder="Tìm theo người thực hiện, nội dung log..." 
            />
          </div>

          <div class="nhom-loc">
            <select id="loc-muc-do-log" class="o-nhap-lieu">
              <option value="">-- Tất cả mức độ --</option>
              <option value="INFO">Thông tin (INFO)</option>
              <option value="WARN">Cảnh báo (WARN)</option>
              <option value="ERROR">Lỗi hệ thống (ERROR)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- BẢNG NHẬT KÝ -->
      <div class="khung-the khung-bang">
        <div class="hop-bang-cuon">
          <table class="bang-du-lieu" id="bang-logs">
            <thead>
              <tr>
                <th width="60">STT</th>
                <th width="160">Thời gian</th>
                <th width="150">Tài khoản</th>
                <th width="120">Mức độ</th>
                <th>Nội dung hoạt động</th>
              </tr>
            </thead>
            <tbody id="than-bang-logs">
              <tr>
                <td colspan="5" class="chu-can-giua dang-tai-dong">
                  <i class="fa-solid fa-spinner fa-spin"></i> Đang tải nhật ký...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export async function ganSuKienNhatKy() {
  await taiNhatKy();

  const inputTim = document.getElementById('tim-kiem-log');
  const locMucDo = document.getElementById('loc-muc-do-log');
  const nutLamMoi = document.getElementById('nut-lam-moi-log');

  if (inputTim) inputTim.oninput = locNhatKy;
  if (locMucDo) locMucDo.onchange = locNhatKy;

  if (nutLamMoi) {
    nutLamMoi.onclick = async () => {
      await taiNhatKy();
      hienThiThongBao('Đã làm mới danh sách nhật ký!', 'thanh-cong', 1500);
    };
  }
}

async function taiNhatKy() {
  const res = await goiApi('/nhat-ky-he-thong');
  if (res.ok) {
    danhSachNhatKyGoc = res.data || [];
    locNhatKy();
  }
}

function locNhatKy() {
  const tuKhoa = (document.getElementById('tim-kiem-log')?.value || '').toLowerCase().trim();
  const mucDo = document.getElementById('loc-muc-do-log')?.value || '';

  const ketQua = danhSachNhatKyGoc.filter(log => {
    const hopTuKhoa = !tuKhoa ||
      log.nguoiThucHien.toLowerCase().includes(tuKhoa) ||
      log.noiDung.toLowerCase().includes(tuKhoa);
    const hopMucDo = !mucDo || log.loaiNhatKy === mucDo;

    return hopTuKhoa && hopMucDo;
  });

  veBangLogs(ketQua);
}

function veBangLogs(danhSach) {
  const tbody = document.getElementById('than-bang-logs');
  if (!tbody) return;

  if (danhSach.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="chu-can-giua du-lieu-trong">
          Không có bản ghi nhật ký nào phù hợp
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = danhSach.map((log, idx) => {
    let lopMucDo = 'huy-hieu-thong-tin';
    let icon = 'fa-info-circle';

    if (log.loaiNhatKy === 'WARN') {
      lopMucDo = 'huy-hieu-canh-bao';
      icon = 'fa-triangle-exclamation';
    } else if (log.loaiNhatKy === 'ERROR') {
      lopMucDo = 'huy-hieu-nguy-hiem';
      icon = 'fa-circle-exclamation';
    }

    return `
      <tr>
        <td class="chu-can-giua">${idx + 1}</td>
        <td><code>${dinhDangNgayGio(log.thoiGian)}</code></td>
        <td><b>${lamSachChuoi(log.nguoiThucHien)}</b></td>
        <td>
          <span class="huy-hieu ${lopMucDo}">
            <i class="fa-solid ${icon}"></i> ${log.loaiNhatKy}
          </span>
        </td>
        <td>${lamSachChuoi(log.noiDung)}</td>
      </tr>
    `;
  }).join('');
}
