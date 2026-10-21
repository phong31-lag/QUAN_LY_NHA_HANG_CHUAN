# BÁO CÁO TIẾN ĐỘ CÔNG VIỆC CÁ NHÂN - SPRINT 1 (TUẦN 1)

**Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (Quán Mộc - quanmoc.com)  
**Thành viên:** Phong  
**Vai trò:** Frontend Developer (Admin Core, Xác thực & Cấu hình nền tảng)  
**Thời gian hoàn thành:** 19/10/2026  
**Trạng thái:** 100% Hoàn thành (22/22 User Stories)

---

## 1. Mục tiêu công việc trong Sprint 1
- Dựng khung giao diện Quản trị (**Admin Layout**) chuẩn Responsive (Sidebar động theo Role, Header cá nhân, chuông thông báo, đăng xuất).
- Cấu hình hệ thống Single Page Application (**SPA Router**) tích hợp bộ bảo vệ **Route Guard** (`US-004`) và cơ chế tự động đăng xuất khi hết hạn phiên (`US-003`).
- Phân luồng hiển thị menu và kiểm soát quyền truy cập chặt chẽ theo vai trò: Bếp KDS (`US-019`), Thu ngân POS (`US-020`), Quản lý (`US-021`).
- Xây dựng giao diện Xác thực: Đăng nhập (`US-007`), Đăng xuất (`US-008`), Hồ sơ cá nhân (`US-010`), Đổi mật khẩu (`US-009`).
- Xây dựng module Quản trị Nhân sự: Tạo mới (`US-011`), Danh sách & tìm kiếm thời gian thực (`US-012`), Cập nhật & đặt lại mật khẩu (`US-013`), Khóa/mở khóa tài khoản nhân viên nghỉ việc (`US-014`).
- Xây dựng giao diện Vai trò & Phân quyền: Danh sách vai trò (`US-015`, `US-016`), Gán vai trò (`US-017`), Ma trận phân quyền chức năng chi tiết (`US-018`), Ghi nhận lịch sử phân quyền (`US-022`).
- Xây dựng module Cấu hình Quán: Cấu hình thông tin quán (`US-041`), Thuế VAT & phí phục vụ (`US-042`), Tài khoản VietQR tạo mã động theo chuẩn NAPAS 247 (`US-043`), Tra cứu System Logs (`US-044`).

---

## 2. Bảng tổng hợp kết quả thực hiện theo User Stories

| Mã US | Tên User Story | Nội dung thực hiện & Kết quả | Tệp tin đảm nhiệm | Tiến độ |
|---|---|---|---|:---:|
| **US-003** | Tự động đăng xuất khi hết hạn phiên | Interceptor bắt mã 401 khi token hết hạn, xóa phiên và điều hướng về trang đăng nhập | `api.js`, `boDinhTuyen.js` | 100% |
| **US-004** | Chặn truy cập trái phép (Route Guard) | Kiểm tra trạng thái xác thực trước mọi route, chặn truy cập khi chưa đăng nhập | `boDinhTuyen.js` | 100% |
| **US-007** | Đăng nhập hệ thống nhân viên / quản lý | Form đăng nhập chuẩn UX, validate dữ liệu, toggle ẩn/hiện mật khẩu, nút chọn nhanh tài khoản mẫu | `dangNhap.js` | 100% |
| **US-008** | Đăng xuất khỏi thiết bị | Modal popup xác nhận đăng xuất an toàn, xóa token và thông tin người dùng | `dangNhap.js`, `khungQuanTri.js` | 100% |
| **US-009** | Đổi mật khẩu cá nhân | Form đổi mật khẩu cá nhân có kiểm tra độ dài tối thiểu 6 ký tự và xác nhận khớp mật khẩu | `hoSoCaNhan.js` | 100% |
| **US-010** | Xem & cập nhật thông tin hồ sơ | Hiển thị thông tin cá nhân và cho phép cập nhật tức thì họ tên, số điện thoại, email | `hoSoCaNhan.js` | 100% |
| **US-011** | Tạo mới tài khoản nhân viên | Modal thêm mới nhân viên kèm chọn vai trò (Thu ngân, Bếp, Phục vụ, Quản lý) | `quanLyNhanVien.js` | 100% |
| **US-012** | Xem danh sách & tìm kiếm nhân viên | Bảng nhân sự kèm bộ lọc vai trò, lọc trạng thái và ô tìm kiếm real-time theo tên/sđt/username | `quanLyNhanVien.js` | 100% |
| **US-013** | Cập nhật thông tin & Đặt lại mật khẩu | Sửa thông tin nhân sự; nút khôi phục mật khẩu mặc định (123456) khi nhân viên quên | `quanLyNhanVien.js` | 100% |
| **US-014** | Khóa / Mở khóa tài khoản nhân viên | Nút chuyển đổi trạng thái Khóa/Mở khóa tài khoản nghỉ việc mà không mất lịch sử hóa đơn | `quanLyNhanVien.js` | 100% |
| **US-015** | Xem danh sách vai trò nhà hàng | Hiển thị 4 vai trò chính: Quản lý, Thu ngân, Bếp, Phục vụ kèm mô tả chi tiết | `vaiTroVaQuyen.js` | 100% |
| **US-016** | Xem mô tả và quyền của từng vai trò | Xem chi tiết mô tả nhiệm vụ và danh mục quyền đã cấp cho từng vai trò | `vaiTroVaQuyen.js` | 100% |
| **US-017** | Gán vai trò cụ thể cho nhân viên | Cho phép chọn và gán vai trò khi tạo mới hoặc cập nhật hồ sơ nhân sự | `quanLyNhanVien.js` | 100% |
| **US-018** | Cấu hình ma trận quyền hạn chi tiết | Ma trận phân quyền dạng checkbox gồm 4 nhóm nghiệp vụ (KDS, POS, Thực đơn, Quản trị) | `vaiTroVaQuyen.js` | 100% |
| **US-019** | Kiểm soát quyền tài khoản Bếp | Tài khoản Bếp chỉ thấy màn hình KDS, tự động chặn vào các trang quản trị/nhân sự/doanh thu | `boDinhTuyen.js` | 100% |
| **US-020** | Kiểm soát quyền tài khoản Thu ngân | Tài khoản Thu ngân chỉ thấy sơ đồ bàn/thanh toán, bị chặn vào các trang cấu hình & nhân sự | `boDinhTuyen.js` | 100% |
| **US-021** | Kiểm soát quyền Quản lý | Chỉ tài khoản Quản lý mới có toàn quyền truy cập nhân sự, vai trò, cấu hình và logs | `boDinhTuyen.js` | 100% |
| **US-022** | Ghi nhận lịch sử phân quyền | Bảng tra cứu lịch sử: người thực hiện, hành động sửa quyền, thời gian và ghi chú | `lichSuPhanQuyen.js` | 100% |
| **US-041** | Cấu hình thông tin chung nhà hàng | Form cập nhật tên quán, địa chỉ, số điện thoại hotline, tên và mật khẩu Wifi | `cauHinhNhaHang.js` | 100% |
| **US-042** | Cấu hình thuế VAT & phí phục vụ | Cấu hình tỷ lệ phần trăm thuế VAT mặc định (8%) và phí phục vụ đưa vào hóa đơn | `cauHinhNhaHang.js` | 100% |
| **US-043** | Cấu hình tài khoản VietQR | Cấu hình Ngân hàng, STK, Chủ tài khoản kèm hình ảnh preview mã VietQR NAPAS 247 | `cauHinhNhaHang.js` | 100% |
| **US-044** | Tra cứu nhật ký hệ thống (System Logs) | Bảng logs hệ thống có lọc theo mức độ (INFO/WARN/ERROR) và tìm kiếm nội dung | `nhatKyHeThong.js` | 100% |

---

## 3. Danh mục các tệp tin đã triển khai
Toàn bộ mã nguồn nằm gọn trong thư mục `frontend/`, tuyệt đối không can thiệp vào các thư mục `backend/`, `database/`, hay các trang của thành viên khác:
- `index.html`: Entry point nạp ứng dụng SPA.
- `ungDung.js`: Khởi chạy ứng dụng và lắng nghe sự kiện tải trang.
- `tepGiaoDien.css`: Bảng kiểu Design System (Responsive Mobile/Tablet/Desktop, Toast, Modal, Badges, Table).
- `dungChung/hangSo.js`: Hằng số vai trò, quyền hạn RBAC, đường dẫn và LocalStorage keys.
- `dungChung/dinhDang.js`: Format tiền VND, ngày giờ, huy hiệu trạng thái tài khoản.
- `dungChung/api.js`: Wrapper gọi API chuẩn `{ ok, data, msg }`, Interceptor 401 & Mock Data Service độc lập.
- `dinhTuyen/boDinhTuyen.js`: Router SPA, Route Guard (`US-004`), Phân quyền theo Role (`US-019`–`US-021`).
- `thanhPhan/khungQuanTri.js`: Admin Layout (Header hồ sơ & Sidebar phân quyền động).
- `thanhPhan/thongBao.js`: Toast notification nổi nhiều trạng thái.
- `thanhPhan/hopThoai.js`: Modal popup xác nhận thao tác.
- `trang/dangNhap/dangNhap.js`: Giao diện Đăng nhập & Đăng xuất.
- `trang/taiKhoan/hoSoCaNhan.js`: Màn hình Hồ sơ cá nhân & Đổi mật khẩu.
- `trang/nhanVien/quanLyNhanVien.js`: Quản lý danh sách, tìm kiếm, thêm, sửa, khóa nhân viên.
- `trang/quanTri/vaiTroVaQuyen.js`: Danh sách vai trò & Ma trận phân quyền checkbox.
- `trang/quanTri/lichSuPhanQuyen.js`: Màn hình Lịch sử thay đổi quyền hạn.
- `trang/quanTri/cauHinhNhaHang.js`: Cấu hình nhà hàng, thuế VAT và VietQR.
- `trang/quanTri/nhatKyHeThong.js`: Tra cứu nhật ký hoạt động hệ thống.

---

## 4. Kết quả kiểm thử thực tế (Test Cases)
- **TC-01 (Route Guard):** Thử vào URL quản trị khi chưa login ➔ Bị chặn, hiện cảnh báo, đẩy về trang đăng nhập (PASS).
- **TC-02 (Đăng nhập hợp lệ):** Đăng nhập bằng `admin` / `123456` ➔ Thành công, lưu token, vào trang Quản trị (PASS).
- **TC-03 (Đăng nhập sai):** Thử sai mật khẩu hoặc tài khoản đã khóa ➔ Báo lỗi rõ ràng, không sinh token (PASS).
- **TC-04 (Quyền Bếp US-019):** Đăng nhập bằng `bepchinh` ➔ Chỉ vào được màn hình Bếp KDS, bị chặn vào các trang nhân sự / cấu hình (PASS).
- **TC-05 (Quyền Thu ngân US-020):** Đăng nhập bằng `thungan01` ➔ Chỉ vào được màn hình Bàn/Thu ngân, bị chặn vào các trang quản trị (PASS).
- **TC-06 (Thêm nhân viên US-011):** Thêm nhân viên `thungan02` ➔ Hiển thị ngay trên bảng dữ liệu (PASS).
- **TC-07 (Khóa tài khoản US-014):** Bấm khóa tài khoản ➔ Modal xác nhận xuất hiện, trạng thái chuyển 'Đã khóa', chặn đăng nhập (PASS).
- **TC-08 (Ma trận phân quyền US-018 & US-022):** Thay đổi checkbox quyền và lưu ➔ Lưu thành công, tự động ghi nhận vào Lịch sử phân quyền (PASS).
- **TC-09 (VietQR & VAT):** Đổi STK ngân hàng ➔ Lưu thành công, hình ảnh preview VietQR tự cập nhật theo STK mới (PASS).

---

## 5. Kế hoạch cho Sprint 2
- Phối hợp với Nhật (Backend Lead) để đấu nối API Auth JWT thật khi server Express hoàn thành.
- Triển khai màn hình Điều phối Bếp KDS thời gian thực nhận đơn qua Socket.io.
- Triển khai phân hệ Báo cáo Doanh thu & Biểu đồ phân tích kinh doanh (Dashboard Analytics).
