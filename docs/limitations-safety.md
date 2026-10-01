# Giới hạn, an toàn và ranh giới trách nhiệm

## Những gì đã được chứng minh

12 ca offline có raw output và 25 unit test đã chạy. Kiểm tra giao diện xác nhận: xuất bị khóa trước duyệt, mở sau duyệt, đổi input xóa xác nhận, V1 có fallback sai và V2 hỏi lại. Mock transport xác nhận cách dựng request Ollama/Gemini; không xác nhận mô hình live hoạt động.

## Những gì chưa được chứng minh

- Không có LLM Evals, Model Swap hoặc dữ liệu vận hành thật.
- Không có kiểm chứng tính đúng sự thật của thông tin đầu vào.
- Không hiểu đầy đủ văn bản tự do, mâu thuẫn đa bước, ngoại lệ hay phủ định phức tạp.
- Regex injection và PII có thể bị né bằng cách diễn đạt/encoding khác, đồng thời có thể chặn nhầm nội dung hợp lệ.
- Offline adapter ghép các tiêu chí vào từng yêu cầu; đặc tả nhiều tính năng có thể sai quan hệ. Vì vậy mỗi lượt nên chỉ có một tính năng.
- Gate trích dẫn không chứng minh semantic entailment. Một câu có thật vẫn có thể sai, lỗi thời hoặc bị gắn sai ngữ cảnh.
- Không có OCR, upload file, truy hồi kiến thức, tự gọi công cụ hoặc hệ thống xác thực multi-user.
- Giới hạn 12.000 ký tự chỉ áp dụng V2; V1 chỉ dùng với mẫu nhỏ tổng hợp.

## Dữ liệu và quyền

Browser demo không gọi API, không lưu localStorage, không gửi telemetry. Nút tải tạo file JSON trong máy người dùng. Khi chạy CLI Gemini, input sau sanitizer của V2 được gửi tới Gemini; V1 gửi nguyên văn dữ liệu test tổng hợp. Ollama được giới hạn endpoint loopback. Không có lệnh shell, mail, database hoặc tool nào được đưa cho model.

`.env` và các thư mục riêng tư/logs bị gitignore. Không đặt key trong HTML hoặc URL. Các CSV/raw JSON trong repo là dữ liệu tổng hợp đã chủ động cho công khai. Không chạy eval với dữ liệu riêng rồi commit cả thư mục kết quả. Masking không thay thế việc rà soát dữ liệu trước khi gửi dịch vụ.

## Human checkpoint có ý nghĩa gì?

Checkbox là rào chắn quy trình, không phải chữ ký số hay kiểm soát truy cập. Người dùng vẫn có thể sửa HTML hoặc gọi engine trực tiếp; bản prototype không nhằm chống người sở hữu máy. Người duyệt chịu trách nhiệm đối chiếu bản nháp trước khi dùng làm điều kiện nghiệm thu. Dự án không tự đưa quyết định pháp lý, tuyển dụng, y tế hoặc cam kết SLA.

## Khi đưa vào sử dụng thật

Thu thập dữ liệu có sự đồng ý, tạo holdout độc lập, đo lỗi trên từng nhóm, kiểm tra thực tế PII, bổ sung xác thực/quyền và retention nếu lưu server. Chạy ít nhất hai dòng mô hình, đánh giá lại sau mọi thay đổi model/prompt/guardrail. Những bước này là công việc tiếp theo, chưa có trong bản bàn giao.
