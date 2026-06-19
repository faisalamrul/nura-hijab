import { describe, it, expect } from "vitest";
import { normalizeCart, decodeCart, formatIDR } from "./cart";

// Mirrors the encode used in NavHeader.astro and cart.tsx goBackToAstro
function encodeCart(items: unknown[]): string {
  const json = JSON.stringify(items);
  return btoa(Array.from(new TextEncoder().encode(json), (b) => String.fromCharCode(b)).join(""));
}

const BASE = { id: "a", name: "Voal Nabila", price: 150_000, image: "img.jpg" };

describe("normalizeCart", () => {
  it("returns empty array for empty input", () => {
    expect(normalizeCart([])).toEqual([]);
  });

  it("returns a single item with default qty=1 when qty is absent", () => {
    const result = normalizeCart([BASE]);
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(1);
  });

  // Prove-It: documents the critical bug that was fixed (qty round-trip)
  it("preserves qty from raw entries — round-trip safe", () => {
    const result = normalizeCart([{ ...BASE, qty: 3 }]);
    expect(result[0].qty).toBe(3);
  });

  it("accumulates qty when two entries share the same id and no color", () => {
    const result = normalizeCart([BASE, BASE]);
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(2);
  });

  it("accumulates qty using raw qty values, not always +1", () => {
    const result = normalizeCart([
      { ...BASE, qty: 3 },
      { ...BASE, qty: 2 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(5);
  });

  it("keeps items with same id but different color separate", () => {
    const result = normalizeCart([
      { ...BASE, selectedColor: "Black" },
      { ...BASE, selectedColor: "White" },
    ]);
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.selectedColor).sort()).toEqual(["Black", "White"]);
  });

  it("treats undefined color and absent color as the same key", () => {
    const result = normalizeCart([BASE, { ...BASE, selectedColor: undefined }]);
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(2);
  });

  it("keeps item without selectedColor separate from item with selectedColor", () => {
    const result = normalizeCart([BASE, { ...BASE, selectedColor: "Black" }]);
    expect(result).toHaveLength(2);
  });

  it("skips entry missing id", () => {
    expect(normalizeCart([{ name: "X", price: 100, image: "img.jpg" }])).toEqual([]);
  });

  it("skips entry missing name", () => {
    expect(normalizeCart([{ id: "a", price: 100, image: "img.jpg" }])).toEqual([]);
  });

  it("skips entry missing price", () => {
    expect(normalizeCart([{ id: "a", name: "X", image: "img.jpg" }])).toEqual([]);
  });

  it("skips entry missing image", () => {
    expect(normalizeCart([{ id: "a", name: "X", price: 100 }])).toEqual([]);
  });

  it("skips entry with wrong type for id (number instead of string)", () => {
    expect(normalizeCart([{ id: 1, name: "X", price: 100, image: "img.jpg" }])).toEqual([]);
  });

  it("treats qty=0 as 1", () => {
    const result = normalizeCart([{ ...BASE, qty: 0 }]);
    expect(result[0].qty).toBe(1);
  });

  it("treats negative qty as 1", () => {
    const result = normalizeCart([{ ...BASE, qty: -5 }]);
    expect(result[0].qty).toBe(1);
  });

  it("treats non-numeric qty as 1", () => {
    const result = normalizeCart([{ ...BASE, qty: "3" }]);
    expect(result[0].qty).toBe(1);
  });

  it("floors fractional qty", () => {
    const result = normalizeCart([{ ...BASE, qty: 2.9 }]);
    expect(result[0].qty).toBe(2);
  });

  it("does not expose selectedColor field when absent", () => {
    const result = normalizeCart([BASE]);
    expect("selectedColor" in result[0]).toBe(false);
  });

  it("preserves correct field values", () => {
    const result = normalizeCart([{ ...BASE, selectedColor: "Dusty Rose" }]);
    expect(result[0]).toMatchObject({
      id: "a",
      name: "Voal Nabila",
      price: 150_000,
      image: "img.jpg",
      selectedColor: "Dusty Rose",
      qty: 1,
    });
  });
});

describe("decodeCart", () => {
  it("decodes a valid base64-encoded cart", () => {
    const items = [{ ...BASE, qty: 2, selectedColor: "Black" }];
    const result = decodeCart(encodeCart(items));
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(2);
    expect(result[0].selectedColor).toBe("Black");
  });

  it("returns [] for empty string without throwing", () => {
    expect(decodeCart("")).toEqual([]);
  });

  it("returns [] for malformed base64 without throwing", () => {
    expect(decodeCart("!!!not-base64!!!")).toEqual([]);
  });

  it("returns [] for valid base64 that decodes to a non-array JSON value", () => {
    const encoded = encodeCart({ not: "an array" } as unknown as unknown[]);
    expect(decodeCart(encoded)).toEqual([]);
  });

  it("returns [] for valid base64 that decodes to null", () => {
    const json = "null";
    const encoded = btoa(Array.from(new TextEncoder().encode(json), (b) => String.fromCharCode(b)).join(""));
    expect(decodeCart(encoded)).toEqual([]);
  });

  it("passes decoded items through normalizeCart (merges duplicates)", () => {
    const items = [BASE, BASE];
    const result = decodeCart(encodeCart(items));
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(2);
  });
});

describe("formatIDR", () => {
  it("formats 150000 as Indonesian Rupiah with dots as thousands separator", () => {
    const result = formatIDR(150_000);
    expect(result).toContain("150.000");
  });

  it("formats 0 without throwing", () => {
    expect(() => formatIDR(0)).not.toThrow();
  });

  it("includes the IDR currency indicator", () => {
    const result = formatIDR(50_000);
    // Indonesian locale uses "Rp" prefix
    expect(result).toMatch(/Rp|IDR/);
  });
});
