"use client";

import { useCart } from "./CartProvider";
import type { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
};

// Lightweight card for browsing products quickly in a mobile grid.
export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-[0_18px_34px_rgba(2,6,23,0.45)]">
      <div>
        <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-slate-800 text-xs uppercase tracking-wide text-slate-400">
          {product.imageAlt ?? "Product"}
        </div>
        <h2 className="text-base font-semibold text-slate-100">
          {product.name}
        </h2>
        <p className="text-sm text-slate-400">{product.category}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-slate-100">
          ${product.price.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => addItem(product.id)}
          className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
        >
          Add
        </button>
      </div>
    </article>
  );
}
