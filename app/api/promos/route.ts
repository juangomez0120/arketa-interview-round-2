import { db } from "@/lib/db";
import type { PromoCode } from "@/lib/types";

export async function GET() {
  const promos = await db.promos.all();
  return Response.json({ promos });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<PromoCode>;
  if (!body.code || typeof body.discountPercent !== "number" || !Array.isArray(body.appliesTo)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }
  const existing = await db.promos.findByCode(body.code);
  if (existing) {
    return Response.json({ error: "Code already exists" }, { status: 409 });
  }
  const promo = await db.promos.create({
    code: body.code,
    discountPercent: body.discountPercent,
    appliesTo: body.appliesTo,
  });
  return Response.json({ promo });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<PromoCode> & { code: string };
  if (!body.code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }
  const updated = await db.promos.update(body.code, body);
  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ promo: updated });
}
