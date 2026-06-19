import type { CartItem } from "@/lib/cart";
import { formatIDR } from "@/lib/cart";
import { FONT_HEADING, COLOR } from "@/lib/tokens";

const FREE_SHIPPING_THRESHOLD = 150_000;

interface Props {
  items: CartItem[];
  onContinueShopping: () => void;
}

export function CartSummary({ items, onContinueShopping }: Props) {
  const totalQty = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div style={{
      background: COLOR.surface,
      padding: "32px 28px",
      position: "sticky",
      top: 24,
    }}>
      <h2 style={{
        fontFamily: FONT_HEADING,
        fontSize: "1.25rem",
        fontWeight: 300,
        color: COLOR.ink,
        letterSpacing: "0.02em",
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: `1px solid ${COLOR.border}`,
      }}>
        Ringkasan Pesanan
      </h2>

      {/* Line items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        <Row
          label={`Subtotal (${totalQty} item)`}
          value={formatIDR(subtotal)}
        />
        <Row
          label="Ongkos Kirim"
          value={freeShipping ? "Gratis" : `Min. ${formatIDR(FREE_SHIPPING_THRESHOLD)}`}
          dimValue={!freeShipping}
        />
      </div>

      {/* Progress to free shipping */}
      {!freeShipping && (
        <div style={{
          background: "white",
          padding: "10px 14px",
          marginBottom: 20,
          fontSize: 11,
          color: COLOR.muted,
          lineHeight: 1.6,
        }}>
          Tambah <strong style={{ color: COLOR.ink }}>{formatIDR(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> lagi untuk gratis ongkir.
        </div>
      )}

      {/* Total */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        borderTop: `1px solid ${COLOR.border}`,
        marginBottom: 28,
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.ink }}>Total</span>
        <span style={{
          fontFamily: FONT_HEADING,
          fontSize: "1.4rem",
          fontWeight: 400,
          color: COLOR.ink,
          fontVariantNumeric: "tabular-nums",
        }}>
          {formatIDR(subtotal)}
        </span>
      </div>

      {/* CTA */}
      <a
        href="/checkout"
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: "15px 0",
          background: COLOR.jet,
          color: "white",
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 500,
          textDecoration: "none",
          marginBottom: 16,
        }}
      >
        Lanjut ke Pembayaran
      </a>

      <button
        onClick={onContinueShopping}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "10px 0",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: COLOR.muted,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Lanjut Belanja
      </button>
    </div>
  );
}

function Row({ label, value, dimValue }: { label: string; value: string; dimValue?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: COLOR.muted }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: dimValue ? COLOR.muted : COLOR.ink }}>
        {value}
      </span>
    </div>
  );
}
