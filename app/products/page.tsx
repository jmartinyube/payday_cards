// app/products/page.tsx
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { Product } from "@/types/product";

function getProductImage(product: Product) {
  return product.image || "/placeholder.png";
}

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (e) {
    console.error("Error al obtener productos:", e);
  }

  return (
    <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.length === 0 && <p>No hay productos o error de conexión.</p>}

      {products.map((product: Product) => (
        <Link key={product.id} href={`/product/${product.handle}`}>
          <div className="border p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
            <img
              src={getProductImage(product)}
              alt={product.title}
              className="rounded mb-4"
            />
            <h2 className="text-xl font-bold">{product.title}</h2>
            <p className="text-gray-600">
              {product.price}
              {product.currency}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
