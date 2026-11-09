const ungDung = require('./ungDung');
const cauHinhChung = require('./cauHinh/cauHinhChung');
const giaiPhongCong = require('./tienIch/giaiPhongCong');

const CONG_MAC_DINH = cauHinhChung.congBackend || 3001;

/**
 * Khởi động máy chủ có khả năng tự phục hồi khi trùng cổng
 */
function khoiDong(cong, daThuGiaiPhong = false) {
    const mayChu = ungDung.listen(cong, () => {
        console.log(`================================================================`);
        console.log(`🚀 Máy chủ Backend Quản Lý Nhà Hàng đang chạy tại:`);
        console.log(`👉 http://localhost:${cong}`);
        console.log(`👉 Kiểm tra hệ thống: http://localhost:${cong}/api/kiem-tra-he-thong`);
        console.log(`👉 Danh mục món: http://localhost:${cong}/api/danh-muc-mon`);
        console.log(`👉 Thực đơn món: http://localhost:${cong}/api/thuc-don`);
        console.log(`👉 Khu vực: http://localhost:${cong}/api/khu-vuc`);
        console.log(`👉 Bàn ăn & QR: http://localhost:${cong}/api/ban-an`);
        console.log(`👉 Nhân viên: http://localhost:${cong}/api/nhan-vien`);
        console.log(`👉 Cấu hình: http://localhost:${cong}/api/cau-hinh`);
        console.log(`================================================================`);
    });

    mayChu.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (!daThuGiaiPhong) {
                console.log(`⚠️ Cổng ${cong} đang bị tiến trình cũ chiếm dụng. Đang tự động giải phóng...`);
                giaiPhongCong(cong);
                setTimeout(() => {
                    khoiDong(cong, true);
                }, 400);
            } else {
                console.error(`\n❌ Cổng ${cong} vẫn bận sau khi giải phóng. Đang chuyển sang cổng phụ ${cong + 1}...`);
                khoiDong(cong + 1, false);
            }
        } else {
            console.error('❌ Lỗi khởi động máy chủ:', err);
            process.exit(1);
        }
    });

    return mayChu;
}

const mayChu = khoiDong(CONG_MAC_DINH);

module.exports = mayChu;
