import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import UnsubscribeToggle from "./UnsubscribeToggle";

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
  const partnerId = await getCurrentPartnerId();
  const client = await db.clients.findById(id, partnerId);
  if (!client) notFound();

  const suppression = await db.suppressions.findByEmailAndPartner(
    client.email,
    partnerId,
  );
  const unsubscribed = suppression !== null;

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

      <Card className="p-6 mt-4">
        <div className="eyebrow mb-3">Email subscription</div>
        <UnsubscribeToggle
          clientId={client.id}
          initialUnsubscribed={unsubscribed}
        />
      </Card>
    </div>
  );
}
