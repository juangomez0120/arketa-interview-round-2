import { RECIPIENT_PATTERN } from "./format";

type SendArgs = { to: string };
type SendResult = { status: number; messageId: string };

function prepareRecipient(rawAddress: string): string {
  const address = rawAddress.trim();
  const atIndex = address.lastIndexOf("@");
  if (atIndex < 1 || atIndex === address.length - 1) {
    throw new Error("550 5.1.1 mailbox unavailable");
  }
  const local = address.slice(0, atIndex);
  const domain = address.slice(atIndex + 1).toLowerCase();
  const recipient = `${local}@${domain}`;
  if (!RECIPIENT_PATTERN.test(recipient)) {
    throw new Error("550 5.1.1 mailbox unavailable");
  }
  return recipient;
}

function newMessageId(): string {
  return `fm_${Math.random().toString(36).slice(2, 10)}`;
}

const SIMULATE_TRANSIENT_FAILURES = false;

async function deliverToProvider(args: { to: string; messageId: string }): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 3000));
  if (SIMULATE_TRANSIENT_FAILURES && Math.random() < 0.05) {
    throw new Error("upstream provider unavailable");
  }
}

export const fakeMailAdapter = {
  async send(args: SendArgs): Promise<SendResult> {
    try {
      const recipient = prepareRecipient(args.to);
      const messageId = newMessageId();
      await deliverToProvider({ to: recipient, messageId });
      return { status: 200, messageId };
    } catch {
      throw new Error("Email could not be delivered");
    }
  },
};
