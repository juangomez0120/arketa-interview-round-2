"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Partner } from "@/lib/types";

export function PartnerSwitcher({
  partners,
  currentPartnerId,
}: {
  partners: Partner[];
  currentPartnerId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function onChange(partnerId: string) {
    if (partnerId === currentPartnerId) return;
    await fetch("/api/auth/switch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ partnerId }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="px-3 pb-3">
      <Select value={currentPartnerId} onValueChange={onChange} disabled={pending}>
        <SelectTrigger className="h-9 bg-white/[0.04] border-white/10 text-sidebar-foreground/90 text-[13px]">
          <span className="flex items-center gap-2 truncate">
            <Building2 className="size-[14px] opacity-70" strokeWidth={1.6} />
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          {partners.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
