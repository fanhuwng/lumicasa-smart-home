# LUMI CASA — Hệ Thống Smart Home Dynamic Website
> **Bài test 15 ngày Thực tập sinh IT — Pacific Atlantis**  
> Chuyển đổi từ 01 file HTML tĩnh (`Smart Home.html`) sang website động hoàn chỉnh có CMS, chạy trên nền tảng Serverless Edge Computing của Cloudflare.
- **Production URL**: [https://lumicasa-smart-home.hungpd.workers.dev](https://lumicasa-smart-home.hungpd.workers.dev)
- **Git Repository**: [https://github.com/fanhuwng/lumicasa-smart-home](https://github.com/fanhuwng/lumicasa-smart-home)
- **Ứng viên thực hiện**: Phan Duy Hưng
- **Email**: phanduyhungdev03@gmail.com
---
## 1. Công nghệ bắt buộc & Kiến trúc hệ thống
Dự án được xây dựng 100% trên hệ sinh thái Edge của Cloudflare, không dùng máy chủ Node.js/VPS/Render/Railway truyền thống:
- **Frontend & SSR Framework**: Astro 5 (Cấu hình Server-Side Rendering `output: 'server'`).
- **Edge Runtime**: Cloudflare Workers (Chạy tại hơn 300+ PoP toàn cầu với độ trễ cực thấp).
- **Database**: Cloudflare D1 (Serverless Distributed SQL Database dựa trên SQLite).
- **Media Storage**: Cloudflare R2 (Object Storage tương thích S3, không tính phí băng thông egress).
- **CMS Model**: EmDash CMS / Dynamic Content Collections.
- **Quản lý & Triển khai**: Wrangler CLI v4, Git & GitHub.
---
## 2. Sơ đồ luồng dữ liệu (Data Flow)

[Quản trị viên / Admin]
│
│ (Thao tác Thêm/Sửa/Xóa dữ liệu & Upload Media)
▼
┌────────────────────────────────────────────────────────┐
│               Cloudflare Edge Infrastructure           │
│                                                        │
│   [Cloudflare D1 Database]    [Cloudflare R2 Storage]  │
│   - ec_products / products    - Media Assets           │
│   - ec_services / services    - Product/Service Images │
│   - site_settings (singleton)                          │
│   - menus & leads                                      │
└────────────────────────────────────────────────────────┘
▲
│ (Truy vấn trực tiếp tại Edge qua env.DB & env.MEDIA_BUCKET)
▼
┌────────────────────────────────────────────────────────┐
│      Cloudflare Worker (Astro SSR Runtime)             │
│      - Request-time Server Rendering                   │
│      - Defensive Fallbacks (Chống crash khi null/rỗng) │
│      - R2 Media Route: /media/[...key]                 │
│      - Contact API Endpoint: /api/contact              │
└────────────────────────────────────────────────────────┘
│
│ (Trả về HTML + Scoped CSS hoàn chỉnh)
▼
[Trình duyệt Người dùng (Client)]
  
---
## 3. Thiết kế Content Model (D1 Database)
Toàn bộ nội dung của website được quản trị động, không hard-code bất kỳ mảng sản phẩm hay dịch vụ nào trong component:
### 3.1. Bảng `products` (4 sản phẩm bắt buộc)
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: TEXT (Tên sản phẩm: *Lumi Hub One, Lumi Touch S, Lumi Guard Cam, Lumi Air Sense*)
- `slug`: TEXT UNIQUE (Định danh URL)
- `group_label`: TEXT (Nhóm: *Trung tâm điều khiển, An ninh, Cảm biến...*)
- `description`: TEXT (Mô tả tính năng chi tiết)
- `price`: INTEGER (Giá số: 2490000, 1290000...)
- `price_display`: TEXT (Định dạng hiển thị: *2.490.000đ*)
- `image_url`: TEXT (Đường dẫn ảnh quản lý qua R2 Media)
- `order_index`: INTEGER (Thứ tự hiển thị 1, 2, 3, 4)
- `status`: TEXT DEFAULT 'published' (`published` hoặc `draft`)
### 3.2. Bảng `services` (6 dịch vụ bắt buộc)
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: TEXT (*Khảo sát & tư vấn, Thiết kế kịch bản, Lắp đặt thiết bị, Tích hợp an ninh, Bảo trì & nâng cấp, Hỗ trợ từ xa*)
- `slug`: TEXT UNIQUE
- `order_code`: TEXT (*01, 02, 03...*)
- `icon`: TEXT (Ký hiệu icon: *⌂, ✦, ⚙, ◎, ↻, ?*)
- `image_url`: TEXT (Ảnh đại diện dịch vụ)
- `description`: TEXT (Mô tả dịch vụ)
- `features`: TEXT (Danh sách gạch đầu dòng phân cách bởi ký tự `|`)
- `order_index`: INTEGER (Thứ tự 1 đến 6)
- `status`: TEXT DEFAULT 'published'
### 3.3. Bảng `site_settings` (Singleton Key-Value)
Lưu trữ toàn bộ thông tin chung của website:
- Thương hiệu: `site_name` ("LUMI CASA"), `eyebrow`
- Hero Section: `hero_title`, `hero_desc`, `hero_image`
- Thống kê: `stat_1_val`, `stat_1_lbl`, `stat_2_val`...
- Thông tin liên hệ (Khớp chính xác với bản mẫu):
  - Địa chỉ: *128 Trần Duy Hưng, Cầu Giấy, Hà Nội*
  - Hotline: *0988 246 810*
  - Email: *hello@lumicasa.vn*
  - Giờ làm việc: *08:30 – 18:00 • Thứ 2 đến Thứ 7*
- Footer: `footer_copy`, `footer_sub`
### 3.4. Bảng `menus` & `leads`
- `menus`: Quản lý danh mục điều hướng (*Trang chủ, Sản phẩm, Dịch vụ, Liên hệ* và nút CTA).
- `leads`: Lưu trữ data khách hàng gửi từ Contact Form (*name, phone, home_type, budget, message, created_at*).
---
## 4. Cấu hình Cloudflare Resources & Bindings
Khai báo tài nguyên trong `wrangler.jsonc`:
```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "lumicasa-smart-home",
  "compatibility_date": "2026-10-12",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "lumicasa-db",
      "database_id": "9ba9246b-4b09-4df7-8324-a1bb29640805"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "lumicasa-media"
    }
  ]
}

NOTE
  Nguyên tắc bảo mật: Dự án sử dụng cơ chế Cloudflare Runtime Bindings (env.DB và env.MEDIA_BUCKET). Không lưu bất kỳ database password, access token hay secret key nào vào mã nguồn và Git repository. 
5. Hướng dẫn cài đặt và chạy Local (Local Setup)
Yêu cầu môi trường 
Node.js >= 18.17.0 (Khuyên dùng Node 20+ LTS) 
npm hoặc pnpm 
Tài khoản Cloudflare 
Các bước cài đặt:
bash
# 1. Clone mã nguồn
git clone https://github.com/fanhuwng/lumicasa-smart-home.git
cd lumicasa-smart-home
# 2. Cài đặt các thư viện phụ thuộc
npm install
# 3. Khởi tạo cơ sở dữ liệu D1 ở môi trường local
npx wrangler d1 execute lumicasa-db --local --file=./schema.sql
npx wrangler d1 execute lumicasa-db --local --file=./seed.sql
# 4. Khởi động máy chủ phát triển
npm run dev
Truy cập: http://localhost:4321
6. Hướng dẫn Build & Deploy lên Production
bash
# 1. Đăng nhập tài khoản Cloudflare
npx wrangler login
# 2. Áp dụng schema và nạp dữ liệu lên Cloudflare D1 Remote
npx wrangler d1 execute lumicasa-db --remote --file=./schema.sql
npx wrangler d1 execute lumicasa-db --remote --file=./seed.sql
# 3. Đóng gói ứng dụng (Astro Build)
npm run build
# 4. Triển khai lên Cloudflare Workers
npx wrangler deploy
7. Quy trình kiểm thử CRUD (CRUD Test Matrix)
Dự án đã kiểm thử thành công toàn bộ ma trận CRUD bắt buộc (Mục 7 trong đề bài):
Thao tác	Thao tác thực hiện	Kết quả thực tế trên Production
CREATE	Thêm sản phẩm thứ 5 qua SQL/Admin	Nút Hero tự động nhảy thành "Xem 5 sản phẩm", xuất hiện thêm Card mới ngay lập tức.
UPDATE	Đổi giá, hotline hoặc tên sản phẩm	F5 trang web phản ánh ngay thông tin mới mà không cần sửa code component.
PUBLISH / DRAFT	Đổi status thành 'draft'	Sản phẩm biến mất khỏi public site. Đổi lại 'published' sản phẩm hiển thị lại.
DELETE	Xóa bản ghi test	Public site hoạt động bình thường, không crash, không card mồ côi (nhờ defensive coding).
FORM LEAD	Nhập form liên hệ và submit	Gửi qua POST /api/contact, validate số điện thoại VN và lưu trực tiếp vào bảng leads của D1.
8. Known Limitations (Giới hạn đã biết)
Cần chạy schema.sql trước seed.sql khi thiết lập môi trường mới để tránh lỗi bảng chưa tồn tại. 
Cloudflare R2 Bucket: Tài khoản Cloudflare mới cần kích hoạt R2 qua Dashboard trước khi tạo bucket trên CLI (gói miễn phí 10GB/tháng).  
Trình duyệt ẩn danh: Trang web hỗ trợ hoàn hảo chế độ ẩn danh (Incognito), không phụ thuộc vào LocalStorage hay Session cookie để hiển thị dữ liệu chính. 

