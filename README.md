# SpecGuard — Rà soát yêu cầu phần mềm có căn cứ

**Capstone Buổi 12 · Hồ sơ dành cho GitHub Yuiryan · Bản offline, 01/10/2026**

SpecGuard nhận một đặc tả tính năng có nhãn, phát hiện thông tin thiếu và tạo bản nháp tiêu chí nghiệm thu Given/When/Then với trích dẫn. Người dùng phải đối chiếu trước khi xuất JSON. Ví dụ xuyên suốt là tính năng đặt phòng tự học.

> **Trạng thái bằng chứng:** ứng dụng offline chạy thật, V1 đạt **1/12**, V2 đạt **12/12** trên bộ dữ liệu tổng hợp. Đây là kiểm thử code bằng luật, **không phải kết quả đánh giá LLM**. Chưa gọi mô hình thật; chưa hoàn tất Model Swap. Không nên trình bày hồ sơ này là đã hoàn thành toàn bộ yêu cầu AI của khóa học.

## Dùng ngay

Mở trực tiếp **[index.html](index.html)** bằng trình duyệt sau khi tải repo; không cần mạng, API key hay cài thư viện. Nếu trình duyệt hạn chế file cục bộ, dùng Node.js 20+:

```sh
npm start
```

Mở `http://127.0.0.1:8787`. Chọn tình huống mẫu → chọn V1/V2 → Rà soát → đối chiếu trích dẫn → đánh dấu xác nhận → tải JSON. Khi sửa input hoặc đổi phiên bản, kết quả và xác nhận cũ bị hủy.

## Bài nộp và bằng chứng

- **[SUBMISSION.md](SUBMISSION.md)**: đối chiếu đủ 12 yêu cầu, trạng thái thực tế và phần còn thiếu.
- **[docs/report.md](docs/report.md)**: bài báo cáo tổng hợp để đọc/nộp cùng repository.
- **[evals/v1-vs-v2.md](evals/v1-vs-v2.md)**: bảng số liệu sinh từ lần chạy thực tế.
- **[docs/case-study.md](docs/case-study.md)**: bài portfolio, không giả nhận dữ liệu khách hàng hoặc thành tích chưa đo.
- **[demo/demo-script.md](demo/demo-script.md)**: kịch bản 180 giây và các ảnh chạy thật.
- **[Video demo 3 phút](demo/specguard-demo-180s.mp4)**: thuyết minh bằng chữ, ghép ảnh kết quả chạy thật; không có giọng đọc.

## Tái lập

Không có dependency npm, không cần `npm install`.

```sh
npm test
npm run build
npm run eval
```

`npm test` kiểm tra regression, PII trước adapter, schema, trích dẫn giả, SLA bịa, lỗi kết nối, checkpoint xuất và giao thức adapter bằng mock transport. `npm run eval` chạy 12 ca qua cả V1/V2, tạo CSV đủ 7 trường và JSON từng lượt. Không ghi đè các lần chạy cũ. `npm run build` gộp engine và dữ liệu mẫu vào một HTML độc lập.

## Cấu trúc

```text
README.md · SUBMISSION.md · index.html
app.mjs                       # máy chủ cục bộ, chỉ phục vụ trang demo
docs/                         # bài toán, 11 thành phần, hướng dẫn, case study
instructions/                 # prompt V1 và V2 cho chế độ LLM tương lai
src/specguard/engine.mjs       # V1, V2, input/output gate, offline adapter
src/specguard/adapters.mjs     # Ollama và Gemini (CLI, chưa xác minh live)
evals/                        # 12 ca, grader, runner, raw evidence, 5-Whys
tests/                        # kiểm thử tự động
web/template.html             # giao diện nguồn
scripts/build-demo.mjs         # dựng demo từ cùng engine dùng trong eval
demo/                         # mẫu input, kịch bản, ảnh/video demo
```

## Kết nối mô hình sau

Xem **[docs/model-swap-log.md](docs/model-swap-log.md)**. Mô hình chỉ chạy qua CLI. Giao diện HTML luôn offline và không yêu cầu key. Tham số model do người dùng chọn từ danh sách thực tế của nhà cung cấp hoặc máy cục bộ.

## Giới hạn cần hiểu

Đầu vào hiện tại là tiếng Việt có 4 nhãn cố định, tối đa 12.000 ký tự ở V2. Không đọc PDF/DOCX, không OCR, không RAG. Cổng từ khóa có thể chặn nhầm và bỏ sót. Cổng trích dẫn kiểm tra sự hiện diện, không xác minh sự thật nghiệp vụ; người dùng vẫn phải duyệt. Ghép nhiều yêu cầu/tiêu chí có thể gắn sai quan hệ, nên demo ưu tiên một tính năng mỗi lần. Chưa đo hiệu quả người dùng, chi phí API hay độ ổn định LLM.

## Nguồn tham khảo và đóng góp AI

Tham khảo **cách tổ chức hồ sơ** của [TaskLens](https://github.com/truonghienminh-HCMUT/tasklens), commit `6e4297bed26598373fe6fd1d86f95691c3fe7364`; không sao chép mã nguồn, bảng điểm hoặc nhận diện tác giả của repo đó. Yêu cầu nộp lấy từ PDF Buổi 12 người dùng cung cấp, trang 41; các nguyên tắc thiết kế từ trang 9, 17–18, 24–27. Không đưa PDF khóa học lên repo.

Mã nguồn và bản thảo này được tạo với sự hỗ trợ của AI theo yêu cầu chủ tài khoản Yuiryan. Chủ tài khoản cần đọc, chạy thử, hiểu và chỉnh sửa theo quy định khóa học trước khi nhận trách nhiệm cho bài nộp. Chưa biết họ tên/MSSV nên không tự điền.
