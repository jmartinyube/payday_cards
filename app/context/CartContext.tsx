"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartLine {
  id: string;
  variantId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  cost: { totalAmount: { amount: number; currencyCode: string } };
  lines: CartLine[];
}

interface CartContextType {
  cart: Cart | null;
  cartId: string | null;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  openCheckout: () => void;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cartId");
    if (saved) setCartId(saved);
  }, []);

  useEffect(() => {
    if (cartId) {
      localStorage.setItem("cartId", cartId);
      refreshCart();
    }
  }, [cartId]);

  const transformCart = (shopifyCart: any): Cart => {
    const lines: CartLine[] =
      shopifyCart.lines?.edges?.map((edge: any) => {
        const item = edge.node.merchandise;

        const title =
          item.product?.title && item.product.title !== "Default Title"
            ? item.product.title
            : item.title || "Producto";

        const maxQuantity = item.quantityAvailable ?? 1;

        return {
          id: edge.node.id,
          variantId: item.id,
          title,
          price: Number(item.priceV2?.amount || 0),
          image: item.image?.url || "/placeholder.png",
          quantity: edge.node.quantity,
          maxQuantity,
        };
      }) || [];

    return {
      id: shopifyCart.id,
      checkoutUrl: shopifyCart.checkoutUrl || null,
      totalQuantity:
        shopifyCart.totalQuantity || lines.reduce((sum, l) => sum + l.quantity, 0),
      cost: {
        totalAmount: {
          amount: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
          currencyCode:
            lines[0]?.price && shopifyCart.lines?.edges[0]?.node?.merchandise?.priceV2?.currencyCode
              ? shopifyCart.lines.edges[0].node.merchandise.priceV2.currencyCode
              : "EUR",
        },
      },
      lines,
    };
  };

  async function refreshCart() {
    if (!cartId) return;
    try {
      const res = await fetch("/api/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      });
      const data = await res.json();
      if (!data.cart) return;
      setCart(transformCart(data.cart));
    } catch (err) {
      console.error("Error refreshCart:", err);
    }
  }

  async function addToCart(variantId: string, quantity = 1) {
    try {
      const existingLine = cart?.lines.find((l) => l.variantId === variantId);
      if (existingLine && existingLine.quantity + quantity > existingLine.maxQuantity) {
        alert(`Has alcanzado el máximo stock disponible para "${existingLine.title}".`);
        return;
      }

      if (!cartId) {
        const res = await fetch("/api/cart/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = await res.json();
        setCartId(data.cart.id);
        setCart(transformCart(data.cart));
        return;
      }

      await fetch("/api/cart/lines/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, variantId, quantity }),
      });

      refreshCart();
    } catch (err) {
      console.error("Error addToCart:", err);
    }
  }

  async function updateQuantity(lineId: string, quantity: number) {
    if (!cartId) return;
    const line = cart?.lines.find((l) => l.id === lineId);
    if (!line) return;

    if (quantity > line.maxQuantity) {
      alert(`Has alcanzado el máximo stock disponible para "${line.title}".`);
      return;
    }

    if (quantity <= 0) {
      removeLine(lineId);
      return;
    }

    await fetch("/api/cart/lines/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, lineId, quantity }),
    });

    refreshCart();
  }

  async function removeLine(lineId: string) {
    if (!cartId) return;
    await fetch("/api/cart/lines/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, lineId }),
    });
    refreshCart();
  }

  const openCheckout = () => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
  };

  const totalQuantity = cart?.lines.reduce((sum, l) => sum + l.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, cartId, addToCart, updateQuantity, removeLine, openCheckout, totalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}
















