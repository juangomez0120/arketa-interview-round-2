import { db } from "@/lib/db";
import { appendLog, sendEmail } from "@/lib/email/send";
import type { EmailKind } from "@/lib/types";

export async function POST(req: Request) {
  const { clientId, kind } = (await req.json()) as { clientId: string; kind: EmailKind };
  const client = await db.clients.findById(clientId);
  if (!client) return new Response("Not found", { status: 404 });

  try {
    await sendEmail({ to: client.email, kind, clientId });
    return Response.json({ ok: true });
  } catch {
    await appendLog({ level: "ERROR", msg: "Email send failed", clientId });
    return Response.json({ ok: false }, { status: 500 });
  }
}
