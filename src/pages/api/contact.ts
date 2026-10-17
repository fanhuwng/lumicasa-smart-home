import type { APIRoute } from 'astro';
// @ts-ignore
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, phone, homeType, budget, message } = data;

        // 1. Validate dữ liệu cơ bản
        if (!name || !phone) {
            return new Response(
                JSON.stringify({ error: 'Họ tên và số điện thoại là bắt buộc' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Kiểm tra định dạng số điện thoại Việt Nam (10 chữ số)
        const phoneRegex = /(03|05|07|08|09)\d{8}$/;
        if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
            return new Response(
                JSON.stringify({ error: 'Số điện thoại không đúng định dạng' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 2. Ghi vào D1 Database
        const db = (env as any)?.DB;
        if (db) {
            await db.prepare(
                "INSERT INTO leads (name, phone, home_type, budget, message) VALUES (?, ?, ?, ?, ?)"
            ).bind(name, phone, homeType || '', budget || '', message || '').run();
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Đã nhận thông tin liên hệ thành công!' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Lỗi lưu lead vào D1:", error);
        return new Response(
            JSON.stringify({ error: 'Có lỗi xảy ra khi xử lý yêu cầu' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};