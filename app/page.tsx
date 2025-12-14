"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BottomCartCTA } from "./components/BottomCartCTA";
import { ProductList } from "./components/ProductList";
import type { Product } from "./data/products";
import { ProximityAssistance } from "./components/ProximityAssistance";
import { StoreMap } from "./components/StoreMap";
import type { ProductLocation } from "./components/LocationDrawer";

export default function Home() {
  const mapSectionRef = useRef<HTMLDivElement | null>(null);
  const latestRequestRef = useRef(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [location, setLocation] = useState<ProductLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const highlight = useMemo(() => {
    if (!location) return null;
    return {
      zone: location.zone,
      aisle: location.aisle,
      shelf: location.shelf,
    };
  }, [location]);

  async function handleProductSelect(product: Product) {
    setSelectedProduct(product);
    setSelectedProductId(product.id);
    setLoadingProductId(product.id);
    setLocation(null);
    setLocationError(null);

    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    try {
      const response = await fetch(`/api/products/${product.id}/location`, {
        cache: "no-store",
      });

      if (response.status === 404) {
        if (latestRequestRef.current === requestId) {
          setLocation(null);
          setLocationError("We could not find a location for this product yet.");
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as ProductLocation;
      if (latestRequestRef.current === requestId) {
        setLocation(payload);
      }
    } catch (error) {
      if (latestRequestRef.current === requestId) {
        setLocationError(
          error instanceof Error ? error.message : "Unable to load product location.",
        );
      }
    } finally {
      setLoadingProductId((current) => (current === product.id ? null : current));
    }
  }

  return (
    <div className="space-y-8 pb-24">
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

      <section ref={mapSectionRef} className="space-y-4">
        <StoreMap highlight={highlight} />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-200">
          {loadingProductId ? (
            <p>
              Locating <span className="font-semibold text-cyan-200">{selectedProduct?.name ?? "item"}</span>…
            </p>
          ) : locationError ? (
            <p className="text-red-200">{locationError}</p>
          ) : location && selectedProduct ? (
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-500">Current pick</p>
              <h3 className="text-lg font-semibold text-slate-100">{selectedProduct.name}</h3>
              <p className="text-sm text-slate-300">
                Head to the <span className="font-semibold text-cyan-200">{location.zone}</span> zone, aisle
                <span className="font-semibold text-cyan-200"> {location.aisle}</span>, shelf
                <span className="font-semibold text-cyan-200"> {location.shelf}</span>.
              </p>
              {location.directions ? (
                <p className="text-xs text-slate-400">{location.directions}</p>
              ) : null}
            </div>
          ) : (
            <p>Select a product to spotlight its spot on the map.</p>
          )}
        </div>
      </section>

      <ProductList
        onProductSelect={handleProductSelect}
        activeProductId={selectedProductId}
        loadingProductId={loadingProductId}
      />

      <ProximityAssistance />

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
