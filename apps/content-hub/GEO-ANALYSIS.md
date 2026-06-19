# GEO Analysis — NURA Hijab
**URL:** http://localhost:4323/ (production build)
**Date:** 2026-06-19
**Auditor:** claude-seo:seo-geo

---

## GEO Readiness Score: 52/100

| Dimension | Score | Weight | Notes |
|-----------|-------|--------|-------|
| Citability | 10/25 | 25% | Paragraphs 46–62w, butuh 134–167w |
| Structural Readability | 12/20 | 20% | FAQ bagus, artikel tidak ada H2 di body |
| Multi-Modal Content | 6/15 | 15% | Image only, tidak ada video/infografis |
| Authority & Brand Signals | 8/20 | 20% | Tidak ada Wikipedia/YouTube/author bio |
| Technical Accessibility | 16/20 | 20% | SSR ✅, AI crawlers ✅, llms.txt ✅ (URL salah) |

### Platform Breakdown
| Platform | Score | Bottleneck |
|----------|-------|------------|
| Google AI Overviews | 58/100 | Paragraf pendek, tidak ada author |
| Google AI Mode | 52/100 | Freshness signals lemah, no date di FAQ/Tentang |
| ChatGPT | 38/100 | Tidak ada Wikipedia, Reddit, YouTube presence |
| Perplexity | 35/100 | Tidak ada Reddit community mentions |

---

## ✅ Kekuatan Yang Sudah Ada

1. **SSR penuh** — Semua konten render di server (Astro SSG). AI crawler tidak perlu JavaScript. Semua 29 halaman crawlable.
2. **AI Crawler Access** — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot semua diizinkan via `Allow: *`
3. **llms.txt ada** — Sudah ada di `/llms.txt` dengan deskripsi brand dan links halaman utama
4. **Schema lengkap** — BlogPosting, FAQPage, Product+Offer+AggregateRating, BreadcrumbList, Organization, WebSite
5. **FAQ berkualitas** — 12 Q&A, ~1858 kata, format tanya-jawab yang ideal untuk AI citation
6. **Sitemap XML** — 29 halaman terindeks

---

## ❌ Masalah Kritis (Yang Bisa Difix)

### 1. Paragraf Artikel Terlalu Pendek [CRITICAL — Citability]
Semua 6 paragraf di artikel detail hanya **46–62 kata**. AI citation optimal di **134–167 kata** per blok.
Dampak: Paragraf tidak self-contained → AI tidak bisa mengutip tanpa konteks tambahan.

```
P1: 46w — "Hijab voal adalah salah satu material..."
P2: 62w — "Cara pertama yang paling klasik..."
P3: 54w — "Cara kedua adalah voluminous drape..."
```

### 2. Tidak Ada H2/H3 di Body Artikel [HIGH — Structure]
Template artikel hanya render paragraf `<p>`, tidak ada subheading. AI scanner tidak bisa identify topik per section.

### 3. llms.txt Hardcoded localhost:4321 [HIGH — Technical]
```
- [Beranda](http://localhost:4321/): ...  ← SALAH
```
Harus pakai `Astro.site` agar URL berganti otomatis saat deploy.

### 4. Tidak Ada Author/Person Schema [MEDIUM — Authority]
Article pages tidak ada `author` sebagai `Person` schema dengan identifier. AI systems lebih percaya konten dengan attributed author.

### 5. FAQ dan Tentang Tidak Ada Tanggal [MEDIUM — Freshness]
Halaman dengan konten evergreen tetap butuh `dateModified` agar AI tidak anggap stale.

### 6. sameAs Hanya Instagram + TikTok [MEDIUM — Brand]
Wikipedia, YouTube, LinkedIn belum ada. ChatGPT 47.9% kutipannya dari Wikipedia.

---

## Top 5 Highest-Impact Changes

| # | Action | Effort | GEO Impact |
|---|--------|--------|------------|
| 1 | Panjangkan paragraf artikel ke 134–167w | Medium | +8–10 pts Citability |
| 2 | Tambah H2 subheadings di body artikel | Low | +4–5 pts Structure |
| 3 | Fix llms.txt pakai dynamic URL | Low | +3 pts Technical |
| 4 | Tambah Person schema di artikel | Low | +3–4 pts Authority |
| 5 | Tambah dateModified di FAQ + Tentang | Low | +2 pts Freshness |

---

## Schema Recommendations

Tambahkan ke artikel:
```json
"author": {
  "@type": "Person",
  "name": "Tim Editorial NURA",
  "url": "https://nura.id/tentang/"
}
```

Tambahkan ke FAQ:
```json
"dateModified": "2026-06-19"
```

---

## llms.txt Status

**Ada** tapi URL hardcoded `localhost:4321`. Perlu diperbaiki ke dynamic Astro.site.

Struktur sudah baik — tinggal fix URL.
