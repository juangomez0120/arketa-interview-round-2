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
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(recipient)) {
    throw new Error("550 5.1.1 mailbox unavailable");
  }
  return recipient;
}

function newMessageId(): string {
  return `fm_${Math.random().toString(36).slice(2, 10)}`;
}

export const fakemailClient = {
  async send(args: SendArgs): Promise<SendResult> {
    try {
      prepareRecipient(args.to);
      return { status: 200, messageId: newMessageId() };
    } catch {
      throw new Error("Email could not be delivered");
    }
  },
};
