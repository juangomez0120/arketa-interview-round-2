import Link from "next/link";
import { db } from "@/lib/db";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatType(type: "class" | "classPack"): string {
  return type === "classPack" ? "Class Pack" : "Class";
}

export default async function OfferingsPage() {
  const offerings = await db.offerings.all();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Offerings</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Things the studio sells. Click &quot;Sell to client&quot; to start a checkout.
      </p>

      <div className="mt-6 bg-white border border-zinc-200 rounded">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-500 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {offerings.map((o) => (
              <tr key={o.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3 text-zinc-600">{formatType(o.type)}</td>
                <td className="px-4 py-3 text-zinc-600">{formatPrice(o.price)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/checkout/${o.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Sell to client →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
