import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import { buildCart } from "@/lib/cart";
import { applyPromo } from "@/lib/promo";

export async function POST(req: Request) {
  const partnerId = await getCurrentPartnerId();
  const { clientId, offeringId, promoCode, quantity } = await req.json();

  const cart = await buildCart({ clientId, offeringId, partnerId, quantity });
  const promo = promoCode ? await db.promos.findByCode(promoCode, partnerId) : null;
  const result = applyPromo(cart, promo);

  return Response.json({ cart, ...result });
}
