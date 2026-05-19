import { db } from "@/lib/db";
import { setCurrentPartnerId } from "@/lib/auth";

export async function POST(req: Request) {
  const { partnerId } = (await req.json()) as { partnerId?: string };
  if (!partnerId) {
    return Response.json({ error: "Missing partnerId" }, { status: 400 });
  }
  const partner = await db.partners.findById(partnerId);
  if (!partner) {
    return Response.json({ error: "Unknown partner" }, { status: 404 });
  }
  await setCurrentPartnerId(partner.id);
  return Response.json({ partner });
}
