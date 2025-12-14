"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "../data/products";
import { ProductCard } from "./ProductCard";
import { useCart } from "./CartProvider";

type ProductListProps = {
  onProductSelect: (product: Product) => void;
  activeProductId?: string | null;
  loadingProductId?: string | null;
};

type ApiProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
};

type ProductsResponse = {
  products: ApiProduct[];
};

function mapApiProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
  };
}

export function ProductList({ onProductSelect, activeProductId = null, loadingProductId = null }: ProductListProps) {
  const { setCatalog } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load products (${response.status})`);
        }

        const payload = (await response.json()) as ProductsResponse;
        if (!isMounted) return;

        const mapped = payload.products.map(mapApiProduct);
        setItems(mapped);
        setCatalog(mapped);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load products");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [setCatalog]);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, Product[]>();
    items.forEach((product) => {
      const bucket = byCategory.get(product.category) ?? [];
      bucket.push(product);
      byCategory.set(product.category, bucket);
    });

    return Array.from(byCategory.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/60 bg-red-500/10 p-6 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
        No products available yet. Try refreshing in a moment.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map(([category, products]) => (
        <section key={category} className="space-y-4">
          <header>
            <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
            <h2 className="text-xl font-semibold text-slate-100">{category}</h2>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onLocate={onProductSelect}
                isSelected={activeProductId === product.id}
                isLoading={loadingProductId === product.id}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
