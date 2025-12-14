"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatCurrency } from "../lib/currency";

const STORE_NAME = "NexTop";

// Compact header stays consistent across pages and keeps cart entry easy to find.
export function Header() {
  const { itemCount, subtotal } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-100"
        >
          {STORE_NAME}
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-1 text-sm font-medium text-slate-100 shadow-sm transition hover:border-slate-500 hover:bg-slate-900"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-black text-xs font-semibold">
            {itemCount}
          </span>
          <span>
            Cart | {formatCurrency(subtotal)}
          </span>
        </Link>
      </div>
    </header>
  );
}
