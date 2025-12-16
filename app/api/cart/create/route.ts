import { shopify } from "@/lib/shopify";

export async function POST(req: Request) {
  const { variantId, quantity } = await req.json();

  const query = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
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
    lines: [{ merchandiseId: variantId, quantity }],
  };

  const data = await shopify(query, variables);

  const cart = data.cartCreate.cart;

  return new Response(JSON.stringify({ cart }), { headers: { "Content-Type": "application/json" } });
}
