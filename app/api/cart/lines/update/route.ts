import { shopify } from "@/lib/shopify";

export async function POST(req: Request) {
  const { cartId, lineId, quantity } = await req.json();

  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
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
    }
  `;

  const variables = { cartId, lines: [{ id: lineId, quantity }] };

  const data = await shopify(query, variables);
  return new Response(JSON.stringify({ cart: data.cartLinesUpdate.cart }), { headers: { "Content-Type": "application/json" } });
}
