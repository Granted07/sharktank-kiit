"use client";

import type { Product } from "../data/products";

export type ProductLocation = {
  product: string;
  zone: string;
  aisle: string;
  shelf: string;
  directions: string;
};

type LocationDrawerProps = {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  location?: ProductLocation | null;
  loading?: boolean;
  error?: string | null;
};

// Minimal slide-up drawer that presents shelf guidance in a mobile-friendly layout.
export function LocationDrawer({
  open,
  onClose,
  product,
  location,
  loading = false,
  error = null,
}: LocationDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close location drawer"
        className="flex-1 bg-transparent"
        onClick={onClose}
      />
      <aside className="relative w-full rounded-t-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-[0_-24px_48px_rgba(2,6,23,0.6)]">
        <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-slate-700" />
        <div className="space-y-4 pt-2">
          <header className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-500">Product</p>
            <h2 className="text-2xl font-semibold text-slate-100">
              {product?.name ?? "Unknown item"}
            </h2>
          </header>

          {loading ? (
            <p className="text-sm text-slate-400">Fetching shelf location...</p>
          ) : error ? (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : location ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Zone</p>
                  <p className="text-base font-semibold text-slate-100">
                    {location.zone}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Aisle</p>
                  <p className="text-base font-semibold text-slate-100">
                    {location.aisle}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Shelf code</p>
                  <p className="text-base font-semibold text-slate-100">
                    {location.shelf}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Directions</p>
                  <p className="text-sm text-slate-300">
                    {location.directions}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No location details available for this product yet.
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}
