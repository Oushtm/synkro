import { NextResponse } from "next/server";
import { z } from "zod";
import {
  categorieValide,
  comparerDates,
  dateValide,
  tokenSansEspacesCommeScanfPercentS,
  tronquerCommeBufferC,
  trierCommeAffichageC,
} from "@/lib/rdv/engine";
import { listAllRDV } from "@/lib/rdv/jsonStore";

export const runtime = "nodejs";

const QuerySchema = z.object({
  type: z.enum(["id", "date", "heure", "lieu", "categorie", "periode"]),
  id: z.coerce.number().int().optional(),
  jour: z.coerce.number().int().optional(),
  mois: z.coerce.number().int().optional(),
  annee: z.coerce.number().int().optional(),
  heureDebut: z.coerce.number().int().optional(),
  minuteDebut: z.coerce.number().int().optional(),
  lieu: z.string().optional(),
  categorie: z.string().optional(),
  // periode
  j1: z.coerce.number().int().optional(),
  m1: z.coerce.number().int().optional(),
  a1: z.coerce.number().int().optional(),
  j2: z.coerce.number().int().optional(),
  m2: z.coerce.number().int().optional(),
  a2: z.coerce.number().int().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(q);
  if (!parsed.success) return NextResponse.json({ error: "Requete invalide." }, { status: 400 });

  const all = listAllRDV();
  let items = all;

  if (parsed.data.type === "id") {
    const id = parsed.data.id;
    if (typeof id !== "number") return NextResponse.json({ error: "ID invalide." }, { status: 400 });
    items = all.filter((x) => x.id === id);
  }

  if (parsed.data.type === "date") {
    const { jour, mois, annee } = parsed.data;
    if ([jour, mois, annee].some((v) => typeof v !== "number"))
      return NextResponse.json({ error: "Date invalide." }, { status: 400 });
    if (dateValide(jour!, mois!, annee!) === 0) return NextResponse.json({ error: "Date invalide." }, { status: 400 });
    items = all.filter((x) => x.jour === jour && x.mois === mois && x.annee === annee);
  }

  if (parsed.data.type === "heure") {
    const { heureDebut, minuteDebut } = parsed.data;
    if ([heureDebut, minuteDebut].some((v) => typeof v !== "number"))
      return NextResponse.json({ error: "Heure invalide." }, { status: 400 });
    if (heureDebut! < 0 || heureDebut! > 23 || minuteDebut! < 0 || minuteDebut! > 59)
      return NextResponse.json({ error: "Heure invalide." }, { status: 400 });
    items = all.filter((x) => x.heureDebut === heureDebut && x.minuteDebut === minuteDebut);
  }

  if (parsed.data.type === "lieu") {
    const lieu = tronquerCommeBufferC(parsed.data.lieu ?? "");
    if (!lieu) return NextResponse.json({ error: "Lieu invalide." }, { status: 400 });
    items = all.filter((x) => x.lieu === lieu);
  }

  if (parsed.data.type === "categorie") {
    const categorie = tokenSansEspacesCommeScanfPercentS(parsed.data.categorie ?? "");
    if (!categorieValide(categorie)) return NextResponse.json({ error: "Categorie invalide." }, { status: 400 });
    items = all.filter((x) => x.categorie === categorie);
  }

  if (parsed.data.type === "periode") {
    const { j1, m1, a1, j2, m2, a2 } = parsed.data;
    if ([j1, m1, a1, j2, m2, a2].some((v) => typeof v !== "number"))
      return NextResponse.json({ error: "Periode invalide." }, { status: 400 });
    if (dateValide(j1!, m1!, a1!) === 0 || dateValide(j2!, m2!, a2!) === 0)
      return NextResponse.json({ error: "Periode invalide." }, { status: 400 });
    if (comparerDates(j1!, m1!, a1!, j2!, m2!, a2!) === 1) {
      return NextResponse.json(
        { error: "Periode invalide : la date de debut doit etre avant ou egale a la date de fin." },
        { status: 409 },
      );
    }

    items = all.filter(
      (x) =>
        comparerDates(x.jour, x.mois, x.annee, j1!, m1!, a1!) !== -1 &&
        comparerDates(x.jour, x.mois, x.annee, j2!, m2!, a2!) !== 1,
    );
  }

  return NextResponse.json({ items: trierCommeAffichageC(items) });
}

