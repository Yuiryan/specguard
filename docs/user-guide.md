# 10. Hướng dẫn sử dụng

## Khởi động offline

Tải repository hoặc giải nén gói bàn giao. Mở `index.html` bằng Chrome/Edge. Không cần tài khoản, API hoặc internet. Cách thay thế: cài Node.js 20+, chạy `npm start` tại thư mục dự án và mở `http://127.0.0.1:8787`. Máy chủ chỉ nghe trên loopback; không mở dịch vụ cho mạng LAN.

## Chuẩn bị input

```text
Người dùng: Sinh viên đã đăng nhập
Mục tiêu: Đăng ký phòng tự học
Yêu cầu: Chọn phòng còn trống và nhấn Đặt chỗ
Tiêu chí: Hiển thị mã đặt chỗ và cập nhật phòng thành đã đặt trong 2 giây với 50 người dùng đồng thời
```

Mỗi nhãn phải ở đầu một dòng và theo sau bởi dấu hai chấm. Không nhập file PDF/DOCX; tự trích phần liên quan sang văn bản. Nên gửi một tính năng mỗi lượt. `Mục tiêu` dùng làm điều kiện đủ input; bản offline chưa kiểm tra ngữ nghĩa giữa mục tiêu và hành vi.

## Các bước thao tác

1. Chọn mẫu hoặc dán đặc tả vào vùng nhập. Chỉ dùng dữ liệu tổng hợp khi thử V1.
2. Chọn V2 và bấm **Rà soát đặc tả**. Nếu dùng bàn phím, Tab tới nút rồi Enter.
3. Đọc trạng thái: REVIEW là bản nháp chờ duyệt; NEED_INFO yêu cầu bổ sung; REFUSED dừng do phạm vi/rủi ro; INVALID_INPUT báo rỗng/rác.
4. Với REVIEW, kiểm tra từng Given/When/Then và phần trích dẫn, đặc biệt quan hệ giữa yêu cầu và tiêu chí.
5. Đánh dấu đã đối chiếu và bấm tải JSON. File được tạo ở trình duyệt, không tự gửi tới dịch vụ nào.

Khi sửa input hoặc đổi phiên bản, kết quả cũ và dấu xác nhận được xóa. Không dùng xác nhận của input trước cho input sau. Chế độ LLM chạy bằng CLI theo `model-swap-log.md`, không có ô API key trong giao diện.

## Xử lý lỗi phổ biến

| Hiện tượng | Cách xử lý |
|---|---|
| MISSING_Tiêu chí | Bổ sung kết quả quan sát được, không chỉ mô tả thao tác |
| AMBIGUOUS | Làm rõ cụm như “nhanh nhất có thể”, thêm phép đo và điều kiện tải |
| CONTRADICTION | Người ra yêu cầu chọn chính sách đăng nhập nhất quán |
| CONTEXT_LIMIT | Chia thành tính năng nhỏ, giữ ràng buộc liên quan cùng nhau |
| UNGROUNDED_CITATION / UNSUPPORTED_CRITERION | Đối chiếu kết quả model; chưa được xuất bản nháp này |
| ADAPTER_ERROR | Kiểm tra model ID, kết nối, quota, key cục bộ; không coi là test pass |
| Cổng 8787 bận | Đổi biến môi trường PORT rồi khởi động lại |

Không sử dụng dữ liệu nhận dạng thật để minh họa lớp che PII; dùng `example.invalid` như bộ mẫu.
