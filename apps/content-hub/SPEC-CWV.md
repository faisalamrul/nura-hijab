# Spec: Core Web Vitals Optimization — Homepage

**App:** `apps/content-hub` (Astro 5 SSG + React islands)
**Scope:** `src/pages/index.astro` dan komponen yang digunakan homepage
**Date:** 2026-06-19

---

## Objective

Mengoptimasi tiga Core Web Vitals (LCP, INP, CLS) di halaman homepage NURA agar mencapai nilai "Good" menurut standar Google. Ini berdampak langsung ke SEO ranking dan user experience.

**Target users:** Pengunjung baru dari organic search (Google), mayoritas mobile.

---

## Audit Temuan

### LCP — Largest Contentful Paint
**Root cause utama: Semua 3 slide gambar carousel dimuat `loading="eager"` sekaligus, saling bersaing bandwidth. Gambar kedua dan ketiga membuang bandwidth yang seharusnya untuk LCP candidate (slide 0).**

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | `HeroCarousel` — semua slides pakai `loading="eager"` | Slide 1 & 2 bersaing bandwidth dengan slide 0 (LCP) |
| 2 | Tidak ada `<link rel="preload" as="image">` di `<head>` untuk gambar LCP | Browser baru discover gambar setelah parse JS |
| 3 | Font dimuat dari Google Fonts (external CDN) tanpa preload file `.woff2` | DNS + TCP roundtrip sebelum font bisa dipakai |
| 4 | `<link rel="preload" href={FONT_URL} as="style">` preload CSS file, bukan font binary | Font binary baru di-discover setelah CSS di-parse |

### CLS — Cumulative Layout Shift
| # | Masalah | Dampak |
|---|---------|--------|
| 5 | `font-display: swap` (default Google Fonts) menyebabkan FOUT | Teks berubah ukuran saat custom font load → layout shift |
| 6 | Gambar di `HeroCarousel`, `ProductCard`, `ArticleCard` tidak punya `width`/`height` attr | CLS jika CSS belum apply tapi img sudah load |

*Catatan: Aspect-ratio containers (`aspect-[3/4]`, `h-[68vh]`) sudah menangani sebagian besar CLS dari gambar. Dampak #6 minor.*

### INP — Interaction to Next Paint
| # | Masalah | Dampak |
|---|---------|--------|
| 7 | React bundle dimuat `client:load` untuk carousel yang relatif sederhana | Main thread blocked saat hydration di awal page load |
| 8 | `setInterval(next, 5000)` berjalan terus meski user tidak berinteraksi | Minor main thread work |
| 9 | Duplicate `class=` attribute pada heading di `index.astro` (baris 91, 140, 183, 239) | Satu `class` tidak apply — heading h2 tanpa `fs-section` class |

---

## Tech Stack

- Astro 5 SSG
- React 19 (islands via `client:load`)
- Tailwind v4 (CSS-first `@theme`)
- TypeScript dengan `exactOptionalPropertyTypes: true`
- Google Fonts (akan diganti self-hosted `@fontsource`)

---

## Commands

```
Dev:   pnpm --filter content-hub dev
Build: pnpm --filter content-hub build  (atau: cd apps/content-hub && pnpm astro build)
Check: pnpm --filter content-hub exec astro check
```

Tidak ada test runner — verifikasi via `astro check` + visual audit Lighthouse.

---

## Project Structure

```
src/
  pages/index.astro          → Homepage (utama yang diubah)
  components/
    HeroCarousel.tsx          → React carousel (diubah loading strategy)
    ProductCard.astro         → Product cards (tambah width/height)
    ArticleCard.astro         → Article cards (tambah width/height)
    NavHeader.astro           → Sticky header
  layouts/
    Layout.astro              → <head> — tambah preload image prop
  styles/
    global.css                → Tambah @fontsource imports, hapus Google Fonts
```

---

## Code Style

Ikuti pola yang sudah ada:
- Astro components: props interface di frontmatter, Tailwind classes langsung
- React components: functional, hooks, className (bukan class)
- Tidak ada komentar kecuali WHY non-obvious

---

## Perubahan yang Akan Dilakukan

### Task 1 — Fix carousel image loading priority (LCP #1 + #2)
Ubah `HeroCarousel.tsx`:
- Slide 0: `loading="eager" fetchpriority="high"` → sudah ada, pertahankan
- Slide 1: `loading="eager" fetchpriority="low"` → diubah (sudah dekat, tampil di ~5s)
- Slide 2+: `loading="lazy"` → diubah (tampil di >10s, tidak perlu eager)

Tambah `preloadImage?: string` prop ke `Layout.astro` + `SeoHead.astro`:
```html
<link rel="preload" as="image" href={preloadImage} fetchpriority="high" />
```
Pass dari `index.astro`: `preloadImage={slidesData[0].image}`

### Task 2 — Self-host fonts via @fontsource (LCP #3 + #4, CLS #5)
Install package:
```
pnpm add @fontsource-variable/cormorant-garamond @fontsource/inter
```
Update `global.css`:
```css
@import "@fontsource-variable/cormorant-garamond/wght.css";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
```
Hapus dari `Layout.astro`: semua `<link>` Google Fonts (preconnect, preload, stylesheet).

Update `global.css` @theme: ganti font family name sesuai fontsource package variable name.

### Task 3 — Fix duplicate class attributes di index.astro (INP/correctness #9)
Di `index.astro`, beberapa `<h2>` punya dua `class=` attribute (Astro hanya pakai yang pertama):
```astro
<!-- Bug: dua class attribute, yang kedua tidak apply -->
<h2 class="font-heading font-light text-ink" class="fs-section">
```
Gabung jadi satu:
```astro
<h2 class="font-heading font-light text-ink fs-section">
```

### Task 4 — Tambah explicit width/height pada gambar (CLS #6)
`ProductCard.astro`: tambah `width="600" height="800"` pada `<img>` (rasio 3:4)
`ArticleCard.astro`: tambah `width="600" height="400"` pada `<img>` (rasio 3:2)
`HeroCarousel.tsx`: tambah `width={1400} height={900}` pada semua slide images

---

## Success Criteria

Diukur dengan Lighthouse CLI atau DevTools → Lighthouse tab (mobile, throttled 4G):

| Metric | Target | Kondisi Saat Ini (estimasi) |
|--------|--------|------------------------------|
| LCP    | < 2.5s | ~4–6s (carousel React hydration + font load) |
| INP    | < 200ms | ~200–300ms (React bundle blocking) |
| CLS    | < 0.1  | ~0.05–0.15 (font swap) |
| Performance Score | ≥ 85 | ~60–70 (estimasi) |

---

## Boundaries

- **Always:** Jalankan `astro check` + `astro build` setelah setiap task
- **Ask first:** Mengganti React carousel dengan Astro-native implementation (scope besar)
- **Never:** Hapus `client:load` dari carousel tanpa pengganti — interaktivitas harus tetap ada saat halaman dimuat

---

## Open Questions

1. Apakah ada target Lighthouse score minimum selain "Good" threshold (LCP <2.5s, INP <200ms, CLS <0.1)?
2. Apakah boleh install 2 package baru (`@fontsource-variable/cormorant-garamond`, `@fontsource/inter`)?
3. Apakah self-host font oke atau lebih prefer tetap Google Fonts dengan optimasi berbeda?

---

## Out of Scope

- Optimasi halaman selain `/` (produk, koleksi, artikel, dll)
- Image optimization/CDN setup (Unsplash tetap dipakai)
- Real User Monitoring (RUM) setup
- Service Worker / caching strategy
- Bundle splitting / code splitting lebih lanjut
