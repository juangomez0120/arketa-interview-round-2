import { db } from "@/lib/db";
import { buildCart } from "@/lib/cart";
import { applyPromo } from "@/lib/promo";

export async function POST(req: Request) {
  const { clientId, offeringId, classId, promoCode } = await req.json();

  const cart = await buildCart({ clientId, offeringId, classId });
  const promo = promoCode ? await db.promos.findByCode(promoCode) : null;
  const result = applyPromo(cart, promo);

  return Response.json({ cart, ...result });
}
