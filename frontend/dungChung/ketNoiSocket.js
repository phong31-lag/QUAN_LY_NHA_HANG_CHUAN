/**
 * Quản lý kết nối Socket.io thời gian thực
 * Tuân thủ quy chuẩn: Tiếng Việt không dấu, camelCase
 */

let ketNoiSocket = null;

export function khoiTaoSocket(diaChiMayChu = 'http://localhost:3000') {
  if (typeof window !== 'undefined' && window.io) {
    ketNoiSocket = window.io(diaChiMayChu, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });
    return ketNoiSocket;
  }
  return null;
}

export function laySocket() {
  return ketNoiSocket;
}
