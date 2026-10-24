# LUMI CASA — Smart Home trên EmDash + Cloudflare

Website Smart Home (Trang chủ · Sản phẩm · Dịch vụ · Liên hệ) được chuyển từ 1 file `Smart Home.html` tĩnh sang **Astro + EmDash CMS**, chạy trên **Cloudflare Workers** với **D1** (database) và **R2** (media).

- **Production URL:** `https://lumi-casa.<subdomain-của-bạn>.workers.dev` ← _điền sau khi deploy_
- **Admin:** `<production-url>/_emdash/admin`
- **Repo:** _điền link GitHub_

## 1. Prerequisite

| Công cụ | Ghi chú |
|---|---|
| Node.js **≥ 22.23.4** | Astro 7 từ chối chạy ở bản thấp hơn |
| pnpm ≥ 10.26 (project dùng 11) | `corepack enable` hoặc `npm i -g pnpm` |
| Git | |
| Tài khoản Cloudflare (free) | dash.cloudflare.com |
| Wrangler | đã nằm trong devDependencies, chạy qua `pnpm exec wrangler` |

## 2. Chạy local

```bash
pnpm install
pnpm dev            # http://localhost:4321
```

Lần đầu vào `http://localhost:4321/_emdash/admin`, EmDash chạy migration, áp `seed/seed.json` (collections, menu, nội dung, ảnh) và mở **setup wizard** để tạo admin (passkey). Local dùng D1/R2 giả lập của Miniflare trong `.wrangler/` (đã gitignore).

> Seed tải ảnh từ Pexels (`$media`) rồi lưu vào Media của CMS. Nếu mạng chặn Pexels, trang vẫn chạy (card hiện khung placeholder) và bạn upload ảnh trong Admin → Media.

## 3. Content Model (`seed/seed.json`)

| Collection | Dùng để | Field chính |
|---|---|---|
| `products` | 4 sản phẩm | `title`, `slug`, `group`, `short_label`, `summary` (trang chủ), `description` (trang Sản phẩm), `price` (integer VND), `image`, `sort_order`, `show_on_home`, Draft/Published |
| `services` | 6 dịch vụ | `title`, `description`, `icon`, `image`, `features` (repeater bullet), `sort_order`, Draft/Published |
| `pages` | Nội dung 4 trang (slug `home`, `products`, `services`, `contact`) | eyebrow, heading (H1), intro, `meta_description` (SEO), hero_image, CTA chính/phụ, `stats`, tiêu đề mục nổi bật, banner |
| `site_settings` | Bản ghi `main`: tên thương hiệu, địa chỉ, hotline, email, giờ làm việc, text form, footer | |
| Menu `primary` | 4 mục điều hướng | Admin → Menus |
| Menu `header_cta` | Nút "Nhận tư vấn" trên header | |
| Settings của EmDash | `title`, `tagline` (logo/favicon nếu upload) | Admin → Settings |

`pages` và `site_settings` có lý do tồn tại: đề yêu cầu hero/intro/CTA/liên hệ/footer sửa được trong CMS, và cả hai đều được frontend dùng thật.

**Ẩn/hiện:** trạng thái Draft/Published của EmDash (draft không xuất hiện ở public) + `show_on_home` cho trang chủ. **Thứ tự:** `sort_order` nhỏ → lớn.

## 4. Data flow: Admin → website

```
Admin (/_emdash/admin) ──ghi──▶ D1 (ec_products, ec_services, ec_pages, ec_site_settings, menus…)
      │ upload ảnh                      ▲
      ▼                                 │ getEmDashCollection / getEmDashEntry / getMenu / getSiteSettings
  R2 (binding MEDIA)                    │
      ▲                                 │
      └──── <Image> ──── Astro SSR page (Worker) ◀── request của khách
```

- `output: "server"`: trang render mỗi request, publish xong là thấy ngay, không cần rebuild.
- Nơi query: `src/lib/content.ts`, các trang `src/pages/*.astro`, menu/settings ở `src/layouts/Base.astro`.
- Nơi render: `src/components/ProductCard.astro`, `Banner.astro`, vòng lặp dịch vụ trong `services.astro`.
- Không có mảng Product/Service hard-code. Giá trị null đều có fallback (empty state, bỏ khối thiếu dữ liệu, placeholder khi thiếu ảnh).

## 5. D1 / R2 / Bindings

| File | Nội dung |
|---|---|
| `wrangler.jsonc` | Worker `lumi-casa`; binding **`DB`** → D1 `lumi-casa-db`; binding **`MEDIA`** → R2 `lumi-casa-media`; cron mỗi phút cho scheduled publishing |
| `astro.config.mjs` | `emdash({ database: d1({ binding: "DB" }), storage: r2({ binding: "MEDIA" }) })` + `@astrojs/cloudflare` — **nơi EmDash nối D1/R2** |
| `src/worker.ts` | Entry Worker (handler EmDash + `scheduled()`) |

Không có secret trong repo; không commit `.env`, `.dev.vars`, token Cloudflare.

## 6. Build & deploy

```bash
pnpm exec wrangler login                          # đăng nhập qua trình duyệt, không lưu token vào repo
pnpm exec wrangler d1 create lumi-casa-db         # chép database_id vào wrangler.jsonc nếu Wrangler yêu cầu
pnpm exec wrangler r2 bucket create lumi-casa-media
pnpm deploy                                       # = astro build && wrangler deploy
```

Mở `https://lumi-casa.<subdomain>.workers.dev/_emdash/admin` → setup wizard (seed được áp lên **D1 production**, ảnh tải lên **R2**) → tạo admin.

**Quyền truy cập Admin production:** EmDash xác thực bằng **passkey** tạo ở setup wizard; chỉ người có passkey vào được `/_emdash/admin`. Có thể bọc thêm Cloudflare Access.

## 7. Kiểm thử
Xem [`docs/crud-checklist.md`](docs/crud-checklist.md).

## 8. SEO / accessibility
`<title>` + `meta description` mỗi trang lấy từ collection `pages`; mỗi trang một `<h1>`; ảnh luôn có `alt`; menu có `aria-current`; form có label và thông báo lỗi.

## 9. Known limitations
- Form liên hệ **chỉ mô phỏng** (validate + toast) như file gốc; chưa lưu lead.
- Ảnh demo từ Pexels qua seed; nên thay bằng ảnh thật.
- Collection bật `revisions`: sửa bản ghi *đã publish* tạo bản nháp, cần bấm **Publish** lại để lên public (mặc định của EmDash).
- Không bật sandbox plugin (Worker Loader, trả phí). Chưa có test tự động.

## 10. Cấu trúc
```
seed/seed.json            content model + dữ liệu + menu + settings
src/layouts/Base.astro    header/menu/footer/SEO từ EmDash
src/pages/                index, products, services, contact, 404
src/components/           ProductCard, Banner
src/lib/content.ts        helper query + format giá
src/styles/theme.css      CSS giữ tinh thần Smart Home.html
wrangler.jsonc            bindings D1/R2
docs/                     ai-usage.md, crud-checklist.md
```
