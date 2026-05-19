import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import { buildCart } from "@/lib/cart";
import { applyPromo } from "@/lib/promo";
import { appendLog, sendEmail } from "@/lib/email/send";
import type { Cart } from "@/lib/types";

export async function POST(req: Request) {
  const partnerId = await getCurrentPartnerId();
  const { clientId, offeringId, promoCode, quantity } = await req.json();

  const client = await db.clients.findById(clientId, partnerId);
  if (!client) {
    return Response.json({ error: "Unknown client" }, { status: 404 });
  }

  const cart = await buildCart({ clientId, offeringId, partnerId, quantity });
  const promo = promoCode ? await db.promos.findByCode(promoCode, partnerId) : null;

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
    partnerId,
    clientId,
    items: orderCart.products,
    subtotal: result.subtotal,
    discount: result.discount,
    total: result.total,
    promoCode: promoCode ?? null,
    createdAt: new Date().toISOString(),
  });

  try {
    await sendEmail({
      to: client.email,
      kind: "confirmation",
      clientId: client.id,
      partnerId,
    });
  } catch {
    await appendLog({ level: "ERROR", msg: "Email send failed", clientId: client.id });
  }

  return Response.json({ chargeId: charge.id, total: charge.total });
}
