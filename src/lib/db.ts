export interface Product {
    id: number;
    name: string;
    slug: string;
    group_label: string;
    description: string;
    price: number;
    price_display: string;
    image_url: string;
    order_index: number;
    status: string;
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    order_code: string;
    icon: string;
    image_url: string;
    description: string;
    features: string;
    order_index: number;
    status: string;
}

export interface Menu {
    id: number;
    label: string;
    route: string;
    order_index: number;
    is_cta: number | boolean;
}

// 1. Lấy danh sách sản phẩm đã xuất bản (published)
export async function getProducts(db: any): Promise<Product[]> {
    try {
        if (!db) return [];
        const { results } = await db.prepare(
            "SELECT * FROM products WHERE status = 'published' ORDER BY order_index ASC"
        ).all();
        return results || [];
    } catch (e) {
        console.error("Lỗi truy vấn products:", e);
        return [];
    }
}

// 2. Lấy danh sách dịch vụ đã xuất bản
export async function getServices(db: any): Promise<Service[]> {
    try {
        if (!db) return [];
        const { results } = await db.prepare(
            "SELECT * FROM services WHERE status = 'published' ORDER BY order_index ASC"
        ).all();
        return results || [];
    } catch (e) {
        console.error("Lỗi truy vấn services:", e);
        return [];
    }
}

// 3. Lấy cấu hình website (Site Settings) dưới dạng Object key-value
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
        console.error("Lỗi truy vấn site_settings:", e);
        return {};
    }
}

// 4. Lấy danh sách menu navigation
export async function getMenus(db: any): Promise<Menu[]> {
    try {
        if (!db) return [];
        const { results } = await db.prepare("SELECT * FROM menus ORDER BY order_index ASC").all();
        return results || [];
    } catch (e) {
        console.error("Lỗi truy vấn menus:", e);
        return [];
    }
}