import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { db } from "@/lib/db";
import NewPromoForm from "./NewPromoForm";

export default async function NewPromoPage() {
  const offerings = await db.offerings.all();
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
