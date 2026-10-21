/**
 * Thành phần Hộp thoại Modal & Hộp thoại Xác nhận (Confirm Dialog)
 */

export function moHopThoaiXacNhan({ tieuDe = 'Xác nhận thao tác', noiDung = 'Bạn có chắc chắn muốn thực hiện hành động này?', chuXacNhan = 'Đồng ý', loai = 'nguy-hiem' }) {
  return new Promise((resolve) => {
    const maModal = 'modal-xac-nhan-' + Date.now();
    const lopNut = loai === 'nguy-hiem' ? 'nut-bam-nguy-hiem' : 'nut-bam-chinh';

    const div = document.createElement('div');
    div.id = maModal;
    div.className = 'lop-phu-modal';
    div.innerHTML = `
      <div class="hop-thoai-modal hop-thoai-xac-nhan">
        <div class="hop-thoai-dau">
          <h3 class="hop-thoai-tieu-de"><i class="fa-solid fa-circle-question"></i> ${tieuDe}</h3>
          <button class="hop-thoai-nut-dong" id="nut-dong-${maModal}">&times;</button>
        </div>
        <div class="hop-thoai-than">
          <p class="hop-thoai-noi-dung">${noiDung}</p>
        </div>
        <div class="hop-thoai-chan">
          <button class="nut-bam nut-bam-phu" id="nut-huy-${maModal}">Hủy bỏ</button>
          <button class="nut-bam ${lopNut}" id="nut-xac-nhan-${maModal}">${chuXacNhan}</button>
        </div>
      </div>
    `;

    document.body.appendChild(div);

    function dong(ketQua) {
      div.classList.add('lop-phu-an');
      setTimeout(() => {
        div.remove();
        resolve(ketQua);
      }, 200);
    }

    document.getElementById(`nut-huy-${maModal}`).onclick = () => dong(false);
    document.getElementById(`nut-dong-${maModal}`).onclick = () => dong(false);
    document.getElementById(`nut-xac-nhan-${maModal}`).onclick = () => dong(true);
  });
}
