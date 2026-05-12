import { db } from "@/lib/db";

function startOfWeekIso(): string {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function DashboardPage() {
  const [clients, offerings, promos, charges] = await Promise.all([
    db.clients.all(),
    db.offerings.all(),
    db.promos.all(),
    db.charges.all(),
  ]);

  const weekStart = startOfWeekIso();
  const chargesThisWeek = charges.filter((c) => c.createdAt >= weekStart).length;

  const cards = [
    { label: "Clients", value: clients.length },
    { label: "Offerings", value: offerings.length },
    { label: "Active promos", value: promos.length },
    { label: "Charges this week", value: chargesThisWeek },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">Sutra Studio at a glance.</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-zinc-200 rounded p-5">
            <div className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</div>
            <div className="mt-2 text-2xl font-semibold">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
