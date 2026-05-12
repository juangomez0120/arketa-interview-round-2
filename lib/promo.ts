import type { Cart, PromoCode } from "./types";

export type PromoResult = {
  subtotal: number;
  discount: number;
  total: number;
  matched: boolean;
};

export function applyPromo(cart: Cart, promo: PromoCode | null): PromoResult {
  const subtotal = cart.products.reduce((sum, p) => sum + p.price, 0);
  if (!promo) return { subtotal, discount: 0, total: subtotal, matched: false };

  const matched = cart.products.some((p) => promo.appliesTo.includes(p.productId));
  if (!matched) return { subtotal, discount: 0, total: subtotal, matched: false };

  const discount = Math.round(subtotal * (promo.discountPercent / 100));
  return { subtotal, discount, total: subtotal - discount, matched: true };
}
