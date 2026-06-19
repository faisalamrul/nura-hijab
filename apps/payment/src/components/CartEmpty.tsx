import { FONT_HEADING, COLOR } from "@/lib/tokens";
import { ASTRO_URL } from "@/lib/config";

export function CartEmpty() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
      textAlign: "center",
    }}>
      <svg
        width="40" height="40"
        fill="none" stroke="currentColor" strokeWidth="1"
        viewBox="0 0 24 24"
        style={{ color: COLOR.silver, marginBottom: 24 }}
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>

      <p style={{
        fontFamily: FONT_HEADING,
        fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
        fontWeight: 300,
        color: COLOR.ink,
        letterSpacing: "0.02em",
        marginBottom: 10,
      }}>
        Keranjang Kosong
      </p>
      <p style={{
        fontSize: 13,
        color: COLOR.muted,
        lineHeight: 1.7,
        marginBottom: 32,
        maxWidth: 260,
      }}>
        Belum ada produk yang ditambahkan. Jelajahi koleksi hijab premium NURA.
      </p>
      <a
        href={`${ASTRO_URL}/produk/`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 32px",
          background: COLOR.jet,
          color: "white",
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Mulai Belanja
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  );
}
