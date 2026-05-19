import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import type { PromoCode } from "@/lib/types";

export async function GET() {
  const partnerId = await getCurrentPartnerId();
  const promos = await db.promos.all(partnerId);
  return Response.json({ promos });
}

export async function POST(req: Request) {
  const partnerId = await getCurrentPartnerId();
  const body = (await req.json()) as Partial<PromoCode>;
  if (!body.code || typeof body.discountPercent !== "number" || !Array.isArray(body.appliesTo)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const existing = await db.promos.findByCode(body.code, partnerId);
  if (existing) {
    return Response.json({ error: "Code already exists" }, { status: 409 });
  }
  const promo = await db.promos.create({
    code: body.code,
    partnerId,
    discountPercent: body.discountPercent,
    appliesTo: body.appliesTo,
  });
  return Response.json({ promo });
}

export async function PUT(req: Request) {
  const partnerId = await getCurrentPartnerId();
  const body = (await req.json()) as Partial<PromoCode> & { code: string };
  if (!body.code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }
  const updated = await db.promos.update(body.code, partnerId, body);
  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ promo: updated });
}
