export interface Product {
    id: number | string;
    name: string;
    slug?: string;
    group_label?: string;
    description?: string;
    price?: number;
    price_display?: string;
    image?: any;
    image_url?: string;
    order_index?: number;
    status?: string;
}

export interface Service {
    id: number | string;
    name: string;
    slug?: string;
    order_code?: string;
    icon?: string;
    image?: any;
    image_url?: string;
    description?: string;
    features?: string;
    order_index?: number;
    status?: string;
}

export interface Menu {
    id: number;
    label: string;
    route: string;
    order_index: number;
    is_cta: number | boolean;
}

/**
 * Hàm phân giải URL ảnh từ EmDash Media Library:
 * - Chuỗi JSON từ EmDash CMS -> trích xuất storageKey -> link /_emdash/api/media/file/...
 * - Link ảnh web bên ngoài (http / https) -> giữ nguyên
 */
export function resolveImageUrl(imageField: any, fallbackUrl = ''): string {
    if (!imageField) return fallbackUrl;

    if (typeof imageField === 'string') {
        if (imageField.startsWith('http://') || imageField.startsWith('https://') || imageField.startsWith('/')) {
            return imageField;
        }
        try {
            const parsed = JSON.parse(imageField);
            return resolveImageUrl(parsed, fallbackUrl);
        } catch {
            return `/_emdash/api/media/file/${imageField}`;
        }
    }

    if (typeof imageField === 'object' && imageField !== null) {
        const storageKey = imageField.meta?.storageKey || imageField.storageKey || imageField.storage_key;
        if (storageKey) {
            return `/_emdash/api/media/file/${storageKey}`;
        }
        if (imageField.url) return imageField.url;
        if (imageField.src) return imageField.src;
        if (imageField.filename) {
            return `/_emdash/api/media/file/${imageField.filename}`;
        }
    }

    return fallbackUrl;
}

// 1. Lấy danh sách sản phẩm đã xuất bản (published) từ EmDash CMS
export async function getProducts(db: any): Promise<any[]> {
    try {
        if (!db) return [];
        const { results } = await db.prepare(
            "SELECT * FROM ec_products WHERE status = 'published' ORDER BY created_at ASC"
        ).all();
        return results || [];
    } catch (e) {
        console.error("Lỗi truy vấn ec_products:", e);
        return [];
    }
}

// 2. Lấy danh sách dịch vụ trực tiếp từ EmDash CMS (ec_services)
export async function getServices(db: any): Promise<any[]> {
    try {
        if (!db) return [];
        const { results } = await db.prepare(
            "SELECT * FROM ec_services WHERE status = 'published' ORDER BY created_at ASC"
        ).all();
        return results || [];
    } catch (e) {
        return [];
    }
}

// 3. Lấy cấu hình website (Site Settings)
export async function getSiteSettings(db: any): Promise<Record<string, string>> {
    try {
        if (!db) return {};
        const { results } = await db.prepare("SELECT key, value FROM site_settings").all();
        const settings: Record<string, string> = {};
        for (const row of (results || [])) {
            settings[row.key] = row.value;
        }
        return settings;
    } catch (e) {
        // Trả về rỗng nếu chưa có bảng, giao diện sẽ dùng giá trị mặc định sẵn có
        return {};
    }
}

// 4. Lấy danh sách menu navigation (có sẵn menu mặc định để thanh header luôn đủ nút)
// 4. Lấy danh sách menu navigation (đầy đủ cả tab Liên hệ và nút CTA Tư vấn ngay)
export async function getMenus(db: any): Promise<Menu[]> {
    const defaultMenus: Menu[] = [
        { id: 1, label: 'Trang chủ', route: 'home', order_index: 1, is_cta: false },
        { id: 2, label: 'Sản phẩm', route: 'products', order_index: 2, is_cta: false },
        { id: 3, label: 'Dịch vụ', route: 'services', order_index: 3, is_cta: false },
        { id: 4, label: 'Liên hệ', route: 'contact', order_index: 4, is_cta: false },
        { id: 5, label: 'Nhận tư vấn', route: 'contact', order_index: 5, is_cta: true },
    ];

    try {
        if (!db) return defaultMenus;
        const { results } = await db.prepare("SELECT * FROM menus ORDER BY order_index ASC").all();
        return (results && results.length > 0) ? results : defaultMenus;
    } catch (e) {
        return defaultMenus;
    }
}