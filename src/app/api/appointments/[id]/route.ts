import { NextResponse } from "next/server";
import { z } from "zod";
import {
  categorieValide,
  conflitRendezVous,
  dateValide,
  periodeValide,
  texteValideCommeCScanFPercentS,
  tronquerCommeBufferC,
  tokenSansEspacesCommeScanfPercentS,
} from "@/lib/rdv/engine";
import type { RDV } from "@/lib/rdv/types";
import { createSupabaseRouteHandler } from "@/lib/supabase/route-handler";
import { getSessionUser } from "@/lib/supabase/session";

export const runtime = "nodejs";

const ModifySchema = z.object({
  mode: z.enum(["date", "heureDebut", "heureFin", "lieu", "categorie"]),
  jour: z.number().int().min(1).max(31).optional(),
  mois: z.number().int().min(1).max(12).optional(),
  annee: z.number().int().min(1900).max(2100).optional(),
  heureDebut: z.number().int().min(0).max(23).optional(),
  minuteDebut: z.number().int().min(0).max(59).optional(),
  heureFin: z.number().int().min(0).max(23).optional(),
  minuteFin: z.number().int().min(0).max(59).optional(),
  lieu: z.string().optional(),
  categorie: z.string().optional(),
});

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseRouteHandler();
  const user = await getSessionUser(supabase);
  if (!user) return NextResponse.json({ error: "Non authentifie." }, { status: 401 });

  const { id } = await ctx.params;
  const num = Number(id);
  if (!Number.isFinite(num)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });

  const { error } = await supabase.from("appointments").delete().eq("id", num);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseRouteHandler();
  const user = await getSessionUser(supabase);
  if (!user) return NextResponse.json({ error: "Non authentifie." }, { status: 401 });

  const { id } = await ctx.params;
  const num = Number(id);
  if (!Number.isFinite(num)) return NextResponse.json({ error: "ID invalide." }, { status: 400 });

  const { data: existing, error: fetchError } = await supabase.from("appointments").select("*").eq("id", num).single();
  if (fetchError || !existing) return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });

  const body = ModifySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Requete invalide." }, { status: 400 });

  const patch: Partial<Omit<RDV, "id">> = {};
  if (body.data.mode === "date") {
    const jour = body.data.jour ?? existing.jour;
    const mois = body.data.mois ?? existing.mois;
    const annee = body.data.annee ?? existing.annee;
    if (dateValide(jour, mois, annee) === 0) return NextResponse.json({ error: "Date invalide." }, { status: 400 });
    patch.jour = jour;
    patch.mois = mois;
    patch.annee = annee;
  } else if (body.data.mode === "heureDebut") {
    patch.heureDebut = body.data.heureDebut ?? existing.heureDebut;
    patch.minuteDebut = body.data.minuteDebut ?? existing.minuteDebut;
  } else if (body.data.mode === "heureFin") {
    patch.heureFin = body.data.heureFin ?? existing.heureFin;
    patch.minuteFin = body.data.minuteFin ?? existing.minuteFin;
  } else if (body.data.mode === "lieu") {
    const lieu = tronquerCommeBufferC(body.data.lieu ?? existing.lieu);
    if (texteValideCommeCScanFPercentS(lieu) === 0) return NextResponse.json({ error: "Lieu invalide." }, { status: 400 });
    patch.lieu = lieu;
  } else if (body.data.mode === "categorie") {
    const categorie = tokenSansEspacesCommeScanfPercentS(body.data.categorie ?? existing.categorie);
    if (!categorieValide(categorie)) return NextResponse.json({ error: "Categorie invalide." }, { status: 400 });
    patch.categorie = categorie as RDV["categorie"];
  }

  const next: RDV = { ...(existing as RDV), ...patch, id: existing.id };

  if (periodeValide(next.heureDebut, next.minuteDebut, next.heureFin, next.minuteFin) === 0) {
    return NextResponse.json({ error: "Modification refusee : heure de debut invalide." }, { status: 409 });
  }

  const { data: all, error: allFetchError } = await supabase.from("appointments").select("*");
  if (allFetchError) return NextResponse.json({ error: allFetchError.message }, { status: 500 });

  if (
    conflitRendezVous(
      all as RDV[],
      next.jour,
      next.mois,
      next.annee,
      next.heureDebut,
      next.minuteDebut,
      next.heureFin,
      next.minuteFin,
      existing.id,
    ) === 1
  ) {
    return NextResponse.json(
      { error: "Modification refusee : conflit horaire avec un autre rendez-vous." },
      { status: 409 },
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", num)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ item: updated });
}
