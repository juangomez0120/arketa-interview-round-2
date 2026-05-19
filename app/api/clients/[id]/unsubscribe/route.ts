import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const partnerId = await getCurrentPartnerId();
  const { id } = await ctx.params;
  const { unsubscribed } = (await req.json()) as { unsubscribed?: boolean };

  const client = await db.clients.findById(id, partnerId);
  if (!client) {
    return Response.json({ error: "Client not found" }, { status: 404 });
  }

  if (unsubscribed) {
    await db.suppressions.add({ email: client.email, partnerId });
  } else {
    await db.suppressions.remove({ email: client.email, partnerId });
  }

  return Response.json({ unsubscribed: !!unsubscribed });
}
