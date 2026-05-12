"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Sparkles,
  TicketPercent,
  Receipt,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/offerings", label: "Offerings", icon: Sparkles },
  { href: "/promos", label: "Promo codes", icon: TicketPercent },
  { href: "/charges", label: "Charges", icon: Receipt },
  { href: "/checkout", label: "Checkout", icon: ShoppingBag },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="px-3 space-y-0.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-white/[0.07] text-sidebar-foreground"
                : "text-sidebar-foreground/65 hover:bg-white/[0.04] hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-[15px]" strokeWidth={1.6} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
