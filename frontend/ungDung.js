/**
 * Tệp khởi tạo ứng dụng Frontend (ungDung.js)
 * Khởi động hệ thống Router và các bộ lắng nghe sự kiện
 */
import { khoiTaoBoDinhTuyen } from './dinhTuyen/boDinhTuyen.js';

// Khởi chạy router khi ứng dụng tải
document.addEventListener('DOMContentLoaded', () => {
  khoiTaoBoDinhTuyen();
});
