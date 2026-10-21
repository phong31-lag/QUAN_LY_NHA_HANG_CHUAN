/**
 * Màn hình Quản lý Vai trò & Ma trận Phân quyền chi tiết (US-015, US-016, US-017, US-018)
 */
import { goiApi } from '../../dungChung/api.js';
import { DANH_MUC_QUYEN } from '../../dungChung/hangSo.js';
import { layHuyHieuVaiTro, lamSachChuoi } from '../../dungChung/dinhDang.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';

let danhSachVaiTroGoc = [];
let vaiTroDangChon = null;

export function taoGiaoDienVaiTro() {
  return `
    <div class="trang-vai-tro-quyen">
      <div class="the-tieu-de-trang">
        <div>
          <h2 class="tieu-de-chinh"><i class="fa-solid fa-shield-halved"></i> Vai trò & Ma trận Phân quyền</h2>
          <p class="mo-ta-phu">Thiết lập danh sách vai trò và cấu hình quyền hạn chức năng chi tiết (US-015 -> US-018)</p>
        </div>
      </div>

      <div class="luoi-vai-tro-quyen">
        <!-- CỘT TRÁI: DANH SÁCH VAI TRÒ (US-015, US-016) -->
        <div class="khung-the cot-vai-tro">
          <div class="the-dau-hop">
            <h3 class="the-tieu-de-hop"><i class="fa-solid fa-user-tag"></i> Danh sách vai trò</h3>
          </div>
          <div class="danh-sach-vai-tro-hop" id="danh-sach-the-vai-tro">
            <div class="chu-can-giua dang-tai-dong">Đang tải danh sách vai trò...</div>
          </div>
        </div>

        <!-- CỘT PHẢI: MA TRẬN PHÂN QUYỀN CHO VAI TRÒ ĐANG CHỌN (US-018) -->
        <div class="khung-the cot-ma-tran-quyen">
          <div class="the-dau-hop the-dau-phan-quyen">
            <div>
              <h3 class="the-tieu-de-hop" id="tieu-de-vai-tro-dang-chon">
                <i class="fa-solid fa-sliders"></i> Cấu hình quyền hạn chức năng
              </h3>
              <p class="the-mo-ta-hop" id="mo-ta-vai-tro-dang-chon">Chọn một vai trò bên trái để điều chỉnh quyền</p>
            </div>
            <div>
              <button class="nut-bam nut-bam-chinh" id="nut-luu-ma-tran-quyen">
                <i class="fa-solid fa-floppy-disk"></i> Lưu cấu hình quyền (US-018)
              </button>
            </div>
          </div>

          <!-- BẢNG NHÓM QUYỀN HẠN DẠNG CHECKBOX -->
          <div class="vung-ma-tran-quyen" id="vung-ma-tran-quyen">
            ${DANH_MUC_QUYEN.map(nhom => `
              <div class="nhom-quyen-muc">
                <div class="nhom-quyen-tieu-de">
                  <i class="fa-solid fa-folder-open"></i> ${nhom.nhom}
                </div>
                <div class="nhom-quyen-luoi">
                  ${nhom.danhSach.map(item => `
                    <label class="o-tich-quyen" for="quyen-${item.ma}">
                      <input 
                        type="checkbox" 
                        id="quyen-${item.ma}" 
                        value="${item.ma}" 
                        class="checkbox-quyen"
                      />
                      <div class="o-tich-noi-dung">
                        <span class="ten-quyen">${item.ten}</span>
                        <code class="ma-quyen">${item.ma}</code>
                      </div>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function ganSuKienVaiTro() {
  await taiDanhSachVaiTro();

  const nutLuu = document.getElementById('nut-luu-ma-tran-quyen');
  if (nutLuu) {
    nutLuu.onclick = async () => {
      if (!vaiTroDangChon) {
        hienThiThongBao('Vui lòng chọn vai trò cần phân quyền!', 'canh-bao');
        return;
      }

      // Thu thập các quyền được tích
      const checkboxes = document.querySelectorAll('.checkbox-quyen:checked');
      const quyenMoi = Array.from(checkboxes).map(cb => cb.value);

      nutLuu.disabled = true;
      nutLuu.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';

      const res = await goiApi(`/vai-tro/${vaiTroDangChon.ma}`, {
        method: 'PUT',
        body: JSON.stringify({ quyenHan: quyenMoi })
      });

      nutLuu.disabled = false;
      nutLuu.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu cấu hình quyền (US-018)';

      if (res.ok) {
        hienThiThongBao(res.msg || 'Cập nhật phân quyền thành công! Đã ghi nhận lịch sử (US-022)', 'thanh-cong');
        vaiTroDangChon.quyenHan = quyenMoi;
        const index = danhSachVaiTroGoc.findIndex(v => v.ma === vaiTroDangChon.ma);
        if (index !== -1) danhSachVaiTroGoc[index].quyenHan = quyenMoi;
      } else {
        hienThiThongBao(res.msg || 'Cập nhật thất bại!', 'that-bai');
      }
    };
  }
}

async function taiDanhSachVaiTro() {
  const res = await goiApi('/vai-tro');
  if (res.ok) {
    danhSachVaiTroGoc = res.data || [];
    veDanhSachVaiTro();
    if (danhSachVaiTroGoc.length > 0) {
      chonVaiTro(danhSachVaiTroGoc[0]);
    }
  }
}

function veDanhSachVaiTro() {
  const hop = document.getElementById('danh-sach-the-vai-tro');
  if (!hop) return;

  hop.innerHTML = danhSachVaiTroGoc.map(vt => `
    <div class="the-vai-tro-muc" data-ma="${vt.ma}">
      <div class="the-vai-tro-tren">
        <div class="the-vai-tro-ten">${layHuyHieuVaiTro(vt.ma)}</div>
        <span class="so-quyen-dem">${(vt.quyenHan || []).length} quyền</span>
      </div>
      <p class="the-vai-tro-mo-ta">${lamSachChuoi(vt.moTa || 'Chưa có mô tả chi tiết')}</p>
    </div>
  `).join('');

  hop.querySelectorAll('.the-vai-tro-muc').forEach(el => {
    el.onclick = () => {
      const ma = el.getAttribute('data-ma');
      const vt = danhSachVaiTroGoc.find(x => x.ma === ma);
      if (vt) chonVaiTro(vt);
    };
  });
}

function chonVaiTro(vt) {
  vaiTroDangChon = vt;

  // Cập nhật active class
  document.querySelectorAll('.the-vai-tro-muc').forEach(el => {
    el.classList.toggle('kich-hoat', el.getAttribute('data-ma') === vt.ma);
  });

  const tieuDe = document.getElementById('tieu-de-vai-tro-dang-chon');
  const moTa = document.getElementById('mo-ta-vai-tro-dang-chon');
  if (tieuDe) tieuDe.innerHTML = `<i class="fa-solid fa-sliders"></i> Phân quyền cho: <b>${vt.ten}</b>`;
  if (moTa) moTa.innerText = vt.moTa || '';

  // Đánh dấu các checkbox theo danh sách quyền của vai trò này
  const danhSachQuyen = vt.quyenHan || [];
  document.querySelectorAll('.checkbox-quyen').forEach(cb => {
    cb.checked = danhSachQuyen.includes(cb.value);
  });
}
