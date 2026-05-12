import { db } from "@/lib/db";
import NewPromoForm from "./NewPromoForm";

export default async function NewPromoPage() {
  const offerings = await db.offerings.all();
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">New promo code</h1>
      <NewPromoForm offerings={offerings} />
    </div>
  );
}
