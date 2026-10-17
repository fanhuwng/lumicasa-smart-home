-- 1. Cập nhật ảnh Hero
UPDATE site_settings SET value = '/media/hero.jpg' WHERE key = 'hero_image';

-- 2. Cập nhật 4 ảnh Sản phẩm sang link R2
UPDATE products SET image_url = '/media/lumi-hub-one.jpg' WHERE slug = 'lumi-hub-one';
UPDATE products SET image_url = '/media/lumi-touch-s.jpg' WHERE slug = 'lumi-touch-s';
UPDATE products SET image_url = '/media/lumi-guard-cam.jpg' WHERE slug = 'lumi-guard-cam';
UPDATE products SET image_url = '/media/lumi-air-sense.jpg' WHERE slug = 'lumi-air-sense';

-- 3. Cập nhật 6 ảnh Dịch vụ sang link R2
UPDATE services SET image_url = '/media/service-1.jpg' WHERE slug = 'khao-sat-tu-van';
UPDATE services SET image_url = '/media/service-2.jpg' WHERE slug = 'thiet-ke-kich-ban';
UPDATE services SET image_url = '/media/service-3.jpg' WHERE slug = 'lap-dat-thiet-bi';
UPDATE services SET image_url = '/media/service-4.jpg' WHERE slug = 'tich-hop-an-ninh';
UPDATE services SET image_url = '/media/service-5.jpg' WHERE slug = 'bao-tri-nang-cap';
UPDATE services SET image_url = '/media/service-6.jpg' WHERE slug = 'ho-tro-tu-xa';