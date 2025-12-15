export type ShopifyProductRaw = {
  id: string;
  title: string;
  handle: string;
  tags?: string[];
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

export type Product = {
  id: string;
  title: string;
  handle: string;
  image: string;
  price: string;
  currency: string;
};
