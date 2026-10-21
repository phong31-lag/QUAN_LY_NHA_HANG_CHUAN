/**
 * Thành phần hiển thị thông báo Toast (Toast Notification)
 * Hỗ trợ các trạng thái: thành công, thất bại, cảnh báo, thông tin
 */

let vungChuaThongBao = null;

function layVungChua() {
  if (!vungChuaThongBao) {
    vungChuaThongBao = document.getElementById('vung-chua-thong-bao');
    if (!vungChuaThongBao) {
      vungChuaThongBao = document.createElement('div');
      vungChuaThongBao.id = 'vung-chua-thong-bao';
      vungChuaThongBao.className = 'vung-chua-thong-bao';
      document.body.appendChild(vungChuaThongBao);
    }
  }
  return vungChuaThongBao;
}

export function hienThiThongBao(noiDung, loai = 'thanh-cong', thoiGian = 3500) {
  const vung = layVungChua();
  const theThongBao = document.createElement('div');
  theThongBao.className = `the-thong-bao the-thong-bao-${loai}`;

  let bieuTuong = 'fa-circle-check';
  if (loai === 'that-bai' || loai === 'nguy-hiem') bieuTuong = 'fa-circle-xmark';
  if (loai === 'canh-bao') bieuTuong = 'fa-triangle-exclamation';
  if (loai === 'thong-tin') bieuTuong = 'fa-circle-info';

  theThongBao.innerHTML = `
    <i class="fa-solid ${bieuTuong} the-thong-bao-bieu-tuong"></i>
    <div class="the-thong-bao-noi-dung">${noiDung}</div>
    <button class="the-thong-bao-dong">&times;</button>
  `;

  vung.appendChild(theThongBao);

  const nutDong = theThongBao.querySelector('.the-thong-bao-dong');
  nutDong.onclick = () => {
    theThongBao.classList.add('the-thong-bao-an');
    setTimeout(() => theThongBao.remove(), 300);
  };

  setTimeout(() => {
    if (theThongBao.parentElement) {
      theThongBao.classList.add('the-thong-bao-an');
      setTimeout(() => theThongBao.remove(), 300);
    }
  }, thoiGian);
}
