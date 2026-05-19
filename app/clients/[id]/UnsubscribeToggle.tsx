"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function UnsubscribeToggle({
  clientId,
  initialUnsubscribed,
}: {
  clientId: string;
  initialUnsubscribed: boolean;
}) {
  const router = useRouter();
  const [unsubscribed, setUnsubscribed] = useState(initialUnsubscribed);
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  async function onToggle(next: boolean) {
    setSaving(true);
    setUnsubscribed(next);
    const res = await fetch(`/api/clients/${clientId}/unsubscribe`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unsubscribed: next }),
    });
    setSaving(false);
    if (!res.ok) {
      setUnsubscribed(!next);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <Checkbox
        checked={unsubscribed}
        onCheckedChange={(v) => onToggle(v === true)}
        disabled={saving}
        className="mt-0.5"
      />
      <div className="leading-tight">
        <div className="text-sm font-medium">Unsubscribed from emails</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {saving ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Saving…
            </span>
          ) : unsubscribed ? (
            "This client will not receive emails from this studio."
          ) : (
            "This client will receive welcome, confirmation, and reminder emails."
          )}
        </div>
      </div>
    </label>
  );
}
