import { db } from "@/lib/db";
import { buildCart } from "@/lib/cart";
import { applyPromo } from "@/lib/promo";

export async function POST(req: Request) {
  const { clientId, offeringId, classId, promoCode } = await req.json();

  const cart = await buildCart({ clientId, offeringId, classId });
  const promo = promoCode ? await db.promos.findByCode(promoCode) : null;
  const result = applyPromo(cart, promo);

  const charge = await db.charges.create({
    clientId,
    items: cart.products,
    subtotal: result.subtotal,
    discount: result.discount,
    total: result.total,
    promoCode: promoCode ?? null,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ chargeId: charge.id, total: charge.total });
}
