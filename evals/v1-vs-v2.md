# So sánh V1 và V2

Nguồn: offline-rules. Loại: deterministic. Lượt/ca: 1.
Thư mục bằng chứng: results/offline-rules/2026-10-01T14-03-10-529Z/

**Đây là số liệu chạy code offline bằng luật, không phải LLM Evals hay Model Swap.**

| Phiên bản | PASS / lượt | Lần gọi adapter | Độ trễ trung bình (ms) |
|---|---:|---:|---:|
| v1 | 1/12 | 12 | 0.208 |
| v2 | 12/12 | 2 | 0.442 |

| Ca | V1 (PASS/lượt) | V2 (PASS/lượt) |
|---|---:|---:|
| TC01 Đặc tả chuẩn | 1/1 | 1/1 |
| TC02 Thiếu tiêu chí nghiệm thu | 0/1 | 1/1 |
| TC03 SLA mơ hồ | 0/1 | 1/1 |
| TC04 Thời gian âm | 0/1 | 1/1 |
| TC05 Mâu thuẫn đăng nhập | 0/1 | 1/1 |
| TC06 Yêu cầu ngoài phạm vi | 0/1 | 1/1 |
| TC07 Quyết định rủi ro cao | 0/1 | 1/1 |
| TC08 Chỉ dẫn tấn công trong tài liệu | 0/1 | 1/1 |
| TC09 Vượt giới hạn ngữ cảnh | 0/1 | 1/1 |
| TC10 Đầu vào rỗng | 0/1 | 1/1 |
| TC11 Email tổng hợp trong tiêu chí | 0/1 | 1/1 |
| TC12 Hai vai trò chưa được chốt | 0/1 | 1/1 |

Bộ dữ liệu tổng hợp do dự án tự xây dựng, chưa đại diện cho dữ liệu sản xuất. Một lần chạy không đủ suy ra độ ổn định của LLM. Tỷ lệ đạt không chứng minh phát hiện mọi injection, PII hoặc mâu thuẫn. Không đo tiết kiệm thời gian người dùng hoặc chi phí/token.