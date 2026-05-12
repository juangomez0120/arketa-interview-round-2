import { db } from "./db";
import type { Cart, CartProduct } from "./types";

export async function buildCart(input: {
  clientId: string;
  offeringId: string;
  quantity?: number;
}): Promise<Cart> {
  const offering = await db.offerings.findById(input.offeringId);
  if (!offering) throw new Error(`Offering ${input.offeringId} not found`);

  const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
  const products: CartProduct[] = [];
  for (let i = 0; i < quantity; i++) {
    products.push({ productId: offering.id, type: offering.type, price: offering.price });
  }

  return { products };
}
