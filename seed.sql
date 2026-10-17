-- Dọn dẹp dữ liệu cũ nếu có
DELETE FROM products;
DELETE FROM services;
DELETE FROM site_settings;
DELETE FROM menus;

-- 1. NẠP 4 SẢN PHẨM BẮT BUỘC
INSERT INTO products (name, slug, group_label, description, price, price_display, image_url, order_index, status) VALUES
('Lumi Hub One', 'lumi-hub-one', 'Trung tâm điều khiển', 'Kết nối cảm biến, công tắc và kịch bản tự động trong một trung tâm duy nhất.', 2490000, '2.490.000đ', 'https://images.pexels.com/photos/30170004/pexels-photo-30170004.jpeg?auto=compress&cs=tinysrgb&w=1200', 1, 'published'),
('Lumi Touch S', 'lumi-touch-s', 'Công tắc cảm ứng', 'Mặt kính tối giản, phản hồi chạm nhanh và quản lý ngữ cảnh theo từng phòng.', 1290000, '1.290.000đ', 'https://images.pexels.com/photos/22610370/pexels-photo-22610370.jpeg?auto=compress&cs=tinysrgb&w=1200', 2, 'published'),
('Lumi Guard Cam', 'lumi-guard-cam', 'An ninh', 'Camera AI nhận diện chuyển động, cảnh báo khu vực và xem từ xa.', 1890000, '1.890.000đ', 'https://images.pexels.com/photos/24347621/pexels-photo-24347621.jpeg?auto=compress&cs=tinysrgb&w=1200', 3, 'published'),
('Lumi Air Sense', 'lumi-air-sense', 'Môi trường sống', 'Theo dõi nhiệt độ, độ ẩm và chất lượng không khí theo thời gian thực.', 990000, '990.000đ', 'https://images.pexels.com/photos/27662879/pexels-photo-27662879.jpeg?auto=compress&cs=tinysrgb&w=1200', 4, 'published');

-- 2. NẠP 6 DỊCH VỤ BẮT BUỘC
INSERT INTO services (name, slug, order_code, icon, image_url, description, features, order_index, status) VALUES
('Khảo sát & tư vấn', 'khao-sat-tu-van', '01', '⌂', 'https://images.pexels.com/photos/28618498/pexels-photo-28618498.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Khảo sát mặt bằng, thói quen sinh hoạt và ngân sách để xác định phạm vi tự động hóa phù hợp.', 'Khảo sát hiện trạng|Lập sơ đồ nhu cầu|Dự toán sơ bộ', 1, 'published'),
('Thiết kế kịch bản Smart Home', 'thiet-ke-kich-ban', '02', '✦', 'https://images.pexels.com/photos/18136105/pexels-photo-18136105.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Xây dựng các kịch bản theo thời gian, cảm biến, trạng thái phòng và thói quen gia đình.', 'Kịch bản ánh sáng|Kịch bản an ninh|Kịch bản tiết kiệm điện', 2, 'published'),
('Lắp đặt thiết bị', 'lap-dat-thiet-bi', '03', '⚙', 'https://images.pexels.com/photos/17018384/pexels-photo-17018384.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Triển khai thiết bị, cân chỉnh vị trí và tối ưu kết nối trong quá trình thi công.', 'Thi công gọn|Cấu hình tại chỗ|Bàn giao từng khu vực', 3, 'published'),
('Tích hợp an ninh', 'tich-hop-an-ninh', '04', '◎', 'https://images.pexels.com/photos/26597080/pexels-photo-26597080.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Kết nối camera, cảm biến cửa, cảnh báo chuyển động và chế độ vắng nhà.', 'Cảnh báo tức thời|Phân vùng giám sát|Nhật ký sự kiện', 4, 'published'),
('Bảo trì & nâng cấp', 'bao-tri-nang-cap', '05', '↻', 'https://images.pexels.com/photos/22307516/pexels-photo-22307516.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Kiểm tra định kỳ, cập nhật cấu hình và mở rộng thiết bị khi nhu cầu thay đổi.', 'Kiểm tra hệ thống|Tối ưu kịch bản|Mở rộng thiết bị', 5, 'published'),
('Hỗ trợ từ xa', 'ho-tro-tu-xa', '06', '?', 'https://images.pexels.com/photos/8566440/pexels-photo-8566440.jpeg?auto=compress&cs=tinysrgb&w=1000', 'Hướng dẫn sử dụng, xử lý cấu hình và hỗ trợ các vấn đề phát sinh trong vận hành.', 'Hỗ trợ 7 ngày/tuần|Hướng dẫn người dùng|Khôi phục cấu hình', 6, 'published');

-- 3. NẠP CẤU HÌNH SITE & LIÊN HỆ
INSERT INTO site_settings (key, value) VALUES
('site_name', 'LUMI CASA'),
('eyebrow', 'Smart Home • Sống thông minh hơn'),
('hero_title', 'Ngôi nhà hiểu bạn trước cả khi bạn lên tiếng.'),
('hero_desc', 'LUMI CASA cung cấp hệ sinh thái nhà thông minh tinh gọn: điều khiển ánh sáng, an ninh, chất lượng không khí và các kịch bản tự động theo thói quen gia đình.'),
('hero_image', 'https://images.pexels.com/photos/28549934/pexels-photo-28549934.jpeg?auto=compress&cs=tinysrgb&w=1600'),
('stat_1_val', '4'), ('stat_1_lbl', 'Sản phẩm chủ lực'),
('stat_2_val', '6'), ('stat_2_lbl', 'Dịch vụ triển khai'),
('stat_3_val', '24/7'), ('stat_3_lbl', 'Giám sát hệ thống'),
('contact_company', 'LUMI CASA Việt Nam'),
('contact_studio', 'Smart Home Studio'),
('contact_address', '128 Trần Duy Hưng, Cầu Giấy, Hà Nội'),
('contact_hotline', '0988 246 810'),
('contact_email', 'hello@lumicasa.vn'),
('contact_hours', '08:30 – 18:00 • Thứ 2 đến Thứ 7'),
('footer_copy', '© 2026 LUMI CASA — Demo website.'),
('footer_sub', 'Smart Home • Security • Automation');

-- 4. NẠP MENU ĐIỀU HƯỚNG
INSERT INTO menus (label, route, order_index, is_cta) VALUES
('Trang chủ', 'home', 1, 0),
('Sản phẩm', 'products', 2, 0),
('Dịch vụ', 'services', 3, 0),
('Liên hệ', 'contact', 4, 0),
('Nhận tư vấn', 'contact', 5, 1);