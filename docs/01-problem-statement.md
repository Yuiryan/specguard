# 1. Bài toán: đặc tả chưa rõ dẫn đến nghiệm thu lệch kỳ vọng

## Bối cảnh và người dùng

Một nhóm sinh viên làm tính năng đặt phòng tự học. Thành viên nhận yêu cầu “đặt phòng nhanh, dễ dùng” rồi tự quyết định thời gian phản hồi, điều kiện đăng nhập và kết quả sau khi bấm nút. Người viết test và người viết code vì thế có thể hiểu khác nhau. Đây là tình huống thiết kế tổng hợp, chưa phải kết quả phỏng vấn hoặc số liệu từ một dự án thật.

Người dùng trực tiếp là sinh viên phụ trách phân tích yêu cầu hoặc kiểm thử trong nhóm đồ án. Họ đọc được đặc tả cơ bản nhưng cần checklist để phát hiện thông tin chưa đủ trước khi viết test. Nút thắt được chọn là bước **chuyển một mô tả tính năng thành tiêu chí nghiệm thu có căn cứ**.

## Quy trình thủ công

Đọc mô tả → xác định tác nhân và mục tiêu → gạch chân hành vi → tìm kết quả có thể quan sát → ghi câu hỏi còn thiếu → thống nhất với nhóm → viết tiêu chí Given/When/Then. Những bước cần phán đoán nghiệp vụ vẫn thuộc con người.

## Input và output

Input gồm 4 nhãn trên từng dòng: `Người dùng`, `Mục tiêu`, `Yêu cầu`, `Tiêu chí`. Output là trạng thái, cảnh báo, câu hỏi và các tiêu chí có bằng chứng. Ví dụ “Tiêu chí” bị thiếu thì hệ thống phải trả `NEED_INFO`, không tự đặt “1 giây”.

## Phạm vi khả thi

Phiên bản hiện tại xử lý một tính năng mỗi lần, tiếng Việt, tối đa 12.000 ký tự. Không phân tích mã nguồn, không tạo ticket, không truy cập database, không gửi email, không thay người dùng phê duyệt. Đầu vào có thể mô tả hành động “gửi email” của phần mềm đang được đặc tả; SpecGuard chỉ trích nội dung, không thực hiện hành động đó.

## Vì sao có lớp AI?

AI có thể giúp hiểu nhiều cách diễn đạt hoặc đặt câu hỏi làm rõ. Tuy vậy, vì chưa có mô hình được cấp cấu hình, bản bàn giao sử dụng luật và trích xuất theo nhãn để chứng minh kiến trúc. Với dữ liệu có cấu trúc như hiện tại, thuật toán truyền thống đã làm được phần lớn công việc; chưa có bằng chứng AI tạo thêm giá trị. Muốn mở rộng sang mô tả tự do cần model thật và một bộ kiểm thử độc lập mới.

## Tiêu chí thành công và đo lường

- Đặc tả đầy đủ tạo được bản nháp có trích dẫn, chờ người duyệt.
- Thiếu tiêu chí, mâu thuẫn hoặc giá trị âm không sinh tiêu chí tự bịa.
- PII thông dụng được che trước khi tới adapter và không xuất lại ở V2.
- Mọi thay đổi input hủy xác nhận cũ.
- Đo số ca đạt, số lần gọi adapter và độ trễ. Chưa đặt tỷ lệ tiết kiệm thời gian khi chưa có nghiên cứu người dùng.

Mục tiêu thử nghiệm là đạt 12/12 ca tổng hợp đã công khai. Đây là mục tiêu regression hẹp, không phải cam kết độ chính xác ngoài thực tế.
