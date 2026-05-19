export type Partner = {
  id: string;
  name: string;
};

export type Client = {
  id: string;
  partnerId: string;
  name: string;
  email: string;
  createdAt: string;
};

export type OfferingType = "class" | "classPack";

export type Offering = {
  id: string;
  partnerId: string;
  name: string;
  type: OfferingType;
  price: number;
};

export type PromoCode = {
  code: string;
  partnerId: string;
  discountPercent: number;
  appliesTo: string[];
};

export type CartProduct = {
  productId: string;
  type: OfferingType;
  price: number;
};

export type Cart = {
  products: CartProduct[];
};

export type Charge = {
  id: string;
  partnerId: string;
  clientId: string;
  items: CartProduct[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  createdAt: string;
};

export type Suppression = {
  email: string;
  partnerId: string;
  createdAt: string;
};

export type EmailKind = "confirmation" | "reminder";
