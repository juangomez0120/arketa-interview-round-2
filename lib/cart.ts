import { db } from "./db";
import type { Cart, CartProduct } from "./types";

export async function buildCart(input: {
  clientId: string;
  offeringId: string;
  classId?: string;
}): Promise<Cart> {
  const offering = await db.offerings.findById(input.offeringId);
  if (!offering) throw new Error(`Offering ${input.offeringId} not found`);

  const products: CartProduct[] = [
    { productId: offering.id, type: offering.type, price: offering.price },
  ];

  if (input.classId && offering.type === "classPack") {
    const cls = await db.classes.findById(input.classId);
    if (cls) {
      products.push({
        productId: cls.id,
        type: "class",
        price: 0,
        parentProductId: offering.id,
      });
    }
  }

  return { products };
}
