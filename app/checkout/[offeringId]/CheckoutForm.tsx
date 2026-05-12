"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Cart, ClassInstance, Client, Offering } from "@/lib/types";

type Quote = {
  cart: Cart;
  subtotal: number;
  discount: number;
  total: number;
  matched: boolean;
};

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CheckoutForm({
  offering,
  clients,
  classes,
}: {
  offering: Offering;
  clients: Client[];
  classes: ClassInstance[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [classId, setClassId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ chargeId: string; total: number } | null>(
    null,
  );

  useEffect(() => {
    if (!clientId) return;
    const controller = new AbortController();
    (async () => {
      setError(null);
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientId,
          offeringId: offering.id,
          classId: classId || undefined,
          quantity,
          promoCode: promoCode.trim() || undefined,
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setError("Failed to load quote");
        return;
      }
      const data = (await res.json()) as Quote;
      setQuote(data);
    })().catch(() => {
      /* aborted */
    });
    return () => controller.abort();
  }, [clientId, classId, promoCode, quantity, offering.id]);

  async function onConfirm() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/checkout/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        clientId,
        offeringId: offering.id,
        classId: classId || undefined,
        quantity,
        promoCode: promoCode.trim() || undefined,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError("Failed to submit charge");
      return;
    }
    const data = (await res.json()) as { chargeId: string; total: number };
    setConfirmation(data);
    router.refresh();
  }

  if (confirmation) {
    return (
      <div className="mt-6 bg-white border border-zinc-200 rounded p-5">
        <div className="text-base font-medium">Charge created</div>
        <dl className="mt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Charge ID</dt>
            <dd className="font-mono">{confirmation.chargeId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Total charged</dt>
            <dd className="font-medium">{money(confirmation.total)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5 bg-white border border-zinc-200 rounded p-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Client</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded text-sm"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>

      {offering.type === "classPack" && (
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Book a class with this pack (optional)
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded text-sm"
          >
            <option value="">— don&apos;t book a class now —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {new Date(c.startsAt).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700">Quantity</label>
        <input
          type="number"
          min={1}
          max={20}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          className="mt-1 w-24 px-3 py-2 border border-zinc-300 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Promo code</label>
        <input
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          className="mt-1 w-48 px-3 py-2 border border-zinc-300 rounded font-mono text-sm"
          placeholder="OPTIONAL"
        />
      </div>

      {quote && (
        <div className="border-t border-zinc-200 pt-4">
          <ul className="text-sm space-y-1 mb-3">
            {quote.cart.products.map((p, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {p.type === "classPack" ? "Class Pack" : "Class"}
                  {p.parentProductId ? " (covered by pack)" : ""}
                </span>
                <span>{money(p.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Subtotal</dt>
              <dd>{money(quote.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Discount</dt>
              <dd>-{money(quote.discount)}</dd>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-1 mt-1 font-medium">
              <dt>Total</dt>
              <dd>{money(quote.total)}</dd>
            </div>
          </dl>
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        onClick={onConfirm}
        disabled={submitting || !clientId}
        className="px-4 py-2 rounded bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Confirm"}
      </button>
    </div>
  );
}
