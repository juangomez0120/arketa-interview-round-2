"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function SendWelcomeButton({ clientId }: { clientId: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onClick() {
    setStatus("sending");
    const res = await fetch("/api/emails/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clientId, kind: "welcome" }),
    });
    setStatus(res.ok ? "ok" : "error");
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={status === "sending"}
        className="px-4 py-2 rounded bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send welcome email"}
      </button>
      {status === "ok" && <span className="text-sm text-green-600">Email sent.</span>}
      {status === "error" && <span className="text-sm text-red-600">Failed to send.</span>}
    </div>
  );
}
