# Spec: content-hub Homepage

**App:** `apps/content-hub` (Astro 5 SSG)
**Date:** 2026-06-19
**Design Brief:** `design-brief/e-commerce-hijab.md` — Silent Luxury concept

---

## Objective

Build a complete, production-quality homepage for **NURA** — a premium hijab e-commerce storefront. The homepage should communicate an editorial, aspirational aesthetic that differentiates NURA from typical hijab stores.

**Target users:** Gen Z & Millennial Indonesian women who value clean, minimal, premium aesthetics.

**Success looks like:** Opening the page feels like browsing a high-end fashion magazine. Every element has breathing room. Products feel premium without a single discount badge in sight.

---

## ASSUMPTIONS

1. No external carousel library — implement custom with React + CSS (no new deps)
2. Product images use placeholder divs (real photos not available yet)
3. Content Collections use `.json` format (simpler than Markdown for structured data)
4. No routing — all sections are on one page, smooth scroll via anchor links
5. `astro sync` generates Content Collection types before build

→ Correct me now or I'll proceed with these.

---

## Commands

```
Dev:      pnpm --filter content-hub dev
Build:    pnpm --filter content-hub build
Typecheck: pnpm --filter content-hub astro check
Sync types: pnpm --filter content-hub astro sync
```

---

## Project Structure

New files to be created:

```
apps/content-hub/
├── src/
│   ├── content/
│   │   ├── config.ts                    ← Content collection schemas
│   │   ├── products/                    ← Product entries
│   │   │   ├── hijab-voal-matte.json
│   │   │   ├── hijab-ceruti-basic.json
│   │   │   ├── hijab-sifon-premium.json
│   │   │   ├── hijab-jersey-instant.json
│   │   │   ├── hijab-diamond-crepe.json
│   │   │   ├── hijab-bella-square.json
│   │   │   ├── hijab-voal-emboss.json
│   │   │   └── hijab-pashmina-rawis.json
│   │   └── slides/                      ← Hero carousel slides
│   │       ├── ramadan-collection.json
│   │       ├── voal-series.json
│   │       └── everyday-minimal.json
│   ├── components/
│   │   ├── HeroCarousel.tsx             ← React: autoplay + arrows + dots
│   │   ├── MobileMenu.tsx               ← React: full-screen overlay
│   │   └── ProductCard.astro            ← Astro: product card with hover
│   └── pages/
│       └── index.astro                  ← Main homepage (full rebuild)
```

---

## Content Collection Schemas

```ts
// products
{
  name: string          // "Hijab Voal Matte"
  price: number         // 185000
  variants: number      // 12 (number of color variants)
  tag: "terbaru" | "terlaris" | "both"
  badge?: string        // Optional: "New", "Bestseller"
  bg: string            // Tailwind bg class for placeholder: "bg-zinc-100"
}

// slides
{
  label: string         // "Koleksi Ramadan 2026"
  headline: string      // "Kelembutan yang\nBerbicara dalam Diam"
  cta: string           // "Jelajahi Koleksi"
  href: string          // "#koleksi"
  bg: string            // Tailwind gradient class or hex for overlay bg
}
```

---

## Features & Acceptance Criteria

### 1. Navbar
- [ ] Fixed to top, full-width, z-50
- [ ] Transparent at page top → `bg-white border-b border-zinc-100` after 60px scroll
- [ ] Desktop: Logo left · Links center (Koleksi, Lookbook, Tentang) · Icons right (search, cart)
- [ ] Mobile: Logo left · Hamburger right
- [ ] Hamburger opens full-screen black overlay with large serif navigation links
- [ ] Overlay closes on link click or X button
- [ ] All nav link/icon colors transition smoothly (white on hero → ink on white bg)

### 2. Hero Carousel
- [ ] Fullscreen height (`h-screen`), no visible overflow
- [ ] 3 slides from Content Collection
- [ ] Autoplay every 5 seconds
- [ ] Pause autoplay on hover
- [ ] Previous / Next arrow buttons (left/right edges)
- [ ] Dot indicators at bottom-center
- [ ] Cross-fade transition (opacity), 300ms ease-out — NOT sliding (cleaner for editorial)
- [ ] Headline: Cormorant Garamond 300 (light), large, bottom-left positioning
- [ ] CTA button per slide

### 3. Produk Terbaru
- [ ] Section label: "Terbaru" (all-caps, tracked), heading: "Koleksi Terbaru"
- [ ] "Lihat Semua" link right-aligned
- [ ] 4 products from collection where `tag === "terbaru" || tag === "both"`
- [ ] 2-column grid (`md:grid-cols-2`), gap-x-8 gap-y-14
- [ ] Product card: `aspect-[3/4]` image area, name (Cormorant), variants count, price

### 4. Produk Terlaris
- [ ] Same layout as Terbaru section
- [ ] Section label: "Terlaris", heading: "Produk Terlaris"
- [ ] 4 products where `tag === "terlaris" || tag === "both"`
- [ ] Product cards identical in design to Terbaru section

### 5. Product Card Interactions
- [ ] On group hover: "Tambah ke Keranjang" overlay slides up from bottom of image
- [ ] Image area has subtle scale `1.03` on hover (500ms ease-out)
- [ ] No shadow, no border radius, no card border

### 6. Footer
- [ ] Dark background (`bg-jet`), white text
- [ ] 4-column layout on desktop, 2-column on mobile
- [ ] Column 1: NURA logo + tagline
- [ ] Column 2: Koleksi links (Voal, Ceruti, Sifon, Instant)
- [ ] Column 3: Bantuan links (Panduan Ukuran, Pengiriman, Retur, Kontak)
- [ ] Column 4: Ikuti Kami (Instagram, TikTok, Pinterest)
- [ ] Bottom bar: copyright + Privasi/Syarat links

---

## Code Style

Follow `design-brief/e-commerce-hijab.md` exactly:

```
Typography:
  - Headings (h1-h3, product names): font-heading font-light
  - Body, labels, prices: font-body (default)
  - CTAs/labels: text-[11px] tracking-[0.22em] uppercase

Colors (use theme tokens, NOT hardcoded hex):
  - text-ink     → body text (#111)
  - text-muted   → captions, labels (#888)
  - bg-jet       → dark backgrounds (#0a0a0a)
  - bg-surface   → light section bg (#f7f7f7)
  - text-silver  → de-emphasized white-adjacent (#c8c8c8)

Spacing:
  - Section padding: py-24 px-6 md:px-10
  - Max container: max-w-[1440px] mx-auto

Motion:
  - All transitions: duration-200 ease-out (or 300ms for carousel)
  - Zero bouncy animations — only functional transitions
  - Carousel: cross-fade opacity, NOT transform translateX

Border radius:
  - ZERO everywhere. No rounded-* classes. Sharp corners are intentional.
```

---

## Testing Strategy

No automated test suite for this task. Verification is manual + build check.

**Verify after implementation:**
```
pnpm --filter content-hub build   → must complete with 0 errors
pnpm --filter content-hub astro check → 0 TypeScript errors
```

**Manual browser checks:**
- [ ] Carousel autoplays, arrows work, dots update
- [ ] Hover on product card triggers overlay slide-up
- [ ] Mobile (<768px): hamburger visible, overlay opens/closes
- [ ] Scroll past 60px: nav becomes white with border
- [ ] All 8 products (4+4) render with correct data
- [ ] No layout shift on scroll
- [ ] Footer columns align correctly

---

## Boundaries

| | Rule |
|---|---|
| **Always** | Use Tailwind v4 utility classes only — no inline `style` for layout. `font-light` for all serif headings. Zero border-radius. |
| **Ask first** | Installing new npm packages. Adding pages beyond index.astro. Changing the Content Collection schema after products are written. |
| **Never** | Add `rounded-*` classes (sharp edges are intentional). Use `shadow-*` on cards. Hardcode hex colors — use theme tokens. Add external carousel library without asking. |

---

## Open Questions

None — all answered in intake. Proceeding with implementation.

---

*Spec written with `/agent-skills:spec` — Claude Code*
