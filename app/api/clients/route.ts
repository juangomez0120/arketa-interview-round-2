import { db } from "@/lib/db";
import { appendLog, sendEmail } from "@/lib/email/send";

export async function GET() {
  const clients = await db.clients.all();
  return Response.json({ clients });
}

export async function POST(req: Request) {
  const { name, email } = (await req.json()) as { name?: string; email?: string };
  if (!name?.trim() || !email?.trim()) {
    return Response.json({ error: "Name and email are required" }, { status: 400 });
  }
  const client = await db.clients.create({ name: name.trim(), email: email.trim() });

  try {
    await sendEmail({ to: client.email, kind: "welcome", clientId: client.id });
  } catch {
    await appendLog({ level: "ERROR", msg: "Email send failed", clientId: client.id });
  }

  return Response.json({ client });
}
