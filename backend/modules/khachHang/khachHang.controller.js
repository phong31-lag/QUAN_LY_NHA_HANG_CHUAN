const khachHangModel = require('./khachHang.model');
const donGoiMonModel = require('../donGoiMon/donGoiMon.model');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

/**
 * Xử lý tự động Đăng ký nếu chưa có tài khoản, hoặc Đăng nhập nếu đã có tài khoản
 */
async function dangNhapHoacDangKy(req, res, next) {
    try {
        const { soDienThoai, matKhau, tenKhach } = req.body || {};

        if (!soDienThoai || !String(soDienThoai).trim()) {
            return phanHoiLoi(res, 'Vui lòng cung cấp số điện thoại của bạn', 400);
        }

        const sdtChuan = khachHangModel.chuanHoaSoDienThoai(soDienThoai);
        if (sdtChuan.length < 9 || sdtChuan.length > 11) {
            return phanHoiLoi(res, 'Số điện thoại không hợp lệ (cần từ 9 đến 11 số)', 400);
        }

        if (!matKhau || String(matKhau).trim().length < 4) {
            return phanHoiLoi(res, 'Mật khẩu cần tối thiểu 4 ký tự', 400);
        }

        // Kiểm tra xem khách đã từng tạo tài khoản chưa
        const khachCu = await khachHangModel.layTheoSoDienThoai(sdtChuan);

        if (khachCu) {
            // Đã có tài khoản -> Kiểm tra mật khẩu để đăng nhập
            const hopLe = await khachHangModel.xacThucMatKhau(khachCu, String(matKhau).trim());
            if (!hopLe) {
                return phanHoiLoi(res, 'Số điện thoại này đã có tài khoản nhưng mật khẩu không chính xác. Vui lòng thử lại!', 401);
            }

            await khachHangModel.capNhatDangNhap(khachCu.id);
            const { matKhau: _, ...thongTinAnToan } = khachCu;

            return phanHoiThanhCong(res, {
                khachHang: thongTinAnToan,
                token: `khach_tok_${Date.now()}_${khachCu.id}`,
                laTaiKhoanMoi: false
            }, `Chào mừng bạn quay trở lại, ${thongTinAnToan.tenKhach}! 🎉`);
        } else {
            // Chưa có tài khoản -> Tự động đăng ký mới
            const khachMoi = await khachHangModel.taoMoi({
                soDienThoai: sdtChuan,
                matKhau: String(matKhau).trim(),
                tenKhach: (tenKhach && tenKhach.trim()) ? tenKhach.trim() : `Khách ${sdtChuan.slice(-4)}`
            });

            return phanHoiThanhCong(res, {
                khachHang: khachMoi,
                token: `khach_tok_${Date.now()}_${khachMoi.id}`,
                laTaiKhoanMoi: true
            }, `Tạo tài khoản thành công! Tặng bạn 10 điểm thưởng thành viên Quán Mộc.`);
        }
    } catch (e) {
        next(e);
    }
}

/**
 * Lấy thông tin tài khoản khách hàng
 */
async function layThongTin(req, res, next) {
    try {
        const { sdt } = req.query;
        if (!sdt) {
            return phanHoiLoi(res, 'Thiếu số điện thoại tra cứu', 400);
        }

        const kh = await khachHangModel.layTheoSoDienThoai(sdt);
        if (!kh) {
            return phanHoiLoi(res, 'Không tìm thấy thông tin khách hàng', 404);
        }

        const { matKhau: _, ...duLieuAnToan } = kh;
        return phanHoiThanhCong(res, duLieuAnToan, 'Lấy thông tin khách hàng thành công');
    } catch (e) {
        next(e);
    }
}

/**
 * Lấy lịch sử các đơn hàng khách đã đặt
 */
async function layLichSuDon(req, res, next) {
    try {
        const { sdt } = req.query;
        if (!sdt) {
            return phanHoiLoi(res, 'Thiếu số điện thoại tra cứu đơn', 400);
        }

        const sdtChuan = khachHangModel.chuanHoaSoDienThoai(sdt);
        const tatCaDon = await donGoiMonModel.layTatCa();
        const donCuaKhach = (tatCaDon || []).filter(d => 
            d.soDienThoai && khachHangModel.chuanHoaSoDienThoai(d.soDienThoai) === sdtChuan
        );

        return phanHoiThanhCong(res, donCuaKhach, `Tìm thấy ${donCuaKhach.length} đơn hàng của bạn`);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    dangNhapHoacDangKy,
    layThongTin,
    layLichSuDon
};
