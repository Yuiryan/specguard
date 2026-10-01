# 11. Demo 180 giây

**Chế độ:** offline, dữ liệu tổng hợp. Video `specguard-demo-180s.mp4` là bản thuyết minh bằng chữ ghép từ ảnh chụp giao diện chạy thật, không có giọng đọc và không phải bản quay thao tác liên tục. Có thể mở `index.html` để tự thao tác toàn bộ ví dụ.

| Thời gian | Nội dung trình bày | Bằng chứng hiển thị |
|---|---|---|
| 00:00–00:25 | Bài toán: thiếu tiêu chí khiến nhóm tự đặt chuẩn nghiệm thu. Giới thiệu phạm vi offline | Ảnh ca chuẩn, tên sản phẩm và nhãn offline |
| 00:25–00:50 | Input 4 nhãn, output Given/When/Then và quote | Ca đặt phòng tự học, REVIEW |
| 00:50–01:20 | Bỏ trường Tiêu chí, chọn V1: tự sinh 1 giây | Ảnh lỗi V1 và trích input thiếu |
| 01:20–01:50 | Giữ input, chọn V2: dừng và yêu cầu bổ sung | NEED_INFO, không criteria, khóa tải |
| 01:50–02:15 | Mẫu chỉ dẫn tấn công: V2 từ chối | SUSPECTED_INJECTION |
| 02:15–02:40 | Email tổng hợp được che; người dùng đối chiếu trước khi tải | [EMAIL], nhãn đã che và checkbox |
| 02:40–03:00 | Kết quả offline 1/12 → 12/12; công khai hạn chế | 25 test đạt; Model Swap chưa thực hiện |

## Tự quay lại nếu cần thuyết trình trực tiếp

Chạy `npm start`, mở localhost và làm lần lượt các bước trên. Khi có kết quả LLM, cập nhật phần số liệu trong video theo log mới.

## Kiểm tra giao diện đã thực hiện

- Ca chuẩn tạo bản nháp có evidence.
- Trước khi tick, nút tải bị khóa; sau tick, được mở.
- Đổi mẫu/phiên bản xóa kết quả và xác nhận cũ.
- V1 trên input thiếu tạo SLA không có căn cứ; V2 dừng.
- Injection bị từ chối; email tổng hợp trở thành `[EMAIL]` ở output V2.
- Trình duyệt kiểm tra không có lỗi console quan sát được trong các bước đã chạy.

Ảnh kết quả thật nằm ở [screenshots/](screenshots/). Chúng được chụp bằng công cụ trình duyệt, không dựng lại output bằng đồ họa.
