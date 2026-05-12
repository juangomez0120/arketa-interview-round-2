import Link from "next/link";
import { db } from "@/lib/db";

export default async function ClientsPage() {
  const clients = await db.clients.all();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <Link
          href="/clients/new"
          className="text-sm font-medium px-3 py-2 rounded bg-zinc-900 text-white hover:bg-zinc-700"
        >
          New client
        </Link>
      </div>

      <div className="mt-6 bg-white border border-zinc-200 rounded">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-500 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-600">{c.email}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/clients/${c.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View →
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
