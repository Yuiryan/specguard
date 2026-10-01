# 9. Nhật ký Model Swap — CHƯA THỰC HIỆN

## Trạng thái

Hiện mới có kiểm thử bằng `offline-rules` và mock transport. Chưa có kết quả chạy LLM hoặc so sánh hai mô hình.

| Hạng mục | Đã làm | Còn thiếu |
|---|---|---|
| Tách adapter khỏi workflow | Có | — |
| Adapter Ollama, Gemini | Có code và mock transport test | Kiểm tra live với model được cấp quyền |
| Chạy Model A | Không | Model ID, output thật, cấu hình |
| Chạy Model B thuộc dòng khác | Không | Model ID, output thật, cấu hình |
| So sánh hai model | Không | Dữ liệu thực nghiệm |

## Cách bổ sung mà không cần API trả phí

Có thể dùng Ollama cục bộ nếu máy đủ RAM/dung lượng. Chọn hai model thuộc hai dòng khác nhau và ghi đúng model ID từ `ollama list`.

```powershell
# Sau khi người dùng đã cài, tải và kiểm tra hai model trong Ollama:
node evals/run-evals.mjs --adapter ollama --model TEN_MODEL_A --runs 3
node evals/run-evals.mjs --adapter ollama --model TEN_MODEL_B --runs 3
```

Nếu dùng Gemini, cấu hình key trong `.env` cục bộ (đã gitignore), chọn model còn khả dụng trong tài khoản rồi chạy:

```powershell
node --env-file=.env evals/run-evals.mjs --adapter gemini --model MODEL_ID --runs 3
```

Runner chỉ sử dụng dữ liệu tổng hợp của suite, chạy cả V1 và V2, tạo một thư mục timestamp riêng. Mỗi lần gọi có timeout 120 giây; lỗi quota/kết nối được ghi ADAPTER_ERROR, không chuyển sang mock và không tính thành thành công.

## Quy trình so sánh công bằng

Giữ nguyên input, schema, prompt theo phiên bản, temperature 0 và bộ chấm. Chạy 3 lượt/ca/model. Ghi tên model, nhà cung cấp, thời điểm, quantization nếu local và môi trường máy. Ghi lại các thay đổi transport/format.

Tách hai nhóm: ca bị code chặn trước model (9–10 ca tùy input) và ca model thực sự nhận. Báo cáo tỷ lệ đạt end-to-end không đồng nghĩa model giỏi hơn. Bổ sung các đặc tả đầy đủ nhưng nhiều cách diễn đạt để đo chất lượng model thay vì chỉ đo input gate.

Chỉ số cần điền từ log: số JSON hợp lệ; số tiêu chí có căn cứ; tỷ lệ dừng đúng; số ca đạt tất cả 3 lượt; latency trung bình/p95 nếu đủ mẫu. Runner chưa thu thập chi phí/token.

Nếu xuất hiện lỗi thật, thêm phân tích 5-Whys tương ứng và cập nhật các mục 5, 6, 8, 12.

## Tài liệu giao thức

- [Ollama /api/chat](https://docs.ollama.com/api/chat): chat messages, `stream: false`, format JSON.
- [Gemini generateContent](https://ai.google.dev/api/generate-content): system instruction, contents và response MIME type.

Các giao thức đã được tham khảo khi viết adapter; khả năng tương thích với model cụ thể chưa được kiểm chứng live.
