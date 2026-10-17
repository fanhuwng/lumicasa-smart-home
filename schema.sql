-- 1. BẢNG SẢN PHẨM (Yêu cầu 6.2 & 6.3: 4 sản phẩm)
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  group_label TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_display TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' -- 'published' hoặc 'draft'
);

-- 2. BẢNG DỊCH VỤ (Yêu cầu 6.2 & 6.3: 6 dịch vụ)
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  order_code TEXT NOT NULL, -- '01', '02', '03'...
  icon TEXT NOT NULL,       -- Ký tự icon: ⌂, ✦, ⚙, ◎, ↻, ?
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL,   -- Danh sách gạch đầu dòng (phân cách bằng dấu phẩy hoặc dòng mới)
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- 3. BẢNG CẤU HÌNH WEBSITE (Site / Page Settings Singleton)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 4. BẢNG MENU NAVIGATION
CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  route TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_cta BOOLEAN DEFAULT 0
);

-- 5. BẢNG LƯU LEAD LIÊN HỆ (Bonus Lead Capture từ Form)
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  home_type TEXT,
  budget TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);