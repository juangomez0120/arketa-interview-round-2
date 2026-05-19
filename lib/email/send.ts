import fs from "node:fs/promises";
import path from "node:path";
import { fakeMailAdapter } from "./provider";
import { db } from "../db";
import type { EmailKind } from "../types";

const LOG_PATH = path.join(process.cwd(), "logs.txt");

export async function appendLog(line: object): Promise<void> {
  const entry = `${new Date().toISOString()} ${JSON.stringify(line)}\n`;
  await fs.appendFile(LOG_PATH, entry);
}

export async function sendEmail(args: {
  to: string;
  kind: EmailKind;
  clientId: string;
  partnerId: string;
}): Promise<void> {
  await appendLog({
    level: "INFO",
    msg: `Sending ${args.kind} email`,
    clientId: args.clientId,
    partnerId: args.partnerId,
    email: args.to,
  });

  const suppression = await db.suppressions.findByEmail(args.to);
  if (suppression) {
    await appendLog({
      level: "WARN",
      msg: "Skipping email: recipient opted out",
      clientId: args.clientId,
      email: args.to,
    });
    return;
  }

  const result = await fakeMailAdapter.send({ to: args.to });
  await appendLog({
    level: "INFO",
    msg: "Email sent",
    provider: "fakemail",
    status: result.status,
    email: args.to,
  });
}
