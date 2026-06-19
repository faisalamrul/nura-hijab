export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedColor?: string;
  qty: number;
}

type RawItem = {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  image?: unknown;
  selectedColor?: unknown;
  qty?: unknown;
};

export function normalizeCart(raw: unknown[]): CartItem[] {
  const map = new Map<string, CartItem>();

  for (const entry of raw) {
    const r = entry as RawItem;
    if (typeof r.id !== "string" || typeof r.name !== "string") continue;
    if (typeof r.price !== "number" || typeof r.image !== "string") continue;

    const color = typeof r.selectedColor === "string" ? r.selectedColor : undefined;
    const key = `${r.id}__${color ?? ""}`;

    const rawQty = typeof r.qty === "number" && r.qty >= 1 ? Math.floor(r.qty) : 1;
    const existing = map.get(key);
    if (existing) {
      existing.qty += rawQty;
    } else {
      map.set(key, { id: r.id, name: r.name, price: r.price, image: r.image, ...(color !== undefined && { selectedColor: color }), qty: rawQty });
    }
  }

  return Array.from(map.values());
}

export function decodeCart(param: string): CartItem[] {
  try {
    const json = new TextDecoder().decode(Uint8Array.from(atob(param), (c) => c.charCodeAt(0)));
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return normalizeCart(parsed);
  } catch {
    return [];
  }
}

export function persistCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("nura-cart", JSON.stringify(items));
    document.dispatchEvent(new Event("nura:cart-update"));
    // Write count to a cookie — cookies are shared across ports on same hostname
    // so localhost:3000 and localhost:4321 can both read this
    const totalQty = items.reduce((n, i) => n + i.qty, 0);
    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `nura_cart_qty=${totalQty}; path=/; max-age=86400; samesite=lax${secure}`;
  } catch {
    // localStorage/cookie unavailable
  }
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
