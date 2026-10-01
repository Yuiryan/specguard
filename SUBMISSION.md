# Đối chiếu 12 sản phẩm cuối khóa

| # | Yêu cầu | Sản phẩm tương ứng | Trạng thái |
|---|---|---|---|
| 1 | Mô tả bài toán thực tế | [01-problem-statement](docs/01-problem-statement.md)
| 2 | Thiết kế 11 thành phần | [system-design](docs/system-design.md), [sơ đồ](docs/workflow-diagram.mmd) | Có 11 mục, phân công, 6 lớp bảo vệ |
| 3 | Prototype V1 | [engine](src/specguard/engine.mjs), [prompt V1](instructions/system-prompt-v1.md) | Chạy được offline; cấu hình LLM chưa chạy thật |
| 4 | 10 kịch bản thử lửa | [test-cases.csv](evals/test-cases.csv), [cases](evals/cases.mjs) | 10 nhóm bắt buộc + PII + trường trùng |
| 5 | Kết quả thực tế V1 | [kết quả](evals/results/), [chỉ mục lần chạy](evals/results/offline-latest.json) | CSV 7 trường và raw JSON; chỉ offline |
| 6 | Phân tích 5-Whys | [failure-analysis](evals/failure-analysis.md) | Phân tích lỗi quan sát của code offline |
| 7 | Prototype V2 | [engine](src/specguard/engine.mjs), [prompt V2](instructions/system-prompt-v2.md) | Input/output gate + người duyệt|
| 8 | Đối chiếu V1–V2 | [v1-vs-v2](evals/v1-vs-v2.md) | 1/12 → 12/12 trong suite offline; chưa có LLM|
| 9 | Model Swap độc lập | [model-swap-log](docs/model-swap-log.md), [adapters](src/specguard/adapters.mjs) |có runner và quy trình bổ sung |
| 10 | Hướng dẫn và an toàn | [README](README.md), [user-guide](docs/user-guide.md), [limitations-safety](docs/limitations-safety.md) | Đã viết theo chức năng thực tế |
| 11 | Video 3 phút / link demo | [video 180 giây](demo/specguard-demo-180s.mp4), [kịch bản](demo/demo-script.md), [HTML](index.html) | Video 180 giây và ứng dụng demo |
| 12 | Case study lên GitHub/LinkedIn | [case-study](docs/case-study.md) | Đã đăng trong repository GitHub công khai |
