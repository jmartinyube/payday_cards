const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN!;

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 8000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

export async function shopify(
  query: string,
  variables: Record<string, any> = {},
  retries = 2
) {
  const endpoint = `https://${domain}/api/2024-07/graphql.json`;

  try {
    const res = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error("Shopify API Errors:", json.errors);
      throw new Error("Error desde Shopify API");
    }

    return json.data;
  } catch (error) {
    if (retries > 0) {
      console.warn("Retry Shopify fetch...", retries);
      await new Promise((r) => setTimeout(r, 500));
      return shopify(query, variables, retries - 1);
    }

    console.error("Shopify fetch failed:", error);
    throw error;
  }
}


export async function getProducts(): Promise<Product[]> {
  const query = `
    query {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) { edges { node { url } } }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `;
  const data = await shopify(query);

  return data.products.edges.map((edge: any) => {
    const p = edge.node;
    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      image: p.images.edges[0]?.node.url || "/placeholder.png",
      price: p.priceRange.minVariantPrice.amount,
      currency: p.priceRange.minVariantPrice.currencyCode,
    };
  });
}


export async function getProduct(handle: string) {
  if (!handle) throw new Error("Handle no definido");

  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        images(first: 5) { edges { node { url } } }
        variants(first: 1) { edges { node { id } } }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  `;

  const data = await shopify(query, { handle });

  if (!data.product) return null;
  return data.product;
}

// Obtener productos de una colección (por handle)
// Opcionalmente filtrar por tag (subcategoría)

import type { ShopifyProductRaw, Product } from "@/types/product";

export async function getCollectionProducts(
  handle: string,
  tag?: string
): Promise<Product[]> {
  if (!handle) return [];

  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              tags
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopify(query, { handle });

  let products: ShopifyProductRaw[] =
    data.collection?.products.edges.map((e: any) => e.node) || [];

  // Filtro por subcategoría (tags)
  if (tag) {
    products = products.filter((p) => p.tags?.includes(tag));
  }

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    image: p.images.edges[0]?.node.url || "/placeholder.png",
    price: p.priceRange.minVariantPrice.amount,
    currency: p.priceRange.minVariantPrice.currencyCode,
  }));
}

// Carrito 
export async function getCart(cartId: string) {
  const query = `
    query getCart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  product {
                    title
                  }
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  return shopify(query, { id: cartId });
}
