export type Client = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type OfferingType = "class" | "classPack";

export type Offering = {
  id: string;
  name: string;
  type: OfferingType;
  price: number;
};

export type ClassInstance = {
  id: string;
  name: string;
  offeringId: string;
  startsAt: string;
};

export type PromoCode = {
  code: string;
  discountPercent: number;
  appliesTo: string[];
};

export type CartProduct = {
  productId: string;
  type: OfferingType;
  price: number;
  parentProductId?: string;
};

export type Cart = {
  products: CartProduct[];
};

export type Charge = {
  id: string;
  clientId: string;
  items: CartProduct[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  createdAt: string;
};

export type EmailKind = "welcome" | "confirmation" | "reminder";
