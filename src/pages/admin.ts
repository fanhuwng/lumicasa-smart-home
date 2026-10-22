import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    // Tự động chuyển hướng từ /admin sang /_emdash/admin/
    return Response.redirect('/_emdash/admin/', 302);
};