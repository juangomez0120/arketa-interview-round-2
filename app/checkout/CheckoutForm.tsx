"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Cart, Client, Offering, PromoCode } from "@/lib/types";

type Quote = {
  cart: Cart;
  subtotal: number;
  discount: number;
  total: number;
  matched: boolean;
};

const NO_PROMO = "__none";

function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatType(type: Offering["type"]): string {
  return type === "classPack" ? "Class pack" : "Drop-in";
}

export default function CheckoutForm({
  clients,
  offerings,
  promos,
}: {
  clients: Client[];
  offerings: Offering[];
  promos: PromoCode[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [offeringId, setOfferingId] = useState(offerings[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState(NO_PROMO);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ chargeId: string; total: number } | null>(
    null,
  );

  const offering = offerings.find((o) => o.id === offeringId) ?? null;
  const client = clients.find((c) => c.id === clientId) ?? null;
  const selectedPromo =
    promoCode === NO_PROMO ? null : promos.find((p) => p.code === promoCode) ?? null;

  useEffect(() => {
    if (!clientId || !offeringId) return;
    const controller = new AbortController();
    setLoadingQuote(true);
    (async () => {
      setError(null);
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clientId,
          offeringId,
          quantity,
          promoCode: promoCode === NO_PROMO ? undefined : promoCode,
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setError("Failed to load quote");
        setLoadingQuote(false);
        return;
      }
      const data = (await res.json()) as Quote;
      setQuote(data);
      setLoadingQuote(false);
    })().catch(() => {
      /* aborted */
    });
    return () => controller.abort();
  }, [clientId, offeringId, promoCode, quantity]);

  async function onConfirm() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/checkout/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        clientId,
        offeringId,
        quantity,
        promoCode: promoCode === NO_PROMO ? undefined : promoCode,
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
      <Card className="p-7">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5" strokeWidth={1.7} />
          <div className="font-display text-2xl">Charge created</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {client?.name ?? "The client"} has been charged.
        </p>
        <dl className="mt-5 text-sm divide-y divide-border">
          <div className="flex justify-between py-2.5">
            <dt className="text-muted-foreground">Charge ID</dt>
            <dd className="font-mono text-xs">{confirmation.chargeId}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-muted-foreground">Total charged</dt>
            <dd className="font-mono font-medium">{money(confirmation.total)}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setConfirmation(null);
              setPromoCode(NO_PROMO);
              setQuantity(1);
            }}
          >
            Start another
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3 p-7 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex flex-col">
                    <span>{c.name}</span>
                    <span className="text-[11px] text-muted-foreground">{c.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offering">Offering</Label>
          <Select value={offeringId} onValueChange={setOfferingId}>
            <SelectTrigger id="offering">
              <SelectValue placeholder="Choose an offering" />
            </SelectTrigger>
            <SelectContent>
              {offerings.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}{" "}
                  <span className="text-muted-foreground">— {money(o.price)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-28"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo">Promo code</Label>
            <Select value={promoCode} onValueChange={setPromoCode}>
              <SelectTrigger id="promo" className="font-mono">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PROMO}>
                  <span className="text-muted-foreground">— no promo —</span>
                </SelectItem>
                {promos.map((p) => (
                  <SelectItem key={p.code} value={p.code}>
                    <span className="font-mono">{p.code}</span>{" "}
                    <span className="text-muted-foreground">
                      — {p.discountPercent}% off
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedPromo && quote && !quote.matched && (
          <div className="flex items-start gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2.5 text-sm">
            <AlertCircle className="size-4 mt-0.5" strokeWidth={1.7} />
            <div>
              <div className="font-medium">
                {selectedPromo.code} doesn&apos;t apply to {offering?.name ?? "this offering"}.
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Pick a different offering or remove the promo to continue at full price.
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="lg:col-span-2 p-7 flex flex-col">
        <div className="eyebrow">Order summary</div>
        <div className="mt-1 font-display text-2xl">{offering?.name ?? "—"}</div>
        {offering && (
          <div className="mt-1 text-xs text-muted-foreground">
            {formatType(offering.type)} · {money(offering.price)} each
          </div>
        )}

        <div className="mt-5 border-t border-border" />

        {quote ? (
          <>
            <ul className="mt-4 text-sm space-y-1.5 max-h-40 overflow-auto pr-1">
              {quote.cart.products.map((p, i) => (
                <li key={i} className="flex justify-between items-baseline">
                  <span>{formatType(p.type)}</span>
                  <span className="font-mono text-xs">{money(p.price)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="font-mono text-foreground">{money(quote.subtotal)}</dd>
              </div>
              {quote.discount > 0 && (
                <div className="flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    Discount
                    {selectedPromo && (
                      <Badge variant="secondary" className="px-1.5 py-0">
                        {selectedPromo.code}
                      </Badge>
                    )}
                  </dt>
                  <dd className="font-mono">−{money(quote.discount)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-4 pt-4 border-t border-border flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-mono text-lg font-medium">{money(quote.total)}</span>
            </div>
          </>
        ) : (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading quote…
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={onConfirm}
          disabled={submitting || !clientId || !offeringId || !quote || loadingQuote}
          size="lg"
          className="mt-6 w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" /> Charging…
            </>
          ) : (
            "Confirm charge"
          )}
        </Button>
      </Card>
    </div>
  );
}
