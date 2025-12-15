import { getCollectionProducts } from "@/lib/shopify";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    handle: string;
    tag: string;
  }>;
};

export default async function CollectionTagPage({ params }: PageProps) {
  const { handle, tag } = await params;

  const products = await getCollectionProducts(handle, tag);

  if (!products || products.length === 0) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold">
          No hay productos en {handle} / {tag}
        </h1>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        {handle} / {tag}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <Link
            key={product.id}
            href={`/product/${product.handle}`}
            className="border p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="rounded mb-4"
            />
            <h2 className="text-lg font-bold">{product.title}</h2>
            <p>{product.price} {product.currency}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

