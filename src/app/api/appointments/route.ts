import { NextResponse } from "next/server";
import { z } from "zod";
import {
  MAX_RDV,
  categorieValide,
  conflitRendezVous,
  dateValide,
  periodeValide,
  texteValideCommeCScanFPercentS,
  tronquerCommeBufferC,
  tokenSansEspacesCommeScanfPercentS,
  trierCommeAffichageC,
} from "@/lib/rdv/engine";
import { countRDV, insertRDV, listAllRDV } from "@/lib/rdv/jsonStore";

export const runtime = "nodejs";

const AddSchema = z.object({
  jour: z.number().int().min(1).max(31),
  mois: z.number().int().min(1).max(12),
  annee: z.number().int().min(1900).max(2100),
  heureDebut: z.number().int().min(0).max(23),
  minuteDebut: z.number().int().min(0).max(59),
  heureFin: z.number().int().min(0).max(23),
  minuteFin: z.number().int().min(0).max(59),
  lieu: z.string(),
  categorie: z.string(),
});

export async function GET() {
  const all = listAllRDV();
  return NextResponse.json({ items: trierCommeAffichageC(all) });
}

export async function POST(req: Request) {
  const body = AddSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Requete invalide." }, { status: 400 });

  if (countRDV() >= MAX_RDV) {
    return NextResponse.json({ error: "Le tableau des rendez-vous est plein." }, { status: 409 });
  }

  const lieu = tronquerCommeBufferC(body.data.lieu);
  const categorie = tokenSansEspacesCommeScanfPercentS(body.data.categorie);

  if (dateValide(body.data.jour, body.data.mois, body.data.annee) === 0) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  if (texteValideCommeCScanFPercentS(lieu) === 0) {
    return NextResponse.json({ error: "Lieu invalide." }, { status: 400 });
  }

  if (!categorieValide(categorie)) {
    return NextResponse.json({ error: "Categorie invalide." }, { status: 400 });
  }

  if (periodeValide(body.data.heureDebut, body.data.minuteDebut, body.data.heureFin, body.data.minuteFin) === 0) {
    return NextResponse.json(
      { error: "Periode invalide : l'heure de debut doit etre avant l'heure de fin." },
      { status: 409 },
    );
  }

  const existing = listAllRDV();
  if (
    conflitRendezVous(
      existing,
      body.data.jour,
      body.data.mois,
      body.data.annee,
      body.data.heureDebut,
      body.data.minuteDebut,
      body.data.heureFin,
      body.data.minuteFin,
      null,
    ) === 1
  ) {
    return NextResponse.json(
      { error: "Conflit horaire : ce rendez-vous chevauche un autre rendez-vous." },
      { status: 409 },
    );
  }

  const created = insertRDV({
    jour: body.data.jour,
    mois: body.data.mois,
    annee: body.data.annee,
    heureDebut: body.data.heureDebut,
    minuteDebut: body.data.minuteDebut,
    heureFin: body.data.heureFin,
    minuteFin: body.data.minuteFin,
    lieu,
    categorie,
  });

  return NextResponse.json({ item: created }, { status: 201 });
}

