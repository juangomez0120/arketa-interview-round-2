import Link from "next/link";
import { db } from "@/lib/db";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function typeLabel(type: "class" | "classPack"): string {
  return type === "classPack" ? "Class Pack" : "Class";
}

export default async function ChargesPage() {
  const [charges, clients] = await Promise.all([db.charges.all(), db.clients.all()]);
  const clientLookup = new Map(clients.map((c) => [c.id, c]));

  const sorted = [...charges].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Charges</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Order history with applied promo codes.
      </p>

      <div className="mt-6 space-y-4">
        {sorted.map((charge) => {
          const client = clientLookup.get(charge.clientId);
          return (
            <div key={charge.id} className="bg-white border border-zinc-200 rounded p-5">
              <div className="flex items-start justify-between">
                <div>
                  {client ? (
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {client.name}
                    </Link>
                  ) : (
                    <div className="text-sm font-medium">{charge.clientId}</div>
                  )}
                  <div className="font-mono text-xs text-zinc-500">{charge.id}</div>
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(charge.createdAt).toLocaleString()}
                </div>
              </div>

              <ul className="mt-4 text-sm border-t border-zinc-100 pt-3 space-y-1">
                {charge.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {typeLabel(item.type)}
                      {item.parentProductId ? " (covered by pack)" : ""}
                    </span>
                    <span>{money(item.price)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-3 text-sm space-y-1 border-t border-zinc-100 pt-3">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Subtotal</dt>
                  <dd>{money(charge.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">
                    Discount{charge.promoCode ? ` (${charge.promoCode})` : ""}
                  </dt>
                  <dd>-{money(charge.discount)}</dd>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-1 mt-1 font-medium">
                  <dt>Total</dt>
                  <dd>{money(charge.total)}</dd>
                </div>
              </dl>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="text-sm text-zinc-500 bg-white border border-zinc-200 rounded p-5">
            No charges yet.
          </div>
        )}
      </div>
    </div>
  );
}
