"use client";

import { useMemo } from "react";
import Link from "next/link";

export default function ExitPage() {
  const ticketCode = useMemo(() => {
    const random = Math.floor(Math.random() * 900 + 100);
    return `EXIT-${random}`;
  }, []);

  const timestamp = useMemo(
    () =>
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  return (
    <div className="space-y-6 pb-16">
      <section className="rounded-3xl bg-slate-900/80 p-6 text-center shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <span className="text-xl font-semibold">OK</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-100">
          Payment confirmed
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Show the code below to an associate before leaving the store. They
          will scan it and open the gates.
        </p>
      </section>

      <section className="rounded-3xl bg-slate-900/80 p-6 shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
        <div className="mx-auto flex w-48 flex-col items-center gap-4">
          <div className="grid w-full grid-cols-5 gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            {Array.from({ length: 25 }).map((_, index) => (
              <div
                key={index}
                className={`h-6 w-full rounded ${
                  index % 3 === 0 ? "bg-slate-700" : "bg-slate-950"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-slate-400">
            <p className="text-base font-semibold text-slate-100">{ticketCode}</p>
            <p>Validated at {timestamp}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900/80 p-6 shadow-[0_24px_48px_rgba(2,6,23,0.55)]">
        <h2 className="text-lg font-semibold text-slate-100">Next steps</h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-400">
          <li>1. Walk to the staffed exit.</li>
          <li>2. Present this QR receipt to the associate.</li>
          <li>3. Keep the screen visible until the gate opens.</li>
        </ol>
      </section>

      <Link
        href="/"
        className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-medium text-slate-200 shadow-[0_18px_34px_rgba(2,6,23,0.45)] transition hover:border-slate-500"
      >
        Start a new checkout
      </Link>
    </div>
  );
}
