import { cookies } from "next/headers";
import { db } from "./db";
import type { Partner } from "./types";

const COOKIE_NAME = "arketa_partner_id";

export async function getCurrentPartnerId(): Promise<string> {
  const store = await cookies();
  const fromCookie = store.get(COOKIE_NAME)?.value;
  if (fromCookie) {
    const exists = await db.partners.findById(fromCookie);
    if (exists) return exists.id;
  }
  const partners = await db.partners.all();
  return partners[0].id;
}

export async function getCurrentPartner(): Promise<Partner> {
  const id = await getCurrentPartnerId();
  const partner = await db.partners.findById(id);
  if (!partner) throw new Error(`Partner ${id} not found`);
  return partner;
}

export async function setCurrentPartnerId(id: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
