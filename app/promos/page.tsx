import Link from "next/link";
import { db } from "@/lib/db";

export default async function PromosPage() {
  const [promos, offerings] = await Promise.all([db.promos.all(), db.offerings.all()]);
  const offeringName = (id: string) => offerings.find((o) => o.id === id)?.name ?? id;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Promo codes</h1>
        <Link
          href="/promos/new"
          className="text-sm font-medium px-3 py-2 rounded bg-zinc-900 text-white hover:bg-zinc-700"
        >
          New
        </Link>
      </div>

      <div className="mt-6 bg-white border border-zinc-200 rounded">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-500 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Applies to</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.code} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-mono font-medium">{p.code}</td>
                <td className="px-4 py-3 text-zinc-600">{p.discountPercent}%</td>
                <td className="px-4 py-3 text-zinc-600">
                  {p.appliesTo.map(offeringName).join(", ")}
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-zinc-500">
                  No promo codes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
