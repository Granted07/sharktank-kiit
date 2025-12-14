"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartProvider";

const TAX_RATE = 0.0825;

export default function PaymentPage() {
  const router = useRouter();
  const { detailedLines, subtotal, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState("tap-to-pay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedTax = subtotal * TAX_RATE;
  const total = subtotal + estimatedTax;

  function handleConfirm() {
    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      router.push("/exit");
    }, 600);
  }

  if (detailedLines.length === 0) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl bg-slate-900/70 p-6 text-center shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
          <h1 className="text-2xl font-semibold text-slate-100">
            Nothing to pay yet
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Add items to your cart before checking out.
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
      <section className="rounded-3xl bg-slate-900/80 p-6 shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
        <h1 className="text-2xl font-semibold text-slate-100">Payment</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review your total and choose how you would like to pay at the kiosk.
        </p>

        <div className="mt-6 space-y-3">
          {[
            { id: "tap-to-pay", label: "Tap to Pay (Phone or Card)" },
            { id: "chip", label: "Card Insert" },
            { id: "cash", label: "Cash at Kiosk" },
          ].map((method) => (
            <label
              key={method.id}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                selectedMethod === method.id
                  ? "border-cyan-300 bg-cyan-500/90 text-black shadow-[0_0_22px_rgba(34,211,238,0.35)]"
                  : "border-slate-700 bg-slate-900 text-slate-200"
              }`}
            >
              <span>{method.label}</span>
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="h-4 w-4"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900/80 p-6 shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
        <h2 className="text-lg font-semibold text-slate-100">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          {detailedLines.map(({ product, quantity, lineTotal }) => (
            <li key={product.id} className="flex justify-between">
              <span>
                {product.name} x {quantity}
              </span>
              <span>${lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm text-slate-400">
          <div className="flex justify-between">
            <span>Items</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated tax</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-slate-700 pt-2 text-base font-semibold text-slate-100">
            <span>Total due</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="fixed bottom-4 left-1/2 z-30 w-full max-w-xl -translate-x-1/2 rounded-full bg-cyan-500 px-8 py-3 text-base font-semibold text-black shadow-[0_24px_48px_rgba(34,211,238,0.45)] transition hover:bg-cyan-400 disabled:cursor-wait disabled:bg-cyan-500/70 disabled:text-black/80"
      >
        {isSubmitting
          ? "Processing..."
          : `Confirm & Pay $${total.toFixed(2)}`}
      </button>
    </div>
  );
}
