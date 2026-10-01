# Báo cáo cuối khóa — SpecGuard

## Tóm tắt

SpecGuard là hệ thống rà soát yêu cầu phần mềm nhằm ngăn việc tự bổ sung tiêu chí nghiệm thu không có căn cứ. Dự án được tổ chức theo vòng đời Problem → Design → Build → Test → Break → Fix → Evaluate → Demo → Portfolio.

Bản hiện tại chạy bằng thuật toán offline theo nhãn. V1 đạt 1/12 ca, V2 đạt 12/12 trên cùng suite tổng hợp; 25 unit test đạt. Có prompt và adapter chuẩn bị cho LLM nhưng chưa chạy model thật hoặc Model Swap.

## 1. Vấn đề cần giải quyết

Đặc tả thiếu tiêu chí quan sát được làm thành viên nhóm tự diễn giải khác nhau. Tính năng đặt phòng tự học được chọn làm ví dụ nhỏ, dễ đo hành vi. Người dùng trực tiếp là sinh viên phân tích yêu cầu/kiểm thử. [Mô tả đầy đủ](01-problem-statement.md).

## 2. Thiết kế hệ thống

Thiết kế đủ 11 mục: Problem, User, Input, Context/Data, AI Responsibility, Human Responsibility, Workflow, Tools, Permissions, Guardrails và Evaluation. Con người giữ trách nhiệm quyết định nghiệp vụ và duyệt xuất. [Checklist và sơ đồ](system-design.md).

## 3. Prototype V1

V1 gọi cùng offline adapter mà không có gate. Khi thiếu Tiêu chí, template mặc định “Hoàn thành trong 1 giây”. Baseline cho phép đo ảnh hưởng của các gate ở V2; không mô phỏng một model cụ thể. [Prompt V1](../instructions/system-prompt-v1.md), [mã nguồn](../src/specguard/engine.mjs).

## 4. Bộ kiểm thử

12 ca bao phủ đầu vào chuẩn, thiếu, mơ hồ, phi lý, mâu thuẫn, ngoài phạm vi, rủi ro cao, injection, quá dài, rỗng, PII và trường trùng. Dữ liệu tổng hợp được công khai; expected không dựa vào self-report của generator. [CSV](../evals/test-cases.csv).

## 5. Kết quả V1

V1 chỉ đạt ca chuẩn TC01; 11 ca còn lại không thỏa toàn bộ assertion. Kết quả được lưu bằng CSV 7 trường theo yêu cầu buổi học và log JSON cho từng lượt. Có timestamp, hash input, tên adapter và cờ xác định offline. [Chỉ mục bằng chứng](../evals/results/offline-latest.json).

## 6. Phân tích nguyên nhân gốc

TC02 cho thấy đầu ra có SLA 1 giây không có trong input. 5-Whys dẫn tới hai thiếu sót: không kiểm tra tiền điều kiện và không đối chiếu căn cứ đầu ra. TC11 dẫn tới yêu cầu che PII trước adapter. [Báo cáo 5-Whys](../evals/failure-analysis.md).

## 7. Prototype V2

V2 chuẩn hóa văn bản, che PII, kiểm tra đầu vào trước adapter; kiểm tra schema, trạng thái và trích dẫn sau adapter. Chỉ cho xuất trạng thái REVIEW sau người dùng xác nhận; sửa input hủy kết quả cũ. [Prompt V2](../instructions/system-prompt-v2.md).

## 8. Đối chiếu tiến bộ

V1 1/12 → V2 12/12; cùng dữ liệu, cùng offline adapter, cùng bộ chấm. Tăng 11 ca đạt trong phạm vi đã định nghĩa. Không coi kết quả này là độ chính xác AI, hiệu quả prompt hoặc tỷ lệ tiết kiệm thời gian. [Bảng chi tiết](../evals/v1-vs-v2.md).

## 9. Model Swap

**Chưa thực hiện.** Hai adapter Ollama và Gemini đã có giao thức và mock transport test, nhưng chưa có hai tập log model thật. Tài liệu chỉ rõ cách chọn hai dòng model, chạy 3 lượt/ca và giữ điều kiện thử nghiệm nhất quán. [Nhật ký và cách bổ sung](model-swap-log.md).

## 10. Sử dụng và an toàn

Mở index.html hoặc chạy npm start. Input có 4 nhãn, V2 tối đa 12.000 ký tự. Browser không gọi mạng; CLI LLM có gửi tới endpoint đã cấu hình. Gate regex có thể chặn nhầm/bỏ sót, và quote có thật chưa chắc nghiệp vụ đúng. [Hướng dẫn](user-guide.md), [giới hạn](limitations-safety.md).

## 11. Demo

Ứng dụng có sẵn mẫu chuẩn, thiếu dữ kiện, mâu thuẫn, injection và PII. Kịch bản 180 giây minh họa V1 tạo fallback và V2 dừng, human review và kết quả eval. [Demo](../demo/demo-script.md).

## 12. Portfolio

Case study trình bày bối cảnh, mục tiêu, cách triển khai, kết quả và giới hạn theo khung Situation–Task–Action–Result. [Bài portfolio](case-study.md).

## Hướng phát triển

Chạy kiểm thử với hai dòng mô hình độc lập, bổ sung dữ liệu đánh giá và cập nhật phân tích 5-Whys theo kết quả.
