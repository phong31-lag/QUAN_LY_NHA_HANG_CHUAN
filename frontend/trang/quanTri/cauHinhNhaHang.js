/**
 * Màn hình Cấu hình Nhà hàng (US-041, US-042, US-043)
 * - US-041: Cấu hình thông tin quán (Tên, địa chỉ, hotline, wifi)
 * - US-042: Cấu hình thuế VAT và phí phục vụ mặc định
 * - US-043: Cấu hình thông tin tài khoản ngân hàng nhận VietQR
 */
import { goiApi } from '../../dungChung/api.js';
import { hienThiThongBao } from '../../thanhPhan/thongBao.js';

export function taoGiaoDienCauHinh() {
  return `
    <div class="trang-cau-hinh">
      <div class="the-tieu-de-trang">
        <div>
          <h2 class="tieu-de-chinh"><i class="fa-solid fa-sliders"></i> Cấu hình Nhà hàng</h2>
          <p class="mo-ta-phu">Thiết lập thông tin thương hiệu, thuế phí và tài khoản VietQR thanh toán (US-041 -> US-043)</p>
        </div>
      </div>

      <form id="form-cau-hinh-tong">
        <div class="luoi-hai-cot">
          <!-- CỘT 1: THÔNG TIN CHUNG & THUẾ PHÍ (US-041, US-042) -->
          <div class="khung-the">
            <div class="the-dau-hop">
              <h3 class="the-tieu-de-hop"><i class="fa-solid fa-store"></i> Thông tin chung nhà hàng (US-041)</h3>
            </div>
            
            <div class="bieu-mau">
              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="ten-nha-hang">Tên nhà hàng / quán ăn *</label>
                <input type="text" id="ten-nha-hang" class="o-nhap-lieu" required />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="dia-chi">Địa chỉ quán *</label>
                <input type="text" id="dia-chi" class="o-nhap-lieu" required />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="hotline">Số điện thoại Hotline *</label>
                <input type="tel" id="hotline" class="o-nhap-lieu" required />
              </div>

              <div class="luoi-hai-o">
                <div class="nhom-nhap-lieu">
                  <label class="nhan-nhap-lieu" for="ten-wifi">Tên Wifi quán</label>
                  <input type="text" id="ten-wifi" class="o-nhap-lieu" />
                </div>
                <div class="nhom-nhap-lieu">
                  <label class="nhan-nhap-lieu" for="mat-khau-wifi">Mật khẩu Wifi</label>
                  <input type="text" id="mat-khau-wifi" class="o-nhap-lieu" />
                </div>
              </div>

              <div class="duong-ke-ngang"></div>
              <h4 class="tieu-de-phu-hop"><i class="fa-solid fa-percent"></i> Cấu hình Thuế & Phụ phí (US-042)</h4>

              <div class="luoi-hai-o">
                <div class="nhom-nhap-lieu">
                  <label class="nhan-nhap-lieu" for="ty-le-vat">Thuế VAT mặc định (%)</label>
                  <input type="number" id="ty-le-vat" class="o-nhap-lieu" min="0" max="20" step="1" />
                </div>
                <div class="nhom-nhap-lieu">
                  <label class="nhan-nhap-lieu" for="phi-phuc-vu">Phí phục vụ (%)</label>
                  <input type="number" id="phi-phuc-vu" class="o-nhap-lieu" min="0" max="20" step="1" />
                </div>
              </div>
            </div>
          </div>

          <!-- CỘT 2: TÀI KHOẢN VIETQR (US-043) -->
          <div class="khung-the">
            <div class="the-dau-hop">
              <h3 class="the-tieu-de-hop"><i class="fa-solid fa-qrcode"></i> Tài khoản thanh toán VietQR (US-043)</h3>
            </div>

            <div class="bieu-mau">
              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="ten-ngan-hang">Ngân hàng thụ hưởng *</label>
                <select id="ten-ngan-hang" class="o-nhap-lieu" required>
                  <option value="MBBank">MBBank - Ngân hàng Quân Đội</option>
                  <option value="VCB">Vietcombank - Ngoại thương VN</option>
                  <option value="TCB">Techcombank - Kỹ thương VN</option>
                  <option value="ACB">ACB - Ngân hàng Á Châu</option>
                  <option value="BIDV">BIDV - Đầu tư và Phát triển VN</option>
                  <option value="VPBank">VPBank - Việt Nam Thịnh Vượng</option>
                </select>
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="so-tai-khoan">Số tài khoản ngân hàng *</label>
                <input type="text" id="so-tai-khoan" class="o-nhap-lieu" placeholder="Nhập STK nhận tiền" required />
              </div>

              <div class="nhom-nhap-lieu">
                <label class="nhan-nhap-lieu" for="ten-chu-tai-khoan">Tên chủ tài khoản (Viết hoa không dấu) *</label>
                <input type="text" id="ten-chu-tai-khoan" class="o-nhap-lieu" placeholder="vd: NGUYEN VAN A" required />
              </div>

              <!-- PREVIEW MÃ VIETQR DEMO -->
              <div class="hop-xem-truoc-qr">
                <div class="chu-thich-qr">Mã QR tạo động theo chuẩn VietQR NAPAS 247:</div>
                <div class="khung-anh-qr">
                  <img id="anh-preview-qr" src="" alt="Mã VietQR" class="anh-qr-vietnam" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="thanh-thao-tac-chan">
          <button type="submit" class="nut-bam nut-bam-chinh" id="nut-luu-cau-hinh">
            <i class="fa-solid fa-floppy-disk"></i> Lưu toàn bộ cấu hình (US-041, US-042, US-043)
          </button>
        </div>
      </form>
    </div>
  `;
}

export async function ganSuKienCauHinh() {
  await taiCauHinh();

  const form = document.getElementById('form-cau-hinh-tong');
  const nganHang = document.getElementById('ten-ngan-hang');
  const stk = document.getElementById('so-tai-khoan');
  const chuTk = document.getElementById('ten-chu-tai-khoan');

  const capNhatQr = () => {
    const maBank = nganHang.value || 'MBBank';
    const soTk = stk.value || '090123456789';
    const ten = encodeURIComponent(chuTk.value || 'QUAN MOC');
    const anhQr = document.getElementById('anh-preview-qr');
    if (anhQr) {
      anhQr.src = `https://img.vietqr.io/image/${maBank}-${soTk}-compact2.png?accountName=${ten}`;
    }
  };

  if (nganHang) nganHang.onchange = capNhatQr;
  if (stk) stk.oninput = capNhatQr;
  if (chuTk) chuTk.oninput = capNhatQr;

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const duLieu = {
        tenNhaHang: document.getElementById('ten-nha-hang').value.trim(),
        diaChi: document.getElementById('dia-chi').value.trim(),
        hotline: document.getElementById('hotline').value.trim(),
        tenWifi: document.getElementById('ten-wifi').value.trim(),
        matKhauWifi: document.getElementById('mat-khau-wifi').value.trim(),
        tyLeVat: parseFloat(document.getElementById('ty-le-vat').value) || 0,
        phiPhucVu: parseFloat(document.getElementById('phi-phuc-vu').value) || 0,
        tenNganHang: document.getElementById('ten-ngan-hang').value,
        soTaiKhoan: document.getElementById('so-tai-khoan').value.trim(),
        tenChuTaiKhoan: document.getElementById('ten-chu-tai-khoan').value.trim().toUpperCase()
      };

      const res = await goiApi('/cau-hinh-nha-hang', {
        method: 'PUT',
        body: JSON.stringify(duLieu)
      });

      if (res.ok) {
        hienThiThongBao(res.msg || 'Cấu hình nhà hàng đã được cập nhật!', 'thanh-cong');
      } else {
        hienThiThongBao(res.msg || 'Không thể lưu cấu hình!', 'that-bai');
      }
    };
  }
}

async function taiCauHinh() {
  const res = await goiApi('/cau-hinh-nha-hang');
  if (res.ok && res.data) {
    const d = res.data;
    if (document.getElementById('ten-nha-hang')) document.getElementById('ten-nha-hang').value = d.tenNhaHang || '';
    if (document.getElementById('dia-chi')) document.getElementById('dia-chi').value = d.diaChi || '';
    if (document.getElementById('hotline')) document.getElementById('hotline').value = d.hotline || '';
    if (document.getElementById('ten-wifi')) document.getElementById('ten-wifi').value = d.tenWifi || '';
    if (document.getElementById('mat-khau-wifi')) document.getElementById('mat-khau-wifi').value = d.matKhauWifi || '';
    if (document.getElementById('ty-le-vat')) document.getElementById('ty-le-vat').value = d.tyLeVat ?? 8;
    if (document.getElementById('phi-phuc-vu')) document.getElementById('phi-phuc-vu').value = d.phiPhucVu ?? 0;
    if (document.getElementById('ten-ngan-hang')) document.getElementById('ten-ngan-hang').value = d.tenNhaHang || 'MBBank';
    if (document.getElementById('so-tai-khoan')) document.getElementById('so-tai-khoan').value = d.soTaiKhoan || '';
    if (document.getElementById('ten-chu-tai-khoan')) document.getElementById('ten-chu-tai-khoan').value = d.tenChuTaiKhoan || '';

    // Cập nhật preview QR ban đầu
    const maBank = d.tenNganHang || 'MBBank';
    const soTk = d.soTaiKhoan || '090123456789';
    const ten = encodeURIComponent(d.tenChuTaiKhoan || 'QUAN MOC');
    const anhQr = document.getElementById('anh-preview-qr');
    if (anhQr) {
      anhQr.src = `https://img.vietqr.io/image/${maBank}-${soTk}-compact2.png?accountName=${ten}`;
    }
  }
}
