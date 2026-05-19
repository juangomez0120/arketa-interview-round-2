import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import { PageHero } from "@/components/page-hero";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const partnerId = await getCurrentPartnerId();
  const [clients, offerings, promos] = await Promise.all([
    db.clients.all(partnerId),
    db.offerings.all(partnerId),
    db.promos.all(partnerId),
  ]);

  return (
    <div>
      <PageHero title="Checkout" description="Sell an offering to a client." />
      <CheckoutForm clients={clients} offerings={offerings} promos={promos} />
    </div>
  );
}
