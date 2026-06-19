# Spec: Cart Page (apps/payment)

## Objective

Build a cart review page in `apps/payment` (Next.js 15 Pages Router) that users reach after clicking the cart icon on the Astro storefront. Users can review items, adjust quantity, remove items, and proceed to checkout.

**User story:** As a shopper on the NURA storefront, when I click the cart icon I want to see my saved items, adjust quantities, and confirm my order before paying.

## Tech Stack

- Next.js 15 (Pages Router) — `apps/payment/src/pages/`
- React 19, TypeScript 5
- Tailwind CSS v4 (CSS-first, `@import "tailwindcss"`)
- No external UI library — styled inline with Silent Luxury design tokens

## Commands

```
Dev:       pnpm --filter payment dev          # port 3000
Build:     pnpm --filter payment build
Typecheck: pnpm --filter payment typecheck
```

## Cross-Origin Data Bridge

In development, Astro (`:4321`) and Next.js (`:3000`) are different origins — `localStorage` is not shared.

**Strategy:** When the user clicks the cart icon in NavHeader.astro:
1. Read `localStorage["nura-cart"]`
2. Base64-encode the JSON: `btoa(unescape(encodeURIComponent(json)))`
3. Redirect to `CART_URL + "?cart=" + encodedData`

`CART_URL` is `http://localhost:3000/cart` in dev, or `/cart` in production (same-domain nginx routing).

**Cart page priority:**
1. If `?cart=` param present → decode and use (dev cross-origin)
2. Else read `localStorage["nura-cart"]` directly (prod same-origin)

After reading, write the normalized state back to `localStorage["nura-cart"]` (so it persists across refreshes on the cart page).

## Cart Item Schema

Current `CartButton.tsx` pushes duplicate entries for the same product. The cart page normalizes this by grouping identical `(id + selectedColor)` pairs:

```ts
interface CartItem {
  id: string;
  name: string;
  price: number;        // per unit, in IDR
  image: string;
  selectedColor?: string;
  qty: number;          // normalized from duplicate entries
}
```

## Project Structure

```
apps/payment/src/
  pages/
    _app.tsx          — existing, add fonts import
    index.tsx         — existing (untouched)
    cart.tsx          — NEW: cart page
  components/
    CartItem.tsx      — NEW: single item row (image, name, color, qty controls, price)
    CartSummary.tsx   — NEW: subtotal, shipping note, CTA button
    CartEmpty.tsx     — NEW: empty state
  lib/
    cart.ts           — NEW: CartItem type, decode/normalize helpers
  styles/
    global.css        — add Google Fonts + design tokens (mirror content-hub)
```

## Design System

Mirror `apps/content-hub/src/styles/global.css` design tokens:

```css
--font-heading: "Cormorant Garamond", Georgia, serif;
--font-body:    "Inter", system-ui, sans-serif;
--color-jet:     #0a0a0a;
--color-charcoal:#2d2d2d;
--color-silver:  #c8c8c8;
--color-surface: #f7f7f7;
--color-ink:     #111111;
--color-muted:   #888888;
```

Rules:
- `border-radius: 0` everywhere (Silent Luxury = no rounded corners)
- Buttons: jet background, white text, `tracking-[0.25em] uppercase text-[11px]`
- Headings: Cormorant Garamond, font-light
- Body/labels: Inter
- Price: `tabular-nums`, `font-medium`

## Page Layout (`/cart`)

```
┌─────────────────────────────────────────────────┐
│  NURA  (wordmark link → Astro homepage)         │
├─────────────────────────────────────────────────┤
│  Keranjang Belanja          [3 item]            │
├──────────────────────────┬──────────────────────┤
│  Item list               │  Order summary       │
│  [img] name              │  Subtotal  Rp xxx    │
│        color             │  Ongkir    Gratis ≥  │
│        qty: [−] 2 [+]    │          Rp150.000   │
│        Rp 185.000        │  ─────────────────   │
│        [Hapus]           │  Total     Rp xxx    │
│                          │                      │
│  [img] name …            │  [Lanjut ke Pembayaran]│
│                          │                      │
│                          │  ← Lanjut Belanja    │
└──────────────────────────┴──────────────────────┘
```

Mobile: summary stacks below item list.

## Changes to Content-Hub NavHeader

Update the cart icon button in `NavHeader.astro` to redirect to Next.js on click:

```html
<button id="nav-cart-btn" ...>  →  becomes redirect trigger
```

Add to the existing `<script>` block:

```js
const CART_URL = "http://localhost:3000/cart"; // dev; prod: "/cart"

document.getElementById("nav-cart-btn")?.addEventListener("click", () => {
  try {
    const raw = localStorage.getItem("nura-cart") ?? "[]";
    const encoded = btoa(unescape(encodeURIComponent(raw)));
    window.location.href = `${CART_URL}?cart=${encoded}`;
  } catch {
    window.location.href = CART_URL;
  }
});
```

## Boundaries

- **Always:** Keep `border-radius: 0`, use Silent Luxury tokens, TypeScript strict
- **Ask first:** Any external package additions, payment gateway integration, API calls
- **Never:** Implement real payment processing (out of scope), use `@repo/ui` Button/Card (design doesn't match Silent Luxury)

## Success Criteria

- [ ] Navigating to `http://localhost:3000/cart?cart=<encoded>` shows correct items
- [ ] Qty `+` / `−` updates count and price in real time; `−` at 1 removes the item
- [ ] "Hapus" removes the item
- [ ] Empty cart shows a friendly empty state with link back to storefront
- [ ] Order summary shows correct subtotal (sum of price × qty), shipping note
- [ ] "Lanjut Belanja" link returns to `http://localhost:4321/produk/`
- [ ] Page is fully responsive (mobile-first)
- [ ] `pnpm --filter payment typecheck` passes with 0 errors
- [ ] Design matches Silent Luxury (0px radius, correct fonts/colors)

## Open Questions

- In production, will `/cart` be on the same domain as the Astro site? If yes, the `?cart=` param approach becomes unnecessary (localStorage shared). Confirm so we can set `CART_URL` correctly via env var.
yes same domain
- Should "Lanjut ke Pembayaran" go to a `/checkout` page (future), or is a WhatsApp/email order for now?
/checkout page
