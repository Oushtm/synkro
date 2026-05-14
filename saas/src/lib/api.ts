import type { RDV } from "@/lib/rdv/types";

export type ApiError = { error: string };

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data && typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export async function apiListAppointments(): Promise<RDV[]> {
  const res = await fetch("/api/appointments", { cache: "no-store" });
  const data = await parseJson<{ items: RDV[] }>(res);
  return data.items;
}

export async function apiAddAppointment(input: Omit<RDV, "id">): Promise<RDV> {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ item: RDV }>(res);
  return data.item;
}

export async function apiDeleteAppointment(id: number): Promise<void> {
  const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
  await parseJson<{ ok: true }>(res);
}

export type ModifyMode = "date" | "heureDebut" | "heureFin" | "lieu" | "categorie";

export async function apiModifyAppointment(
  id: number,
  payload: { mode: ModifyMode } & Partial<Omit<RDV, "id">> & { categorie?: string },
): Promise<RDV> {
  const res = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson<{ item: RDV }>(res);
  return data.item;
}

export async function apiSearch(params: Record<string, string | number | undefined>): Promise<RDV[]> {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }
  const res = await fetch(`/api/search?${sp.toString()}`, { cache: "no-store" });
  const data = await parseJson<{ items: RDV[] }>(res);
  return data.items;
}

