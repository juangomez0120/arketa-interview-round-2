import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Charge, Client, Offering, PromoCode } from "./types";

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
  clients: {
    async all(): Promise<Client[]> {
      return readJson<Client[]>("clients.json");
    },
    async findById(id: string): Promise<Client | null> {
      const rows = await this.all();
      return rows.find((c) => c.id === id) ?? null;
    },
    async create(input: { name: string; email: string }): Promise<Client> {
      const rows = await this.all();
      const client: Client = {
        id: `c_${randomUUID().slice(0, 8)}`,
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
    async all(): Promise<Offering[]> {
      return readJson<Offering[]>("offerings.json");
    },
    async findById(id: string): Promise<Offering | null> {
      const rows = await this.all();
      return rows.find((o) => o.id === id) ?? null;
    },
  },

  promos: {
    async all(): Promise<PromoCode[]> {
      return readJson<PromoCode[]>("promos.json");
    },
    async findByCode(code: string): Promise<PromoCode | null> {
      const rows = await this.all();
      return rows.find((p) => p.code === code) ?? null;
    },
    async create(input: PromoCode): Promise<PromoCode> {
      const rows = await this.all();
      rows.push(input);
      await writeJson("promos.json", rows);
      return input;
    },
    async update(code: string, patch: Partial<PromoCode>): Promise<PromoCode | null> {
      const rows = await this.all();
      const idx = rows.findIndex((p) => p.code === code);
      if (idx < 0) return null;
      rows[idx] = { ...rows[idx], ...patch };
      await writeJson("promos.json", rows);
      return rows[idx];
    },
  },

  charges: {
    async all(): Promise<Charge[]> {
      return readJson<Charge[]>("charges.json");
    },
    async create(input: Omit<Charge, "id">): Promise<Charge> {
      const rows = await this.all();
      const charge: Charge = { id: `chg_${randomUUID().slice(0, 10)}`, ...input };
      rows.push(charge);
      await writeJson("charges.json", rows);
      return charge;
    },
  },
};
