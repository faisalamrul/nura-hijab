import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site ?? "http://localhost:4321").toString().replace(/\/$/, "");

  const content = `User-agent: *
Allow: /

# Produk, koleksi, artikel, panduan — boleh diindeks
Allow: /produk/
Allow: /koleksi/
Allow: /artikel/
Allow: /panduan/
Allow: /faq
Allow: /tentang
Allow: /pengiriman
Allow: /pengembalian
Allow: /lookbook/

# Halaman non-konten — jangan diindeks
Disallow: /akun/
Disallow: /checkout/
Disallow: /keranjang/

# Parameter URL yang menghasilkan konten duplikat
Disallow: /*?*

Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
