import { useState, useMemo } from "react";

function unsplashSrcSet(src: string): string {
  const make = (w: number, h: number) => {
    try {
      const u = new URL(src);
      u.searchParams.set("w", String(w));
      u.searchParams.set("h", String(h));
      return `${u.toString()} ${w}w`;
    } catch {
      return `${src} ${w}w`;
    }
  };
  return [make(400, 533), make(600, 800), make(800, 1067)].join(", ");
}

interface Product {
  id: string;
  name: string;
  price: number;
  variants: number;
  image: string;
  badge?: string | undefined;
  material?: string | undefined;
  tag: "terbaru" | "terlaris" | "both";
  inStock: boolean;
}

type Category = "semua" | "voal" | "ceruti" | "segi-empat" | "pashmina" | "jersey" | "sifon";
type SortKey = "terbaru" | "terlaris" | "termurah" | "termahal";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "voal", label: "Voal" },
  { key: "ceruti", label: "Ceruti" },
  { key: "segi-empat", label: "Segi Empat" },
  { key: "pashmina", label: "Pashmina" },
  { key: "jersey", label: "Jersey" },
  { key: "sifon", label: "Sifon" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "terbaru", label: "Terbaru" },
  { key: "terlaris", label: "Terlaris" },
  { key: "termurah", label: "Harga Termurah" },
  { key: "termahal", label: "Harga Termahal" },
];

function matchCategory(p: Product, cat: Category): boolean {
  const mat = (p.material ?? "").toLowerCase();
  const id = p.id.toLowerCase();
  switch (cat) {
    case "semua": return true;
    case "voal": return mat.includes("voal");
    case "ceruti": return mat.includes("ceruti");
    case "segi-empat": return mat.includes("square") || mat.includes("crepe") || mat.includes("diamond") || mat.includes("bella");
    case "pashmina": return id.includes("pashmina") || p.name.toLowerCase().includes("pashmina");
    case "jersey": return mat.includes("jersey");
    case "sifon": return mat.includes("sifon") || mat.includes("silk");
  }
}

const TAG_ORDER: Record<Product["tag"], number> = { both: 0, terbaru: 1, terlaris: 2 };
const TAG_ORDER_TERLARIS: Record<Product["tag"], number> = { both: 0, terlaris: 1, terbaru: 2 };

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "termurah": return copy.sort((a, b) => a.price - b.price);
    case "termahal": return copy.sort((a, b) => b.price - a.price);
    case "terlaris": return copy.sort((a, b) => TAG_ORDER_TERLARIS[a.tag] - TAG_ORDER_TERLARIS[b.tag]);
    case "terbaru": return copy.sort((a, b) => TAG_ORDER[a.tag] - TAG_ORDER[b.tag]);
  }
}

const IDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function ProductGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category>("semua");
  const [sort, setSort] = useState<SortKey>("terbaru");

  const filtered = useMemo(
    () => sortProducts(products.filter((p) => matchCategory(p, category)), sort),
    [products, category, sort]
  );

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────── */}
      <div className="flex flex-col gap-5 mb-12">
        {/* Category row */}
        <div className="flex items-center gap-0 border-b border-zinc-100 overflow-x-auto scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={[
                "relative pb-3 mr-6 text-[10.5px] tracking-[0.15em] uppercase transition-colors duration-150 whitespace-nowrap",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:transition-colors after:duration-150",
                category === key
                  ? "text-ink after:bg-ink"
                  : "text-muted hover:text-ink after:bg-transparent",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort + count row */}
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] tracking-[0.05em] text-muted">
            {filtered.length} produk
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] tracking-[0.1em] uppercase text-muted">Urutkan</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-[11px] border-b border-zinc-200 text-ink pb-0.5 bg-transparent focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer appearance-none pr-4"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='none' stroke='%23888' stroke-width='1.5' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0 center" }}
            >
              {SORTS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-32 text-center border-t border-zinc-100">
          <p className="font-heading font-light text-ink text-xl mb-2">Tidak ada produk</p>
          <p className="text-sm text-muted">Coba pilih kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-7 gap-y-12 md:gap-y-16">
          {filtered.map((p) => (
            <a
              key={p.id}
              href={`/produk/${p.id}`}
              className="group relative block"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#f8f7f5]">
                <img
                  src={p.image}
                  srcSet={unsplashSrcSet(p.image)}
                  sizes="(min-width: 1024px) calc(25vw - 50px), (min-width: 768px) calc(33vw - 36px), calc(50vw - 28px)"
                  alt={p.name}
                  width={600}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-jet/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[8.5px] tracking-[0.35em] uppercase text-white flex items-center gap-2">
                    Lihat Detail
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* Badge */}
                {p.badge && (
                  <span className="absolute top-3 right-3 z-10 bg-jet text-white text-[8px] tracking-[0.2em] uppercase px-2.5 py-1">
                    {p.badge}
                  </span>
                )}

                {/* Out of stock */}
                {!p.inStock && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-ink border border-ink px-3 py-1.5">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                {p.material && (
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-1.5">
                    {p.material}
                  </p>
                )}
                <h3 className="font-heading font-light text-ink text-[1.05rem] leading-tight mb-2">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-muted">{p.variants} warna</p>
                  <p className="text-[13px] font-medium text-ink tabular-nums">
                    {IDR.format(p.price)}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
