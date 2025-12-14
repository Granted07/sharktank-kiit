"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./components/ProductCard";
import { BottomCartCTA } from "./components/BottomCartCTA";
import { categories, products } from "./data/products";

const ALL = "All" as const;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<typeof ALL | (typeof categories)[number]>(ALL);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === ALL) return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8 pb-16">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Scan-and-go checkout
        </p>
        <h1 className="text-3xl font-semibold text-slate-100">
          Build your bag while you browse the aisles.
        </h1>
        <p className="text-sm text-slate-400">
          Pick your items, review your cart, and breeze through payment in seconds. Your session stays with you while you shop.
        </p>
      </section>

      <nav className="flex gap-2 overflow-x-auto pb-2">
        {[ALL, ...categories].map((category) => {
          const isActive = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-cyan-400 bg-cyan-500 text-black shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              {category}
            </button>
          );
        })}
      </nav>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-300">
        <h2 className="mb-1 text-base font-semibold text-slate-100">
          Need a hand?
        </h2>
        <p>
          Show this screen to an associate anytime. They can help you add items or answer questions about pricing.
        </p>
        <Link
          href="/cart"
          className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-400"
        >
          Jump to cart
        </Link>
      </div>

      <BottomCartCTA />
    </div>
  );
}
