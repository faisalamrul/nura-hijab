import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedColor?: string | undefined;
}

interface Props {
  productId: string;
  productName: string;
  price: number;
  image: string;
  colors?: string[];
}

export function CartButton({ productId, productName, price, image, colors = [] }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colors[0]
  );
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    const item: CartItem = {
      id: productId,
      name: productName,
      price,
      image,
      selectedColor,
    };

    try {
      const existing: CartItem[] = JSON.parse(
        localStorage.getItem("nura-cart") ?? "[]"
      );
      existing.push(item);
      localStorage.setItem("nura-cart", JSON.stringify(existing));
      document.dispatchEvent(new Event("nura:cart-update"));
    } catch {
      // localStorage unavailable
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
            Warna:{" "}
            <span className="text-ink font-medium">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={[
                  "px-3 py-1.5 text-[11px] border transition-colors duration-150",
                  selectedColor === color
                    ? "border-jet bg-jet text-white"
                    : "border-zinc-200 text-ink hover:border-zinc-400",
                ].join(" ")}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className={[
          "w-full py-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-200",
          added
            ? "bg-zinc-700 text-white"
            : "bg-jet text-white hover:bg-charcoal",
        ].join(" ")}
      >
        {added ? "✓ Ditambahkan" : "Tambah ke Keranjang"}
      </button>
    </div>
  );
}
