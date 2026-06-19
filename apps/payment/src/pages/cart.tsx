import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { CartItem } from "@/lib/cart";
import { decodeCart, normalizeCart, persistCart } from "@/lib/cart";
import { CartItem as CartItemRow } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { CartEmpty } from "@/components/CartEmpty";
import { FONT_BODY, FONT_HEADING, COLOR } from "@/lib/tokens";
import { ASTRO_URL } from "@/lib/config";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!router.isReady || initialized.current) return;
    initialized.current = true;

    const param = router.query.cart;

    if (typeof param === "string" && param.length > 0) {
      const decoded = decodeCart(param);
      setItems(decoded);
      persistCart(decoded);
      void router.replace("/cart", undefined, { shallow: true });
    } else {
      try {
        const raw: unknown = JSON.parse(localStorage.getItem("nura-cart") ?? "[]");
        const normalized = Array.isArray(raw) ? normalizeCart(raw) : [];
        setItems(normalized);
        persistCart(normalized);
      } catch {
        setItems([]);
      }
    }

    setReady(true);
  // initialized.current prevents double-run after router.replace clears the ?cart param
  }, [router.isReady, router.query.cart]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleQtyChange(id: string, color: string | undefined, delta: number) {
    setItems((prev) => {
      const next = prev
        .map((item) =>
          item.id === id && item.selectedColor === color
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0);
      persistCart(next);
      return next;
    });
  }

  function handleRemove(id: string, color: string | undefined) {
    setItems((prev) => {
      const next = prev.filter(
        (item) => !(item.id === id && item.selectedColor === color)
      );
      persistCart(next);
      return next;
    });
  }

  // Intercept browser back button — cross-origin cookies don't work in production
  // (different domains). Push sentinel AFTER ready so router.replace() doesn't
  // overwrite it (router.replace uses replaceState on the current entry).
  useEffect(() => {
    if (!ready) return;
    window.history.pushState(null, "");

    function handlePopState() {
      try {
        const raw = localStorage.getItem("nura-cart") ?? "[]";
        const encoded = btoa(
          Array.from(new TextEncoder().encode(raw), (b) => String.fromCharCode(b)).join("")
        );
        window.location.replace(`${ASTRO_URL}/produk/?_cart=${encoded}`);
      } catch {
        window.location.replace(`${ASTRO_URL}/produk/`);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  function goBackToAstro() {
    try {
      // Read directly from localStorage — always authoritative, no React state closure risk
      const raw = localStorage.getItem("nura-cart") ?? "[]";
      const encoded = btoa(Array.from(new TextEncoder().encode(raw), (b) => String.fromCharCode(b)).join(""));
      window.location.href = `${ASTRO_URL}/produk/?_cart=${encoded}`;
    } catch {
      window.location.href = `${ASTRO_URL}/produk/`;
    }
  }

  const totalQty = items.reduce((n, i) => n + i.qty, 0);

  return (
    <>
      <Head>
        <title>Keranjang — NURA</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ minHeight: "100vh", background: "white", fontFamily: FONT_BODY }}>

        {/* ── Header ── */}
        <header style={{
          borderBottom: `1px solid ${COLOR.border}`,
          padding: "0 48px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <a
            href={ASTRO_URL}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "1.3rem",
              letterSpacing: "0.38em",
              fontWeight: 300,
              color: COLOR.ink,
              textDecoration: "none",
            }}
          >
            NURA
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <button
              onClick={goBackToAstro}
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: COLOR.muted,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              ← Lanjut Belanja
            </button>

            {/* Cart count */}
            <div style={{ position: "relative" }}>
              <svg width="18" height="18" fill="none" stroke={COLOR.ink} strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalQty > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -8,
                  width: 15, height: 15,
                  background: COLOR.jet, color: "white",
                  fontSize: 9, fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {totalQty}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 48px" }}>

          {/* Page heading */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 44,
            paddingBottom: 24,
            borderBottom: `1px solid ${COLOR.border}`,
          }}>
            <h1 style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 300,
              color: COLOR.ink,
              letterSpacing: "0.02em",
            }}>
              Keranjang Belanja
            </h1>
            {ready && totalQty > 0 && (
              <span style={{ fontSize: 12, color: COLOR.muted }}>
                {totalQty} item
              </span>
            )}
          </div>

          {/* Content */}
          {!ready ? (
            <div style={{
              padding: "80px 0",
              textAlign: "center",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: COLOR.muted,
            }}>
              Memuat...
            </div>
          ) : items.length === 0 ? (
            <CartEmpty onNavigate={goBackToAstro} />
          ) : (
            <div className="cart-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 56,
              alignItems: "start",
            }}>
              {/* Items */}
              <div>
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.id}-${item.selectedColor ?? ""}`}
                    item={item}
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Summary */}
              <CartSummary items={items} onContinueShopping={goBackToAstro} />
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          main { padding: 32px 20px !important; }
          header { padding: 0 20px !important; }
        }
      `}</style>
    </>
  );
}
