"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "../data/products";
import { products } from "../data/products";

type CartLine = {
  productId: string;
  quantity: number;
};

type DetailedCartLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

type CartContextValue = {
  lines: CartLine[];
  detailedLines: DetailedCartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "scanpay-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Provides global cart state and persists it to localStorage for fast return visits.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedCart = window.localStorage.getItem(STORAGE_KEY);
    if (!savedCart) return;

    try {
      const parsed: CartLine[] = JSON.parse(savedCart);
      if (Array.isArray(parsed)) {
        setLines(parsed.filter((line) => line.quantity > 0));
      }
    } catch (error) {
      console.warn("Unable to read saved cart", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const detailedLines = useMemo(() => {
    return lines
      .map((line) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product) return undefined;
        return {
          product,
          quantity: line.quantity,
          lineTotal: product.price * line.quantity,
        } satisfies DetailedCartLine;
      })
      .filter((entry): entry is DetailedCartLine => Boolean(entry));
  }, [lines]);

  const subtotal = useMemo(() => {
    return detailedLines.reduce((total, line) => total + line.lineTotal, 0);
  }, [detailedLines]);

  const itemCount = useMemo(() => {
    return lines.reduce((count, line) => count + line.quantity, 0);
  }, [lines]);

  const addItem = useCallback((productId: string) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === productId);
      if (!existing) {
        return [...prev, { productId, quantity: 1 }];
      }

      return prev.map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      );
    });
  }, []);

  const decrementItem = useCallback((productId: string) => {
    setLines((prev) => {
      return prev
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity - 1 }
            : line,
        )
        .filter((line) => line.quantity > 0);
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      detailedLines,
      itemCount,
      subtotal,
      addItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [lines, detailedLines, itemCount, subtotal, addItem, decrementItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
