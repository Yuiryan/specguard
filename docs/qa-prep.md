# Chuẩn bị phản biện

**Vì sao dùng AI thay vì if-else?** Bản hiện tại dùng luật vì input có cấu trúc. Chưa có bằng chứng cần AI cho phạm vi này. LLM chỉ có thể tạo giá trị khi mở rộng cách diễn đạt và đặt câu hỏi phù hợp; phải đo trước khi khẳng định.

**Dữ liệu giả có bị phát hiện không?** Một số giá trị phi lý như thời gian âm và mẫu mâu thuẫn bị chặn. Thông tin sai nhưng có vẻ hợp lý có thể đi qua. Hệ thống không xác minh nguồn ngoài, nên người dùng chịu trách nhiệm đối chiếu.

**Làm sao biết V2 không phá ca đúng?** Chạy cùng 12 ca, cùng adapter, cùng grader qua hai phiên bản; TC01 vẫn đạt. Có unit test cho PII trước adapter, quote/SLA giả và human checkpoint. Chưa có holdout độc lập nên vẫn cần test ngoài suite.

**Đổi mô hình mất bao lâu?** Interface tách rời giúp đổi cấu hình adapter, nhưng không có số liệu để hứa một khoảng thời gian. Cần kiểm tra khả dụng, output format, latency và chạy regression trên model đích. Mock transport không thay kiểm tra live.

**Rủi ro lớn nhất?** Người dùng tin tiêu chí có quote là chắc chắn đúng. Quote chỉ chứng minh chuỗi hiện diện, không bảo đảm ngữ nghĩa và sự thật. REVIEW là bản nháp, vẫn cần người hiểu nghiệp vụ duyệt.
