# 12. Case study portfolio: SpecGuard biết dừng trước khi đặt tiêu chí sai

**Dự án capstone cho GitHub Yuiryan · Bản offline có hỗ trợ xây dựng từ AI · 01/10/2026**

## Situation — Một khoảng trống nhỏ trong đặc tả

Trong tình huống nhóm sinh viên xây dựng tính năng đặt phòng tự học, câu “đặt phòng nhanh” chưa cho biết cần hiển thị kết quả gì, nhanh bao lâu và dưới tải nào. Nếu người viết code tự chọn một con số, nhóm có thể nghiệm thu trên tiêu chuẩn chưa ai thống nhất. Tình huống này được xây dựng để thử nghiệm; chưa có khảo sát người dùng thực tế.

## Task — Tạo tiêu chí có căn cứ và nêu rõ phần thiếu

SpecGuard nhận tác nhân, mục tiêu, yêu cầu và tiêu chí; tạo bản nháp Given/When/Then kèm trích dẫn. Thiếu tiêu chí thì hỏi lại. Công cụ không tạo ticket, không gửi email và không quyết định nghiệp vụ thay người dùng.

## Action — Đưa điều kiện dừng vào code

Thiết kế gồm 11 thành phần, luồng input → sanitize → adapter → validate → human review. Để chạy được khi chưa có API, bản prototype dùng adapter offline theo luật. Adapter này cũng làm rõ giới hạn: chỉ hiểu cấu trúc đã quy định, chưa phải một trợ lý AI hiểu ngôn ngữ tự do.

V1 gọi adapter trực tiếp. Ở ca thiếu Tiêu chí, adapter dùng fallback “Hoàn thành trong 1 giây”. Từ log này, phân tích 5-Whys xác định thiếu tiền điều kiện và thiếu kiểm tra căn cứ. V2 thêm input gate để không gọi adapter khi thiếu, rồi kiểm tra mỗi tiêu chí có bằng chứng trước khi cho người dùng duyệt.

Bộ test gồm 10 nhóm thử lửa của buổi học, cộng PII và trường trùng. Grader kiểm tra hành vi quan sát được; không chấp nhận câu “tôi đã kiểm tra” từ generator làm bằng chứng. Giao diện và runner dùng chung engine, giảm khả năng demo và eval chạy hai logic khác nhau.

## Result — Kết quả thực nghiệm trong phạm vi offline

Lần chạy công khai cho kết quả **V1 1/12, V2 12/12**, tăng 11 ca đạt trên suite tổng hợp. **25 unit test đạt**. Đây là cải thiện của luồng code khi giữ nguyên adapter offline, không chứng minh chất lượng của LLM hay hiệu quả chỉnh prompt. Latency được ghi trong từng log, nhưng không đại diện độ trễ gọi mô hình.

Các assertion xác nhận V2 không sinh tiêu chí ở ca thiếu dữ kiện, chặn những mẫu rủi ro đã định nghĩa và che email tổng hợp trước adapter. Giao diện yêu cầu người dùng duyệt trước khi tải JSON. Toàn bộ test input, kết quả CSV, raw JSON và lệnh tái lập đều đi kèm repository.

## Reflection — Minh bạch còn quan trọng hơn bảng điểm đẹp

12/12 không đồng nghĩa production-ready. Bộ test và luật được xây dựng cùng nhau, chưa có holdout độc lập. Trích dẫn có thật không xác nhận thông tin đúng, và regex không bao phủ tất cả cách diễn đạt. AI chỉ có giá trị khi giải quyết được phần mà template khó xử lý; điểm này còn cần chứng minh.

Repo đã tách adapter Ollama/Gemini và có quy trình chạy hai dòng mô hình, nhưng **Model Swap chưa được thực hiện**. Không đổi tên hai mock rồi coi là hai model. Bước tiếp theo là chạy model thật, bổ sung dữ liệu độc lập, phân tích lỗi mới và cập nhật bài viết theo bằng chứng.

## Gợi ý mô tả ngắn cho portfolio

> Xây dựng SpecGuard, prototype rà soát đặc tả phần mềm có input/output gate và human review. Tạo 12 ca kiểm thử tổng hợp, phân tích lỗi bằng 5-Whys và cải thiện tỷ lệ đạt offline từ 1/12 lên 12/12. Tách adapter để chuẩn bị thử nghiệm mô hình độc lập; chưa có bằng chứng LLM Evals hoặc hiệu quả người dùng thực tế.

Nguồn cảm hứng tổ chức hồ sơ: [TaskLens](https://github.com/truonghienminh-HCMUT/tasklens). Nội dung và mã nguồn SpecGuard được xây dựng riêng. Chủ tài khoản cần hiểu, xác nhận và cá nhân hóa bài này trước khi nộp; không nên nhận là nghiên cứu người dùng hoặc kết quả AI đã thực hiện.
