# Kết quả xác minh

Ngày 01/10/2026, Node.js v24.14.0 trên Windows.

| Kiểm tra | Kết quả | Giới hạn |
|---|---|---|
| `npm test` | 25/25 đạt | Adapter cloud/local chỉ dùng mock transport |
| `npm run eval` | V1 1/12, V2 12/12 | Offline, 1 lượt/ca, dữ liệu tổng hợp |
| `npm run build` | HTML tự chứa được tạo từ engine dùng trong eval | Không có bundler/dependency ngoài |
| UI ca chuẩn | REVIEW có Given/When/Then và evidence | Kiểm tra trên trình duyệt Codex |
| UI checkpoint | Nút tải khóa trước duyệt, mở sau duyệt | Không phải xác thực danh tính |
| UI V1 thiếu tiêu chí | Tái hiện “Hoàn thành trong 1 giây” | Fallback cố định, không phải LLM |
| UI V2 thiếu tiêu chí | NEED_INFO và khóa xuất | Có ảnh chụp kết quả |
| UI injection, PII | REFUSED; email thành [EMAIL] | Chỉ mẫu đã thử |
| Video | 1.800 khung hình, 10 fps, 180,0 giây | 7 cảnh ghép ảnh, không âm thanh |
