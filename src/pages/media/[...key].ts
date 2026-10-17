import type { APIRoute } from 'astro';
// @ts-ignore
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
    const key = params.key;
    if (!key) {
        return new Response('Tên file không hợp lệ', { status: 400 });
    }

    // 1. Lấy R2 bucket từ binding
    const bucket = (env as any)?.MEDIA_BUCKET;
    if (!bucket) {
        return new Response('Chưa cấu hình MEDIA_BUCKET', { status: 500 });
    }

    // 2. Tìm file trong R2 bucket
    const object = await bucket.get(key);
    if (!object) {
        return new Response('Không tìm thấy ảnh trong kho R2', { status: 404 });
    }

    // 3. Trả về file với HTTP headers tối ưu cache
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000, immutable'); // Cache 1 năm

    return new Response(object.body, { headers });
};