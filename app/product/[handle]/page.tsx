// app/product/[handle]/page.tsx
import { getProduct } from "@/lib/shopify";
import ProductDetails from "./ProductDetails"; // Cliente

interface Props {
  params: { handle: string } | Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle;

  if (!handle) return <p>Handle no definido</p>;

  const product = await getProduct(handle);
  if (!product) return <p>Producto no encontrado</p>;

  // Pasamos el producto a un Client Component que maneja carrito
  return <ProductDetails product={product} />;
}