import { shopify } from "@/lib/shopify";

export async function POST(req: Request) {
  const { cartId, lineId } = await req.json();

  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

  const variables = { cartId, lineIds: [lineId] };

  const data = await shopify(query, variables);
  return new Response(JSON.stringify({ cart: data.cartLinesRemove.cart }), { headers: { "Content-Type": "application/json" } });
}
