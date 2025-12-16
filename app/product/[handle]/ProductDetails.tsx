"use client";

import { useCart } from "@/app/context/CartContext";

export default function ProductDetails({ product }: { product: any }) {
  const { addToCart } = useCart();

  const image = product.images?.edges?.[0]?.node?.url;
  const firstVariant = product.variants?.edges?.[0]?.node;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <img src={image || "/placeholder.png"} className="rounded-lg mb-6" />

      <h1 className="text-3xl font-bold">{product.title}</h1>

      <p className="mt-2">
        {product.priceRange.minVariantPrice.amount}{" "}
        {product.priceRange.minVariantPrice.currencyCode}
      </p>

      <p className="mt-4">{product.description}</p>

      <button
        disabled={!firstVariant}
        onClick={() => firstVariant && addToCart(firstVariant.id)}
        className="mt-6 px-6 py-3 rounded-lg font-bold bg-[var(--accent-green)] text-[var(--background)] hover:bg-[var(--accent-yellow)]"
      >
        Añadir al carrito
      </button>
    </div>
  );
}

