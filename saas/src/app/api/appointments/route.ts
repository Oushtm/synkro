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
import { supabase } from "@/lib/supabase";
import type { RDV } from "@/lib/rdv/types";

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
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ items: trierCommeAffichageC(data as RDV[]) });
}

export async function POST(req: Request) {
  const body = AddSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Requete invalide." }, { status: 400 });

  const { count, error: countError } = await supabase.from("appointments").select("*", { count: "exact", head: true });
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

  if ((count || 0) >= MAX_RDV) {
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

  const { data: existing, error: fetchError } = await supabase.from("appointments").select("*");
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  if (
    conflitRendezVous(
      existing as RDV[],
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

  const { data: created, error: insertError } = await supabase.from("appointments").insert({
    jour: body.data.jour,
    mois: body.data.mois,
    annee: body.data.annee,
    heureDebut: body.data.heureDebut,
    minuteDebut: body.data.minuteDebut,
    heureFin: body.data.heureFin,
    minuteFin: body.data.minuteFin,
    lieu,
    categorie,
  }).select().single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ item: created }, { status: 201 });
}

