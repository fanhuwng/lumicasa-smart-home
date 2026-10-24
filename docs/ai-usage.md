# AI usage


## 1. Công cụ AI đã dùng
- Claude (Claude Code, model Sonnet 5.5): đọc đề, tra tài liệu EmDash, dựng project, viết seed/pages/CSS, test CRUD local, soạn README.


## 2. 5 việc quan trọng nhờ AI
1. **Đọc đề và rút yêu cầu** (4 khu vực, Product/Service/Site settings/Menu, D1/R2, CRUD, README, ai-usage).
2. **Tìm hiểu EmDash:** repo template chính thức `emdash-cms/templates` (biến thể `starter-cloudflare`), tài liệu skill đi kèm template (`building-emdash-site`) và bài hướng dẫn theme/seed.
3. **Thiết kế Content Model + sinh `seed/seed.json`** từ dữ liệu trong `Smart Home.html` (script sinh JSON rồi validate bằng `emdash seed --validate`).
4. **Refactor HTML → Astro:** layout `Base.astro` lấy menu/settings từ EmDash; 4 trang query collection; component `ProductCard`/`Banner`; form có validate.
5. **Kiểm thử local:** áp seed, tạo/publish/sửa/unpublish/xóa Product qua API admin, kiểm tra trang không crash.

## 3. Gợi ý/code AI đã được sửa, bỏ hoặc kiểm chứng
1. **Sửa:** ban đầu `<title>` trang chủ thành "LUMI CASA — Smart Home — LUMI CASA" (layout nối thêm tên site). Đã đổi logic: chỉ nối khi tiêu đề chưa chứa tên site.
2. **Sửa:** layout tự in thêm `<meta name="description">` trong khi `<EmDashHead>` đã in → bị lặp 2 thẻ. Đã bỏ thẻ tự viết.
3. **Bỏ:** hướng dùng `npm create emdash@latest` để scaffold không chạy được trong môi trường làm bài (GitHub tarball trả 403), nên chuyển sang clone `emdash-cms/templates` và copy `starter-cloudflare`. **[ỨNG VIÊN TỰ ĐIỀN]** bạn có thể dùng đúng lệnh `npm create emdash@latest` trên máy mình.
4. **Kiểm chứng:** mọi tên API (`getEmDashCollection`, `getEmDashEntry`, `getMenuWithCacheHint`, `getSiteSettingsWithCacheHint`, field `repeater`, `$media`) được đối chiếu với tài liệu/skill đi kèm template và chạy thật; không viết theo trí nhớ.

## 4. Lỗi / assumption sai của AI
- **Assumption sai:** AI giả định sửa giá một Product *đã publish* sẽ hiện ngay ở public. Thực tế collection bật `revisions` nên bản sửa là bản nháp cho tới khi **Publish lại** (test local cho thấy giá vẫn cũ). Đã ghi vào README (Known limitations) và checklist.
- **Lỗi quy trình:** AI bắt đầu dựng project trước khi đọc được nội dung PDF (lần đọc đầu không hiện text), nên các quyết định ban đầu dựa trên suy đoán về đề. Sau đó đã đọc lại PDF và đối chiếu lại toàn bộ yêu cầu.
- **Hạn chế môi trường:** sandbox chặn Pexels (403) nên ảnh seed không tải được khi test; AI xác nhận trang vẫn chạy với placeholder. Việc ảnh vào R2 thật **chưa được kiểm chứng** — bạn phải kiểm tra trên production.


## 6. Những việc AI **không** làm (ứng viên phải tự làm)
Tạo tài khoản Cloudflare, `wrangler login`, tạo D1/R2 production, deploy, kiểm tra production URL/ẩn danh, upload ảnh test trong Admin, quay video 5–7 phút, push GitHub và giữ lịch sử commit tự nhiên.
