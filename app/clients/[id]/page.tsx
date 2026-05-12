import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";

const fmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await db.clients.findById(id);
  if (!client) notFound();

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/clients">
            <ArrowLeft /> All clients
          </Link>
        </Button>
      </div>

      <PageHero title={client.name} description="Client profile." />

      <Card className="p-6">
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="eyebrow">Client ID</dt>
            <dd className="mt-1.5 font-mono">{client.id}</dd>
          </div>
          <div>
            <dt className="eyebrow">Email</dt>
            <dd className="mt-1.5">{client.email}</dd>
          </div>
          <div>
            <dt className="eyebrow">Joined</dt>
            <dd className="mt-1.5">{fmt.format(new Date(client.createdAt))}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
