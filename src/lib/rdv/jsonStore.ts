import fs from "node:fs";
import path from "node:path";
import type { RDV } from "@/lib/rdv/types";

type Persisted = {
  prochainID: number;
  items: RDV[];
};

function dataDir() {
  return path.join(process.cwd(), "data");
}

function dbPath() {
  return path.join(dataDir(), "rdv.json");
}

function ensure() {
  const dir = dataDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const p = dbPath();
  if (!fs.existsSync(p)) {
    const init: Persisted = { prochainID: 1, items: [] };
    fs.writeFileSync(p, JSON.stringify(init, null, 2), "utf8");
  }
}

function readAll(): Persisted {
  ensure();
  const raw = fs.readFileSync(dbPath(), "utf8");
  const parsed = JSON.parse(raw) as Persisted;
  if (!parsed || typeof parsed.prochainID !== "number" || !Array.isArray(parsed.items)) {
    return { prochainID: 1, items: [] };
  }
  return parsed;
}

function writeAll(next: Persisted) {
  ensure();
  fs.writeFileSync(dbPath(), JSON.stringify(next, null, 2), "utf8");
}

export function listAllRDV(): RDV[] {
  return readAll().items;
}

export function countRDV() {
  return readAll().items.length;
}

export function getRDVById(id: number): RDV | null {
  const { items } = readAll();
  const found = items.find((x) => x.id === id);
  return found ?? null;
}

export function deleteRDVById(id: number) {
  const db = readAll();
  const before = db.items.length;
  db.items = db.items.filter((x) => x.id !== id);
  const after = db.items.length;
  if (after !== before) writeAll(db);
  return before - after;
}

export function insertRDV(data: Omit<RDV, "id">): RDV {
  const db = readAll();
  const created: RDV = { id: db.prochainID, ...data };
  db.items.push(created);
  db.prochainID += 1;
  writeAll(db);
  return created;
}

export function updateRDV(id: number, patch: Partial<Omit<RDV, "id">>): RDV | null {
  const db = readAll();
  const idx = db.items.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  db.items[idx] = { ...db.items[idx]!, ...patch, id };
  writeAll(db);
  return db.items[idx]!;
}

