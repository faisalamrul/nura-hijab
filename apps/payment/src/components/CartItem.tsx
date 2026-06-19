import type { CartItem as CartItemType } from "@/lib/cart";
import { formatIDR } from "@/lib/cart";
import { FONT_HEADING, COLOR } from "@/lib/tokens";

interface Props {
  item: CartItemType;
  onQtyChange: (id: string, color: string | undefined, delta: number) => void;
  onRemove: (id: string, color: string | undefined) => void;
}

export function CartItem({ item, onQtyChange, onRemove }: Props) {
  return (
    <div style={{
      display: "flex",
      gap: 24,
      padding: "28px 0",
      borderBottom: `1px solid ${COLOR.border}`,
    }}>
      {/* Image */}
      <div style={{ flexShrink: 0, width: 100, height: 134, background: COLOR.surface, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3 style={{
            fontFamily: FONT_HEADING,
            fontSize: "1.15rem",
            fontWeight: 300,
            color: COLOR.ink,
            lineHeight: 1.3,
            marginBottom: 6,
            letterSpacing: "0.01em",
          }}>
            {item.name}
          </h3>

          {item.selectedColor && (
            <p style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: COLOR.muted,
              marginBottom: 0,
            }}>
              {item.selectedColor}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 20 }}>
          {/* Qty stepper */}
          <div style={{ display: "inline-flex", border: `1px solid ${COLOR.border}` }}>
            <button
              onClick={() => onQtyChange(item.id, item.selectedColor, -1)}
              aria-label="Kurangi"
              style={{
                width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: COLOR.muted,
                background: "none", border: "none", cursor: "pointer",
                borderRight: `1px solid ${COLOR.border}`,
              }}
            >−</button>
            <span style={{
              width: 40, height: 34,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 500, color: COLOR.ink,
              fontVariantNumeric: "tabular-nums",
            }}>
              {item.qty}
            </span>
            <button
              onClick={() => onQtyChange(item.id, item.selectedColor, 1)}
              aria-label="Tambah"
              style={{
                width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, color: COLOR.muted,
                background: "none", border: "none", cursor: "pointer",
                borderLeft: `1px solid ${COLOR.border}`,
              }}
            >+</button>
          </div>

          <p style={{
            fontSize: 14,
            fontWeight: 500,
            color: COLOR.ink,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.01em",
          }}>
            {formatIDR(item.price * item.qty)}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.id, item.selectedColor)}
          style={{
            marginTop: 12,
            alignSelf: "flex-start",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLOR.muted,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
