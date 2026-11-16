const express = require('express');
const router = express.Router();
const khachHangController = require('./khachHang.controller');

router.post('/xac-thuc', khachHangController.dangNhapHoacDangKy);
router.post('/dang-nhap-hoac-dang-ky', khachHangController.dangNhapHoacDangKy);
router.get('/thong-tin', khachHangController.layThongTin);
router.get('/lich-su-don', khachHangController.layLichSuDon);

module.exports = router;
