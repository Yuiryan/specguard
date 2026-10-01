# 6. Phân tích lỗi và 5-Whys

## Bằng chứng quan sát

Lần chạy được chỉ tới bởi `results/offline-latest.json` cho thấy V1 đạt 1/12, V2 đạt 12/12. Đối chiếu file `v1-TC02-r1.json`: đặc tả không có Tiêu chí, nhưng output là REVIEW với `then: "Hoàn thành trong 1 giây"`. Đây là lỗi fallback trong adapter offline, **không phải hallucination đã đo trên LLM**.

## Ca TC02: tiêu chí 1 giây không có căn cứ

| Bước | Câu hỏi tại sao | Câu trả lời dựa trên code/log |
|---|---|---|
| Why 1 | Tại sao có tiêu chí 1 giây? | Adapter dùng chuỗi mặc định khi không có trường Tiêu chí |
| Why 2 | Tại sao vẫn gọi adapter khi thiếu? | Luồng V1 không có bước rà soát trường bắt buộc |
| Why 3 | Tại sao output được coi là bản nháp hợp lệ? | V1 không có cổng đối chiếu giá trị với evidence |
| Why 4 | Tại sao người dùng có thể tải kết quả sai? | Checkpoint V1 chỉ yêu cầu xác nhận; không đảm bảo người dùng phát hiện thiếu căn cứ |
| Why 5 | Tại sao thiết kế cho phép điều đó? | Baseline ưu tiên luôn tạo câu trả lời; chưa biểu diễn điều kiện dừng bằng code |

**Nguyên nhân gốc:** hợp đồng thực thi thiếu tiền điều kiện và thiếu kiểm tra căn cứ, nên fallback của generator có thể đi tới người dùng.

**Sửa V2:** input gate bắt buộc có 4 nhãn; thiếu Tiêu chí trả NEED_INFO trước khi gọi adapter. Output gate yêu cầu từng giá trị AC được hỗ trợ nguyên văn bởi evidence. Với input TC02, V2 sinh câu hỏi bổ sung và không có criteria. Unit test cũng thử adapter đưa quote giả hoặc SLA không nằm trong quote để chứng minh cổng đầu ra hoạt động độc lập với input gate.

## Ca TC11: email đi ra đầu ra

1. Tại sao email tổng hợp xuất hiện trong V1? Template sao chép Tiêu chí nguyên văn.
2. Tại sao dữ liệu chưa được che? V1 không có sanitizer trước adapter.
3. Tại sao không đợi model tự che? Offline không phải model; ngay cả có model, yêu cầu bảo mật không nên chỉ trông cậy vào prompt.
4. Tại sao không chỉ che lúc hiển thị? Khi đó dữ liệu đã có thể tới nhà cung cấp model và log.
5. Tại sao cần đổi workflow? Ranh giới xử lý dữ liệu phải nằm **trước** adapter, rồi có kiểm tra lại output.

**Sửa V2:** mask trước adapter, kiểm tra PII ở output. Spy test quan sát trực tiếp source adapter nhận và xác nhận email bị thay bằng `[EMAIL]`. Đây chỉ là xác minh mẫu email đã biết; tên, địa chỉ hay số định danh mới có thể chưa được che.

## Những lỗi V1 khác

TC03/04/05/12: thiếu cổng chất lượng input. TC06/07/08: thiếu cổng phạm vi/rủi ro. TC09: không giới hạn context. TC10: xử lý cả đầu vào rỗng. V2 bổ sung kiểm tra tương ứng, nhưng regex vẫn có thể bỏ sót diễn đạt mới.

## Regression và giới hạn kết luận

Chạy lại **toàn bộ 12 ca**, không chỉ ca hỏng; TC01 vẫn đạt. Không thay expected để làm đẹp tỷ lệ. Toàn bộ input, grader và raw output đều trong repo để người khác tái lập. Chưa có tập holdout do người thứ ba xây dựng; bộ test thiết kế cùng guardrails nên kết quả 12/12 có nguy cơ đánh giá quá lạc quan. Bước tiếp theo là giữ nguyên suite này, bổ sung holdout và chạy LLM thật, ghi nhận cả lỗi mới.
