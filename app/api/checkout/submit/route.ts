import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { buildCart } from "@/lib/cart";
import { applyPromo } from "@/lib/promo";
import type { Cart } from "@/lib/types";

export async function POST(req: Request) {
  const { clientId, offeringId, promoCode, quantity } = await req.json();

  const cart = await buildCart({ clientId, offeringId, quantity });
  const promo = promoCode ? await db.promos.findByCode(promoCode) : null;

  // assign a unique id per line item for the charge record
  const orderCart: Cart = {
    products: cart.products.map((p) => ({
      productId: randomUUID(),
      type: p.type,
      price: p.price,
    })),
  };

  const result = applyPromo(orderCart, promo);

  const charge = await db.charges.create({
    clientId,
    items: orderCart.products,
    subtotal: result.subtotal,
    discount: result.discount,
    total: result.total,
    promoCode: promoCode ?? null,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ chargeId: charge.id, total: charge.total });
}
