import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ offeringId: string }>;
}) {
  const { offeringId } = await params;
  const offering = await db.offerings.findById(offeringId);
  if (!offering) notFound();

  const [clients, classes] = await Promise.all([
    db.clients.all(),
    offering.type === "classPack" ? db.classes.all() : Promise.resolve([]),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Selling <span className="font-medium">{offering.name}</span> (
        {offering.type === "classPack" ? "Class Pack" : "Class"})
      </p>
      <CheckoutForm offering={offering} clients={clients} classes={classes} />
    </div>
  );
}
