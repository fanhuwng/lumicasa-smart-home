import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Danh sách 11 ảnh gốc từ file Smart Home.html
const images = [
    { name: 'hero.jpg', url: 'https://images.pexels.com/photos/28549934/pexels-photo-28549934.jpeg?auto=compress&cs=tinysrgb&w=1600' },
    { name: 'lumi-hub-one.jpg', url: 'https://images.pexels.com/photos/30170004/pexels-photo-30170004.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { name: 'lumi-touch-s.jpg', url: 'https://images.pexels.com/photos/22610370/pexels-photo-22610370.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { name: 'lumi-guard-cam.jpg', url: 'https://images.pexels.com/photos/24347621/pexels-photo-24347621.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { name: 'lumi-air-sense.jpg', url: 'https://images.pexels.com/photos/27662879/pexels-photo-27662879.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { name: 'service-1.jpg', url: 'https://images.pexels.com/photos/28618498/pexels-photo-28618498.jpeg?auto=compress&cs=tinysrgb&w=1000' },
    { name: 'service-2.jpg', url: 'https://images.pexels.com/photos/18136105/pexels-photo-18136105.jpeg?auto=compress&cs=tinysrgb&w=1000' },
    { name: 'service-3.jpg', url: 'https://images.pexels.com/photos/17018384/pexels-photo-17018384.jpeg?auto=compress&cs=tinysrgb&w=1000' },
    { name: 'service-4.jpg', url: 'https://images.pexels.com/photos/26597080/pexels-photo-26597080.jpeg?auto=compress&cs=tinysrgb&w=1000' },
    { name: 'service-5.jpg', url: 'https://images.pexels.com/photos/22307516/pexels-photo-22307516.jpeg?auto=compress&cs=tinysrgb&w=1000' },
    { name: 'service-6.jpg', url: 'https://images.pexels.com/photos/8566440/pexels-photo-8566440.jpeg?auto=compress&cs=tinysrgb&w=1000' },
];

const tempDir = './temp_images';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

async function run() {
    console.log('🚀 Bắt đầu quá trình đưa ảnh vào Cloudflare R2...\n');

    for (const img of images) {
        const localPath = path.join(tempDir, img.name);
        console.log(`📥 Đang tải: ${img.name}...`);

        // Tải ảnh về máy tạm
        const res = await fetch(img.url);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(localPath, buffer);

        // Dùng Wrangler đẩy file lên Bucket R2 lumicasa-media
        console.log(`☁️ Đang đẩy lên R2: ${img.name}...`);
        execSync(`npx wrangler r2 object put lumicasa-media/${img.name} --file=${localPath} --remote`, { stdio: 'inherit' });
        console.log(`✅ Hoàn thành: ${img.name}\n`);
    }

    // Dọn dẹp thư mục tạm
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('🎉 Toàn bộ 11 bức ảnh đã được upload thành công lên Cloudflare R2!');
}

run();