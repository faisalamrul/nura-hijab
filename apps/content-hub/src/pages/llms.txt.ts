import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site ?? "http://localhost:4321").toString().replace(/\/$/, "");

  const content = `# NURA

> NURA adalah brand hijab premium Indonesia dengan filosofi silent luxury — kualitas berbicara lebih keras dari label. Kami membuat hijab dari bahan premium pilihan untuk wanita Muslim modern yang menghargai keindahan dalam kesederhanaan.

NURA menawarkan koleksi hijab voal, ceruti, pashmina, dan segi empat dengan palet warna earth tone dan netral timeless.

## Halaman Utama

- [Beranda](${siteUrl}/): Showcase koleksi NURA hijab premium Indonesia
- [Koleksi Voal](${siteUrl}/koleksi/voal/): Hijab voal premium ringan dan breathable, cocok untuk iklim tropis Indonesia
- [Koleksi Ceruti](${siteUrl}/koleksi/ceruti/): Hijab ceruti dengan tekstur halus dan jatuh elegan untuk tampilan formal
- [Koleksi Pashmina](${siteUrl}/koleksi/pashmina/): Pashmina premium dengan drape sempurna dan kenyamanan sepanjang hari
- [Koleksi Segi Empat](${siteUrl}/koleksi/segi-empat/): Hijab segi empat versatile, model paling populer di Indonesia

## Panduan & Edukasi

- [Cara Memilih Hijab Voal](${siteUrl}/panduan/memilih-hijab-voal/): Panduan lengkap memilih hijab voal berdasarkan bahan, gramasi, dan kebutuhan
- [Panduan Warna Hijab](${siteUrl}/panduan/panduan-warna-hijab/): Cara memilih warna hijab yang cocok untuk berbagai warna kulit dan outfit
- [Cara Merawat Hijab Premium](${siteUrl}/panduan/merawat-hijab-premium/): Tips merawat hijab premium agar tahan lama dan warna tetap cemerlang
- [Hijab untuk Kerja](${siteUrl}/panduan/hijab-untuk-kerja/): Panduan styling hijab untuk wanita profesional di lingkungan kerja formal
- [Hijab untuk Wisuda](${siteUrl}/panduan/hijab-untuk-wisuda/): Inspirasi dan rekomendasi hijab untuk hari wisuda yang berkesan

## Informasi Brand & Layanan

- [Tentang NURA](${siteUrl}/tentang/): Cerita di balik brand NURA, filosofi silent luxury, dan visi kami
- [FAQ](${siteUrl}/faq/): Pertanyaan umum tentang produk, ukuran, bahan, pengiriman, dan pengembalian
- [Informasi Pengiriman](${siteUrl}/pengiriman/): Kebijakan pengiriman, estimasi waktu, dan area jangkauan NURA
- [Kebijakan Pengembalian](${siteUrl}/pengembalian/): Prosedur pengembalian dan penukaran produk NURA

## Artikel

- [Artikel & Style Guide](${siteUrl}/artikel/): Panduan gaya, tren hijab terkini, dan tips styling dari tim NURA
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
