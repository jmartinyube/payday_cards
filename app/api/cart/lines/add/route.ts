import { shopify } from "@/lib/shopify";

export async function POST(req: Request) {
  const { cartId, variantId, quantity } = await req.json();

  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
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
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  };

  const data = await shopify(query, variables);
  return new Response(JSON.stringify({ cart: data.cartLinesAdd.cart }), { headers: { "Content-Type": "application/json" } });
}
