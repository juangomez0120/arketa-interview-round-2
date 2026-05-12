import fs from "node:fs/promises";
import path from "node:path";
import type { EmailKind } from "../types";

const LOG_PATH = path.join(process.cwd(), "logs.txt");

export async function appendLog(line: object): Promise<void> {
  const entry = `${new Date().toISOString()} ${JSON.stringify(line)}\n`;
  await fs.appendFile(LOG_PATH, entry);
}

function prepareRecipient(rawAddress: string): string {
  const address = rawAddress.trim();
  const atIndex = address.lastIndexOf("@");
  if (atIndex < 1 || atIndex === address.length - 1) {
    throw new Error("550 5.1.1 mailbox unavailable");
  }
  const local = address.slice(0, atIndex);
  const domain = address.slice(atIndex + 1).toLowerCase();
  const recipient = `${local}@${domain}`;
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(recipient)) {
    throw new Error("550 5.1.1 mailbox unavailable");
  }
  return recipient;
}

export async function sendEmail(args: {
  to: string;
  kind: EmailKind;
  clientId: string;
}): Promise<void> {
  await appendLog({
    level: "INFO",
    msg: `Sending ${args.kind} email`,
    clientId: args.clientId,
    email: args.to,
  });
  const recipient = prepareRecipient(args.to);
  await appendLog({
    level: "INFO",
    msg: "Email sent",
    provider: "fakemail",
    status: 200,
    email: recipient,
  });
}
