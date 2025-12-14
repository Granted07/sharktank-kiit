import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";
import { Header } from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexTop Self Checkout",
  description:
    "Mobile-first self-checkout prototype for QR-initiated in-store flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <div className="min-h-screen bg-transparent text-slate-100">
            <Header />
            <main className="mx-auto w-full max-w-xl px-4 pb-24 pt-6">
              {children}
            </main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
