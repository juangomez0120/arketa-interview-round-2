import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";

export async function GET() {
  const partnerId = await getCurrentPartnerId();
  const clients = await db.clients.all(partnerId);
  return Response.json({ clients });
}
