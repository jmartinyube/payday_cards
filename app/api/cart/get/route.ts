import { shopify } from "@/lib/shopify";

export async function POST(req: Request) {
  const { cartId } = await req.json();

  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 { amount currencyCode }
                  image { url }
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopify(query, { cartId });

  return new Response(JSON.stringify({ cart: data.cart }), { headers: { "Content-Type": "application/json" } });
}
