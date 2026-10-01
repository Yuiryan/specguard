# SpecGuard — Rà soát yêu cầu phần mềm có căn cứ

Đây là bài tập cuối khoá của AOTS x HCMUT khoá 2026. SpecGuard nhận một đặc tả tính năng có nhãn, phát hiện thông tin thiếu và tạo bản nháp tiêu chí nghiệm thu Given/When/Then với trích dẫn. Người dùng phải đối chiếu trước khi xuất JSON. Ví dụ xuyên suốt là tính năng đặt phòng tự học.

## Dùng ngay

Mở trực tiếp **[index.html](index.html)** bằng trình duyệt sau khi tải repo; không cần mạng, API key hay cài thư viện. Nếu trình duyệt hạn chế file cục bộ, dùng Node.js 20+:

```sh
npm start
```

Mở `http://127.0.0.1:8787`. Chọn tình huống mẫu → chọn V1/V2 → Rà soát → đối chiếu trích dẫn → đánh dấu xác nhận → tải JSON. Khi sửa input hoặc đổi phiên bản, kết quả và xác nhận cũ bị hủy.

## Tài liệu

- **[SUBMISSION.md](SUBMISSION.md)**: đối chiếu 12 yêu cầu.
- **[docs/report.md](docs/report.md)**: báo cáo tổng hợp.
- **[evals/v1-vs-v2.md](evals/v1-vs-v2.md)**: kết quả kiểm thử V1–V2.
- **[docs/case-study.md](docs/case-study.md)**: case study của dự án.
- **[demo/demo-script.md](demo/demo-script.md)**: kịch bản 180 giây và các ảnh chạy thật.
- **[Video demo 3 phút](demo/specguard-demo-180s.mp4)**: giới thiệu quy trình và kết quả kiểm thử.

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
``
