"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Failed to create client");
      return;
    }
    router.push("/clients");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5 bg-white border border-zinc-200 rounded p-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Email</label>
        <input
          required
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded text-sm"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
