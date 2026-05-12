import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function typeLabel(type: "class" | "classPack"): string {
  return type === "classPack" ? "Class Pack" : "Class";
}

const fmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function ChargesPage() {
  const [charges, clients] = await Promise.all([db.charges.all(), db.clients.all()]);
  const clientLookup = new Map(clients.map((c) => [c.id, c]));
  const sorted = [...charges].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PageHero title="Charges" description="Order history." />

      <div className="space-y-4">
        {sorted.map((charge) => {
          const client = clientLookup.get(charge.clientId);
          const uniqueItems = Array.from(
            new Map(charge.items.map((item) => [item.productId, item])).values(),
          );
          return (
            <Card key={charge.id} className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
                <div className="leading-tight">
                  {client ? (
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {client.name}
                    </Link>
                  ) : (
                    <div className="text-sm font-medium">{charge.clientId}</div>
                  )}
                  <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                    {charge.id}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {fmt.format(new Date(charge.createdAt))}
                </div>
              </div>

              <div className="px-6 py-4">
                <ul className="text-sm space-y-1.5">
                  {uniqueItems.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-baseline justify-between"
                    >
                      <span>
                        {typeLabel(item.type)}
                        {item.parentProductId && (
                          <span className="text-muted-foreground"> (covered by pack)</span>
                        )}
                      </span>
                      <span className="font-mono text-xs">{money(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pb-5">
                <div className="divider-rule h-px w-full" />
                <dl className="mt-4 text-sm space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Subtotal</dt>
                    <dd className="font-mono text-foreground">{money(charge.subtotal)}</dd>
                  </div>
                  {charge.promoCode && (
                    <div className="flex justify-between items-center">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <span>Discount</span>
                        <Badge variant="secondary" className="px-1.5 py-0">
                          {charge.promoCode}
                        </Badge>
                      </dt>
                      <dd className="font-mono">−{money(charge.discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between pt-3 border-t border-border">
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-mono font-medium">{money(charge.total)}</dd>
                  </div>
                </dl>
              </div>
            </Card>
          );
        })}
        {sorted.length === 0 && (
          <Card className="p-10 text-center text-sm text-muted-foreground">
            No charges yet.
          </Card>
        )}
      </div>
    </div>
  );
}
