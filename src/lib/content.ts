import { getEmDashCollection, getEmDashEntry } from "emdash";

/** Định dạng giá VND: 2490000 -> "2.490.000đ" */
export function formatPrice(value: number | null | undefined): string {
	if (typeof value !== "number" || Number.isNaN(value)) return "Liên hệ";
	return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

/** Bản ghi cài đặt chung (collection site_settings, slug "main"). Luôn trả object để UI không crash khi null. */
export async function getSettings() {
	const { entry, cacheHint } = await getEmDashEntry("site_settings", "main");
	return { s: entry?.data ?? ({} as Record<string, any>), cacheHint };
}

export async function getPage(slug: string) {
	const { entry, cacheHint } = await getEmDashEntry("pages", slug);
	return { page: entry?.data ?? null, edit: entry?.edit, cacheHint };
}

/** Chỉ lấy bản ghi đã publish, sắp xếp theo sort_order rồi tên. Draft/unpublish tự bị loại. */
export async function getOrdered<C extends "products" | "services">(collection: C, opts: { limit?: number } = {}) {
	const { entries, cacheHint } = await getEmDashCollection(collection, {
		status: "published",
		orderBy: { sort_order: "asc" },
		...opts,
	});
	return { entries, cacheHint };
}
