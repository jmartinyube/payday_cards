// app/product/[handle]/ProductDetails.tsx
"use client";

import { useCart } from "@/app/context/CartContext";

export default function ProductDetails({ product }: { product: any }) {
  const { addToCart } = useCart();
  const image = product.images?.edges?.[0]?.node?.url;
  const firstVariant = product.variants?.edges?.[0]?.node;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <img src={image || "/placeholder.png"} alt={product.title} className="rounded-lg mb-6"/>
      <h1 className="text-3xl font-heading font-bold">{product.title}</h1>
      <p className="text-[var(--foreground)] mt-2">
        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
      </p>
      <p className="mt-4 text-[var(--foreground)]">{product.description}</p>

      <button
        className="mt-6 px-6 py-3 rounded-lg font-bold transition-colors"
        style={{
          backgroundColor: "var(--accent-green)",
          color: "var(--background)",
          fontFamily: "var(--font-family-body)",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-yellow)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-green)";
        }}
        onClick={() => {
          if (!firstVariant) return;
          addToCart({
            id: firstVariant.id,
            title: product.title,
            image,
            price: product.priceRange.minVariantPrice.amount,
            quantity: 1,
          });
        }}
      >
        Añadir al carrito
      </button>
    </div>
  );
}