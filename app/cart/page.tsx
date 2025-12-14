"use client";

import Link from "next/link";
import { useCart } from "../components/CartProvider";

const TAX_RATE = 0.0825;

export default function CartPage() {
  const { detailedLines, subtotal, addItem, decrementItem, removeItem } = useCart();

  const estimatedTax = subtotal * TAX_RATE;
  const total = subtotal + estimatedTax;

  if (detailedLines.length === 0) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl bg-slate-900/70 p-6 text-center shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
          <h1 className="text-2xl font-semibold text-slate-100">Your bag is empty</h1>
          <p className="mt-3 text-sm text-slate-400">
            Scan items around the store and they will appear here. Ready when you are.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400"
          >
            Browse products
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-100">Your cart</h1>
        <ul className="space-y-4">
          {detailedLines.map(({ product, quantity, lineTotal }) => (
            <li
              key={product.id}
              className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_18px_34px_rgba(2,6,23,0.45)]"
            >
              <div className="flex-1">
                <h2 className="text-base font-semibold text-slate-100">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-400">{product.category}</p>
                <p className="mt-2 text-sm text-slate-400">
                  ${product.price.toFixed(2)} each
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="mt-3 text-xs font-medium text-slate-500 underline"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => decrementItem(product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-sm font-semibold text-slate-200 transition hover:border-slate-400"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => addItem(product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-sm font-semibold text-slate-200 transition hover:border-slate-400"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-100">
                  ${lineTotal.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-slate-900/80 p-5 shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
        <h2 className="text-lg font-semibold text-slate-100">Price breakdown</h2>
        <dl className="mt-4 space-y-2 text-sm text-slate-400">
          <div className="flex justify-between">
            <dt>Items</dt>
            <dd>${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated tax</dt>
            <dd>${estimatedTax.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-t border-dashed border-slate-700 pt-2 text-base font-semibold text-slate-100">
            <dt>Total due</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </dl>
      </section>

      <Link
        href="/payment"
        className="sticky bottom-20 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-base font-semibold text-black shadow-xl transition hover:bg-cyan-400"
      >
        Proceed to payment
      </Link>
    </div>
  );
}
