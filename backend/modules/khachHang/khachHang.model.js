const path = require('path');
const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');
const { bămMatKhau, soSanhMatKhau } = require('../../tienIch/maHoaMatKhau');

const KHOA_TEP = 'khachHang';

let danhSachKhachHang = docDuLieu(KHOA_TEP, []);

function luu() {
    ghiDuLieu(KHOA_TEP, danhSachKhachHang);
}

function chuanHoaSoDienThoai(sdt) {
    if (!sdt) return '';
    return String(sdt).trim().replace(/[^0-9]/g, '');
}

async function layTatCa() {
    danhSachKhachHang = docDuLieu(KHOA_TEP, []);
    return danhSachKhachHang.map(kh => {
        const { matKhau, ...duLieuAnToan } = kh;
        return duLieuAnToan;
    });
}

async function layTheoSoDienThoai(sdt) {
    danhSachKhachHang = docDuLieu(KHOA_TEP, []);
    const sdtChuan = chuanHoaSoDienThoai(sdt);
    return danhSachKhachHang.find(kh => chuanHoaSoDienThoai(kh.soDienThoai) === sdtChuan) || null;
}

async function layTheoId(id) {
    danhSachKhachHang = docDuLieu(KHOA_TEP, []);
    const numId = Number(id);
    return danhSachKhachHang.find(kh => Number(kh.id) === numId) || null;
}

async function taoMoi({ soDienThoai, matKhau, tenKhach }) {
    danhSachKhachHang = docDuLieu(KHOA_TEP, []);
    const sdtChuan = chuanHoaSoDienThoai(soDienThoai);

    const daTonTai = await layTheoSoDienThoai(sdtChuan);
    if (daTonTai) {
        const loi = new Error('Số điện thoại này đã được đăng ký tài khoản!');
        loi.status = 400;
        throw loi;
    }

    const idMoi = danhSachKhachHang.length > 0 
        ? Math.max(...danhSachKhachHang.map(k => Number(k.id) || 0)) + 1 
        : 1;

    let matKhauLuu = matKhau;
    try {
        matKhauLuu = await bămMatKhau(matKhau);
    } catch (e) {
        matKhauLuu = matKhau;
    }

    const khachMoi = {
        id: idMoi,
        soDienThoai: sdtChuan,
        matKhau: matKhauLuu,
        tenKhach: (tenKhach && tenKhach.trim()) ? tenKhach.trim() : `Khách ${sdtChuan.slice(-4)}`,
        diemTichLuy: 10, // Tặng 10 điểm chào mừng
        hangThanhVien: 'Đồng',
        tongChiTieu: 0,
        soDonDaDat: 0,
        ngayTao: new Date().toISOString(),
        ngayCapNhat: new Date().toISOString(),
        lanCuoiDangNhap: new Date().toISOString()
    };

    danhSachKhachHang.push(khachMoi);
    luu();

    const { matKhau: _, ...ketQua } = khachMoi;
    return ketQua;
}

async function xacThucMatKhau(khachHang, matKhauNhap) {
    if (!khachHang || !khachHang.matKhau) return false;
    if (khachHang.matKhau.startsWith('$2a$') || khachHang.matKhau.startsWith('$2b$')) {
        try {
            return await soSanhMatKhau(matKhauNhap, khachHang.matKhau);
        } catch (e) {
            return false;
        }
    }
    return khachHang.matKhau === matKhauNhap;
}

async function capNhatDangNhap(id) {
    danhSachKhachHang = docDuLieu(KHOA_TEP, []);
    const kh = danhSachKhachHang.find(k => Number(k.id) === Number(id));
    if (kh) {
        kh.lanCuoiDangNhap = new Date().toISOString();
        luu();
    }
}

async function tichLuyDonHang(soDienThoai, tongTienDon) {
    danhSachKhachHang = docDuLieu(KHOA_TEP, []);
    const sdtChuan = chuanHoaSoDienThoai(soDienThoai);
    const kh = danhSachKhachHang.find(k => chuanHoaSoDienThoai(k.soDienThoai) === sdtChuan);
    if (kh) {
        kh.soDonDaDat = (kh.soDonDaDat || 0) + 1;
        kh.tongChiTieu = (kh.tongChiTieu || 0) + (Number(tongTienDon) || 0);
        // Mỗi 10.000 đ tích 1 điểm
        const diemCong = Math.floor((Number(tongTienDon) || 0) / 10000);
        kh.diemTichLuy = (kh.diemTichLuy || 0) + diemCong;

        if (kh.diemTichLuy >= 200) kh.hangThanhVien = 'Kim Cương';
        else if (kh.diemTichLuy >= 100) kh.hangThanhVien = 'Vàng';
        else if (kh.diemTichLuy >= 50) kh.hangThanhVien = 'Bạc';
        else kh.hangThanhVien = 'Đồng';

        kh.ngayCapNhat = new Date().toISOString();
        luu();
    }
}

module.exports = {
    layTatCa,
    layTheoSoDienThoai,
    layTheoId,
    taoMoi,
    xacThucMatKhau,
    capNhatDangNhap,
    tichLuyDonHang,
    chuanHoaSoDienThoai
};
