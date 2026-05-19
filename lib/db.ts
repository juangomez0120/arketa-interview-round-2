import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  Charge,
  Client,
  Offering,
  Partner,
  PromoCode,
  Suppression,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  const target = path.join(DATA_DIR, file);
  await fs.writeFile(target, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export const db = {
  partners: {
    async all(): Promise<Partner[]> {
      return readJson<Partner[]>("partners.json");
    },
    async findById(id: string): Promise<Partner | null> {
      const rows = await this.all();
      return rows.find((p) => p.id === id) ?? null;
    },
  },

  clients: {
    async all(partnerId: string): Promise<Client[]> {
      const rows = await readJson<Client[]>("clients.json");
      return rows.filter((c) => c.partnerId === partnerId);
    },
    async findById(id: string, partnerId: string): Promise<Client | null> {
      const rows = await readJson<Client[]>("clients.json");
      const row = rows.find((c) => c.id === id) ?? null;
      if (!row || row.partnerId !== partnerId) return null;
      return row;
    },
    async create(input: {
      name: string;
      email: string;
      partnerId: string;
    }): Promise<Client> {
      const rows = await readJson<Client[]>("clients.json");
      const client: Client = {
        id: `c_${randomUUID().slice(0, 8)}`,
        partnerId: input.partnerId,
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      };
      rows.push(client);
      await writeJson("clients.json", rows);
      return client;
    },
  },

  offerings: {
    async all(partnerId: string): Promise<Offering[]> {
      const rows = await readJson<Offering[]>("offerings.json");
      return rows.filter((o) => o.partnerId === partnerId);
    },
    async findById(id: string, partnerId: string): Promise<Offering | null> {
      const rows = await readJson<Offering[]>("offerings.json");
      const row = rows.find((o) => o.id === id) ?? null;
      if (!row || row.partnerId !== partnerId) return null;
      return row;
    },
  },

  promos: {
    async all(partnerId: string): Promise<PromoCode[]> {
      const rows = await readJson<PromoCode[]>("promos.json");
      return rows.filter((p) => p.partnerId === partnerId);
    },
    async findByCode(code: string, partnerId: string): Promise<PromoCode | null> {
      const rows = await readJson<PromoCode[]>("promos.json");
      const row = rows.find((p) => p.code === code) ?? null;
      if (!row || row.partnerId !== partnerId) return null;
      return row;
    },
    async create(input: PromoCode): Promise<PromoCode> {
      const rows = await readJson<PromoCode[]>("promos.json");
      rows.push(input);
      await writeJson("promos.json", rows);
      return input;
    },
    async update(
      code: string,
      partnerId: string,
      patch: Partial<PromoCode>,
    ): Promise<PromoCode | null> {
      const rows = await readJson<PromoCode[]>("promos.json");
      const idx = rows.findIndex((p) => p.code === code && p.partnerId === partnerId);
      if (idx < 0) return null;
      rows[idx] = { ...rows[idx], ...patch };
      await writeJson("promos.json", rows);
      return rows[idx];
    },
  },

  charges: {
    async all(partnerId: string): Promise<Charge[]> {
      const rows = await readJson<Charge[]>("charges.json");
      return rows.filter((c) => c.partnerId === partnerId);
    },
    async create(input: Omit<Charge, "id">): Promise<Charge> {
      const rows = await readJson<Charge[]>("charges.json");
      const charge: Charge = { id: `chg_${randomUUID().slice(0, 10)}`, ...input };
      rows.push(charge);
      await writeJson("charges.json", rows);
      return charge;
    },
  },

  suppressions: {
    // Partner-aware lookup — used by the opt-out toggle to decide initial state.
    async findByEmailAndPartner(
      email: string,
      partnerId: string,
    ): Promise<Suppression | null> {
      const rows = await readJson<Suppression[]>("suppressions.json");
      return (
        rows.find((s) => s.email === email && s.partnerId === partnerId) ?? null
      );
    },
    // Email-only lookup — used by sendEmail before delivery. Ignores partnerId.
    async findByEmail(email: string): Promise<Suppression | null> {
      const rows = await readJson<Suppression[]>("suppressions.json");
      return rows.find((s) => s.email === email) ?? null;
    },
    async add(input: { email: string; partnerId: string }): Promise<Suppression> {
      const rows = await readJson<Suppression[]>("suppressions.json");
      const existing = rows.find(
        (s) => s.email === input.email && s.partnerId === input.partnerId,
      );
      if (existing) return existing;
      const row: Suppression = {
        email: input.email,
        partnerId: input.partnerId,
        createdAt: new Date().toISOString(),
      };
      rows.push(row);
      await writeJson("suppressions.json", rows);
      return row;
    },
    async remove(input: { email: string; partnerId: string }): Promise<void> {
      const rows = await readJson<Suppression[]>("suppressions.json");
      const next = rows.filter(
        (s) => !(s.email === input.email && s.partnerId === input.partnerId),
      );
      await writeJson("suppressions.json", next);
    },
  },
};
