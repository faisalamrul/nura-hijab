import type { CollectionEntry } from "astro:content";

type Product = CollectionEntry<"products">;

export interface KoleksiConfig {
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  schemaName: string;
  schemaDescription: string;
  filter: (p: Product) => boolean;
  seoLeft: string;
  seoRight: string;
}

export const KOLEKSI: KoleksiConfig[] = [
  {
    slug: "voal",
    label: "Voal",
    title: "Koleksi Hijab Voal Premium — NURA",
    metaDescription: "Hijab voal premium NURA: voal matte anti-silau dan voal emboss tekstur timbul. Ringan, breathable, tersedia 10–12 warna earth tone. Gratis ongkir min. Rp150.000.",
    schemaName: "Koleksi Hijab Voal Premium NURA",
    schemaDescription: "Temukan koleksi hijab voal premium NURA — voal matte, voal emboss, dan voal motif dengan kualitas terbaik. Ringan, breathable, dan elegan untuk wanita Muslim modern Indonesia.",
    filter: (p) => p.data.material?.toLowerCase().includes("voal") ?? false,
    seoLeft: 'Hijab voal dikenal karena teksturnya yang sangat halus, ringan, dan <em>fall</em> yang indah ketika dikenakan. <strong class="text-ink font-medium">Voal Matte Premium</strong> NURA hadir dengan permukaan anti-silau yang ideal untuk tampilan profesional sehari-hari — tidak mudah kusut, breathable, tersedia dalam 12 warna earth tone. Sementara <strong class="text-ink font-medium">Voal Emboss</strong> menghadirkan tekstur timbul yang elegan untuk acara semi-formal tanpa kesan berlebihan.',
    seoRight: 'Semua produk voal NURA diproduksi dengan jahitan rapi dan warna tahan cuci yang mencerminkan nilai <em>silent luxury</em>. Perawatan mudah: cuci tangan dengan deterjen lembut, jemur dalam posisi datar, setrika suhu rendah jika perlu. Gratis ongkir untuk pembelian minimum Rp150.000, dikirim ke seluruh Indonesia dengan packaging premium.',
  },
  {
    slug: "ceruti",
    label: "Ceruti",
    title: "Koleksi Hijab Ceruti Premium — NURA",
    metaDescription: "Hijab ceruti premium NURA: ceruti babydoll untuk tampilan formal dan ceruti rawis untuk kesan feminin. Drape sempurna, tersedia 8–14 pilihan warna. Gratis ongkir min. Rp150.000.",
    schemaName: "Koleksi Hijab Ceruti Premium NURA",
    schemaDescription: "Koleksi hijab ceruti premium NURA — ceruti babydoll dan ceruti rawis dengan drape elegan. Pilihan terbaik untuk tampilan formal dan profesional wanita Muslim Indonesia.",
    filter: (p) => (p.data.material?.toLowerCase().includes("ceruti") ?? false) && !p.id.toLowerCase().includes("pashmina"),
    seoLeft: 'Kain ceruti dikenal ringan seperti sifon namun dengan opacity lebih baik — tidak perlu lapisan dalam. Tekstur micro-crinkle-nya memberikan drape yang jatuh sempurna dan tetap rapi sepanjang hari. <strong class="text-ink font-medium">Ceruti Babydoll</strong> NURA adalah pilihan andalan untuk tampilan formal dan profesional, tersedia dalam 8 warna yang dikurasi dari Ivory hingga Cobalt.',
    seoRight: '<strong class="text-ink font-medium">Ceruti Rawis</strong> menghadirkan sentuhan feminin melalui finishing tepi rawis yang halus — cocok dari daily wear hingga acara semi-formal, tersedia 14 warna termasuk Dusty Mauve dan Champagne. Perawatan mudah: cuci tangan dengan deterjen lembut, jemur terlipat, hindari matahari langsung. Gratis ongkir min. Rp150.000 ke seluruh Indonesia.',
  },
  {
    slug: "segi-empat",
    label: "Segi Empat",
    title: "Koleksi Hijab Segi Empat Premium — NURA",
    metaDescription: "Hijab segi empat premium NURA: bella square dan diamond crepe. Serbaguna, mudah dipakai, tersedia 18–20 warna earth tone. Gratis ongkir min. Rp150.000.",
    schemaName: "Koleksi Hijab Segi Empat Premium NURA",
    schemaDescription: "Koleksi hijab segi empat premium NURA — bella square dan diamond crepe. Serbaguna untuk berbagai gaya styling, tersedia hingga 20 pilihan warna.",
    filter: (p) => {
      const mat = p.data.material?.toLowerCase() ?? "";
      return mat.includes("square") || mat.includes("crepe") || mat.includes("diamond") || mat.includes("bella");
    },
    seoLeft: 'Hijab segi empat adalah format paling klasik dan versatile — satu kain untuk puluhan gaya, dari simple daily wrap hingga tampilan berlapis yang lebih editorial. <strong class="text-ink font-medium">Bella Square</strong> NURA menghadirkan bahan lembut dan ringan dalam 18 pilihan warna, sementara <strong class="text-ink font-medium">Diamond Crepe</strong> menghadirkan tekstur khas diamond yang elegan dalam 20 warna — koleksi warna terbesar di lineup NURA.',
    seoRight: 'Semua produk segi empat NURA menggunakan jahitan overdeck yang rapi dan warna tahan cuci sesuai standar <em>silent luxury</em>. Untuk pemula, mulai dengan Bella Square karena bobotnya yang mudah dikontrol — Diamond Crepe hadir sebagai upgrade natural untuk tekstur yang lebih mewah. Gratis ongkir min. Rp150.000 ke seluruh Indonesia.',
  },
  {
    slug: "pashmina",
    label: "Pashmina",
    title: "Koleksi Hijab Pashmina Premium — NURA",
    metaDescription: "Hijab pashmina ceruti rawis premium NURA: panjang, flowing, finishing rawis feminin. Tersedia 14 warna earth tone. Gratis ongkir min. Rp150.000.",
    schemaName: "Koleksi Hijab Pashmina Premium NURA",
    schemaDescription: "Koleksi hijab pashmina ceruti rawis premium NURA — panjang, flowing, dengan finishing rawis feminin. Pilihan terbaik untuk tampilan kasual hingga formal.",
    filter: (p) => p.id.toLowerCase().includes("pashmina") || p.data.name.toLowerCase().includes("pashmina"),
    seoLeft: '<strong class="text-ink font-medium">Pashmina Ceruti Rawis NURA</strong> menggunakan bahan ceruti ringan yang breathable dengan finishing tepi rawis halus — detail kecil yang menghadirkan kesan feminin dan premium tanpa berlebihan. Tersedia dalam 14 pilihan warna dari palet earth tone NURA, dari Soft Beige dan Champagne yang timeless hingga Charcoal yang bold dan modern.',
    seoRight: 'Panjang dan lebar yang proporsional memberi ruang styling luas — dari simple drape harian hingga layer berlapis untuk acara formal. Kain ceruti cepat kering dan tidak mudah kusut, cocok untuk penggunaan sehari-hari. Perawatan mudah: cuci tangan, jangan diperas, jemur terbuka. Gratis ongkir min. Rp150.000.',
  },
];
