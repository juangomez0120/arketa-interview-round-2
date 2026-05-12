"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Offering } from "@/lib/types";

export default function NewPromoForm({ offerings }: { offerings: Offering[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [appliesTo, setAppliesTo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleOffering(id: string) {
    setAppliesTo((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/promos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        discountPercent: Number(discountPercent),
        appliesTo,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Failed to create promo");
      return;
    }
    router.push("/promos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5 bg-white border border-zinc-200 rounded p-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Code</label>
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded font-mono uppercase"
          placeholder="SUMMER25"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Discount percent</label>
        <input
          required
          type="number"
          min={0}
          max={100}
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          className="mt-1 w-32 px-3 py-2 border border-zinc-300 rounded"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-zinc-700">Applies to</legend>
        <div className="mt-2 space-y-2">
          {offerings.map((o) => (
            <label key={o.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={appliesTo.includes(o.id)}
                onChange={() => toggleOffering(o.id)}
              />
              <span>{o.name}</span>
              <span className="text-zinc-500">— {o.id}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
