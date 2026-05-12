import { db } from "@/lib/db";
import { PageHero } from "@/components/page-hero";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const [clients, offerings, promos] = await Promise.all([
    db.clients.all(),
    db.offerings.all(),
    db.promos.all(),
  ]);

  return (
    <div>
      <PageHero title="Checkout" description="Sell an offering to a client." />
      <CheckoutForm clients={clients} offerings={offerings} promos={promos} />
    </div>
  );
}
