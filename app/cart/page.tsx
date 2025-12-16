"use client";

import { useCart, CartLine } from "@/app/context/CartContext";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateQuantity, removeLine, openCheckout } = useCart();
  const [stockWarning, setStockWarning] = useState<string | null>(null);

  if (!cart || !cart.lines.length) {
    return <p className="p-10">Tu carrito está vacio.</p>;
  }

  const total = cart.lines.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleIncrease = (item: CartLine) => {
    if (item.quantity + 1 > item.maxQuantity) {
      setStockWarning(`No puedes añadir más de ${item.maxQuantity} unidades de "${item.title}"`);
      setTimeout(() => setStockWarning(null), 3000);
      return;
    }
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (item: CartLine) => {
    if (item.quantity <= 1) {
      removeLine(item.id); // eliminar si llega a 0 o 1
      return;
    }
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Carrito</h1>

      {stockWarning && (
        <div className="mb-4 p-3 bg-yellow-200 text-yellow-800 rounded">
          {stockWarning}
        </div>
      )}

      {cart.lines.map((item) => (
        <div key={item.id} className="flex gap-4 mb-6 border-b pb-4">
          <img src={item.image || "/placeholder.png"} className="w-20 rounded" />

          <div className="flex-1">
            <h2 className="font-bold">{item.title}</h2>
            <p>{item.price} € × {item.quantity} (Stock: {item.maxQuantity})</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDecrease(item)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => removeLine(item.id)}
            className="text-red-500 font-bold px-2"
          >
            Quitar
          </button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6">Total: {total.toFixed(2)} €</h2>

      <button
        onClick={openCheckout}
        className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-500"
      >
        Ir al checkout
      </button>
    </div>
  );
}






