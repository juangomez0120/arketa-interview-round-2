import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import NewPromoForm from "./NewPromoForm";

export default async function NewPromoPage() {
  const partnerId = await getCurrentPartnerId();
  const offerings = await db.offerings.all(partnerId);
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/promos">
            <ArrowLeft /> All promos
          </Link>
        </Button>
      </div>
      <PageHero title="New promo code" />
      <NewPromoForm offerings={offerings} />
    </div>
  );
}
