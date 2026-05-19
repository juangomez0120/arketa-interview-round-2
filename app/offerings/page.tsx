import { Badge } from "@/components/ui/badge";
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
import { getCurrentPartnerId } from "@/lib/auth";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function OfferingsPage() {
  const partnerId = await getCurrentPartnerId();
  const offerings = await db.offerings.all(partnerId);

  return (
    <div>
      <PageHero title="Offerings" description="What the studio sells." />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right pr-6">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offerings.map((o) => {
              const isPack = o.type === "classPack";
              return (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {isPack ? "Class pack" : "Drop-in"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 font-mono text-xs">
                    {money(o.price)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
