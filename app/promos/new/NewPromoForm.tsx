"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Offering } from "@/lib/types";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function NewPromoForm({ offerings }: { offerings: Offering[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [appliesTo, setAppliesTo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleOffering(id: string) {
    setAppliesTo((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
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
    <Card className="p-7">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-5">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono uppercase"
              placeholder="SUMMER25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <div className="relative">
              <Input
                id="discount"
                required
                type="number"
                min={0}
                max={100}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>

        <fieldset className="space-y-2">
          <Label asChild>
            <legend>Applies to</legend>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {offerings.map((o) => {
              const checked = appliesTo.includes(o.id);
              return (
                <label
                  key={o.id}
                  className={cn(
                    "flex items-start gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors",
                    checked
                      ? "border-foreground/40 bg-secondary/50"
                      : "border-border hover:bg-secondary/30",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleOffering(o.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 leading-tight">
                    <div className="text-sm font-medium">{o.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {money(o.price)}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-1">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Saving
              </>
            ) : (
              "Save promo"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
