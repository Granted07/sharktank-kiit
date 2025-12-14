"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatCurrency } from "../lib/currency";

// Anchors the primary action near the thumb when browsing on mobile devices.
export function BottomCartCTA() {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center pb-4">
      <Link
        href="/cart"
        className="mx-4 flex w-full max-w-xl items-center justify-between rounded-full bg-cyan-500 px-5 py-3 text-black shadow-xl transition hover:bg-cyan-400"
      >
        <span className="text-sm uppercase tracking-wide">View Cart</span>
        <span className="text-base font-semibold">
          {itemCount} | {formatCurrency(subtotal)}
        </span>
      </Link>
    </div>
  );
}
