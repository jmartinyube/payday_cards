export type Product = {
  id: string;
  title: string;
  handle: string; // 👈 AÑADIR
  images: {
    edges: { node: { url: string } }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};
