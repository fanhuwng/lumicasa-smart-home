# Checklist CRUD (mục 7 của đề)

Cột "Local" đã được kiểm thử bằng API admin trên bản chạy local. Cột "Production" bạn tự điền sau khi deploy.

| # | Thao tác | Expected | Local | Production |
|---|---|---|---|---|
| 1 | **Create** Product test (để Draft) | Không hiện ở public | ✔ | |
| 2 | **Publish** | Card mới hiện ở `/products` (+ trang chủ nếu `show_on_home`), không sửa component | ✔ | |
| 3 | **Update** tên/giá/mô tả/ảnh, **Publish lại** | Frontend đổi theo | ✔ (cần Publish lại do revisions) | |
| 4 | **Unpublish** | Card biến mất, trang không lỗi | ✔ | |
| 5 | **Delete** | Không còn card mồ côi, trang 200 | ✔ | |
| 6 | Lặp 1–5 với **Service** | Tương tự | | |
| 7 | Đổi nhãn menu / CTA ở `pages` / hotline ở `site_settings` | Public phản ánh đúng | | |
| 8 | Upload ảnh test ở Media, gán vào Product | Ảnh hiện, phục vụ từ R2, không lỗi sau deploy | | |
| 9 | Xóa hết Product (hoặc Service) | Hiện empty state, không crash | | |
| 10 | Production ở cửa sổ ẩn danh, bấm 4 mục menu | Không 404, không lỗi console | | |
| 11 | Thu nhỏ ≤ 680px | Layout không vỡ | | |
