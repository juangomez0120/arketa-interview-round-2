import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";

export default async function PromosPage() {
  const [promos, offerings] = await Promise.all([db.promos.all(), db.offerings.all()]);
  const offeringName = (id: string) => offerings.find((o) => o.id === id)?.name ?? id;

  return (
    <div>
      <PageHero
        title="Promo codes"
        description="Discounts and what they apply to."
        actions={
          <Button asChild>
            <Link href="/promos/new">
              <Plus /> New code
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Applies to</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.map((p) => (
              <TableRow key={p.code}>
                <TableCell className="font-mono font-medium">{p.code}</TableCell>
                <TableCell className="text-muted-foreground">
                  {p.discountPercent}% off
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {p.appliesTo.map((id) => (
                      <Badge key={id} variant="outline">
                        {offeringName(id)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {promos.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  No promo codes yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
