"use client";

import { useCart, CartLine } from "@/app/context/CartContext";
import { useState } from "react";

export default function ProductDetails({ product }: { product: any }) {
  const { cart, addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.edges?.[0]?.node.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [stockWarning, setStockWarning] = useState<string | null>(null);

  // Imagen principal y miniaturas
  const [mainImage, setMainImage] = useState(
    product.images?.edges?.[0]?.node?.url || "/placeholder.png"
  );

  const selectedVariant = product.variants?.edges?.find(
    (v: any) => v.node.id === selectedVariantId
  )?.node;

  const maxQuantity = selectedVariant?.quantityAvailable ?? 0;

  const cartLine: CartLine | undefined = cart?.lines.find(
    (l) => l.variantId === selectedVariantId
  );
  const quantityInCart = cartLine?.quantity || 0;

  const availableToAdd = Math.max(maxQuantity - quantityInCart, 0);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    if (quantity > availableToAdd) {
      setStockWarning(
        `No puedes añadir más de ${availableToAdd} unidades de "${product.title}"`
      );
      setTimeout(() => setStockWarning(null), 3000);
      return;
    }

    await addToCart(selectedVariant.id, quantity);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
      {/* Columna de imágenes */}
      <div className="flex-1">
        <img
          src={mainImage}
          alt={product.title}
          className="rounded-lg w-full object-cover"
        />

        {product.images?.edges.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images.edges.map((img: any, index: number) => (
              <img
                key={index}
                src={img.node.url}
                alt={`Imagen ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  mainImage === img.node.url
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(img.node.url)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Columna de info y añadir al carrito */}
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold">{product.title}</h1>

        <p className="mt-2">
          {product.priceRange.minVariantPrice.amount}{" "}
          {product.priceRange.minVariantPrice.currencyCode}
        </p>

        {product.variants?.edges.length > 1 && (
          <div className="mt-4">
            <label className="font-bold mr-2">Variante:</label>
            <select
              value={selectedVariantId || ""}
              onChange={(e) => {
                setSelectedVariantId(e.target.value);
                setQuantity(1);
              }}
              className="border px-2 py-1 rounded"
            >
              {product.variants.edges.map((v: any) => (
                <option key={v.node.id} value={v.node.id}>
                  {v.node.title} (Stock: {v.node.quantityAvailable})
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="mt-2 text-sm text-gray-500">
          Stock disponible: {availableToAdd}
        </p>

        {stockWarning && (
          <div className="mb-4 p-3 bg-yellow-200 text-yellow-800 rounded">
            {stockWarning}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <label className="font-bold">Cantidad:</label>
          <input
            type="number"
            min={1}
            max={availableToAdd}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(Math.max(1, Number(e.target.value)), availableToAdd)
              )
            }
            className="border px-2 py-1 rounded w-16"
          />
        </div>

        <button
          disabled={!selectedVariant || availableToAdd <= 0}
          onClick={handleAddToCart}
          className="mt-6 px-6 py-3 rounded-lg font-bold bg-[var(--accent-green)] text-[var(--background)] hover:bg-[var(--accent-yellow)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Añadir al carrito
        </button>

        <p className="mt-4">{product.description}</p>
      </div>
    </div>
  );
}





