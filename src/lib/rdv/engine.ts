import type { RDV, RDVCategory } from "@/lib/rdv/types";

export const MAX_RDV = 100;
export const TAILLE_TEXTE = 50; // C buffer size (including '\0')

export function comparerDates(
  j1: number,
  m1: number,
  a1: number,
  j2: number,
  m2: number,
  a2: number,
) {
  if (a1 < a2) return -1;
  if (a1 > a2) return 1;
  if (m1 < m2) return -1;
  if (m1 > m2) return 1;
  if (j1 < j2) return -1;
  if (j1 > j2) return 1;
  return 0;
}

export function comparerHeures(h1: number, min1: number, h2: number, min2: number) {
  if (h1 < h2) return -1;
  if (h1 > h2) return 1;
  if (min1 < min2) return -1;
  if (min1 > min2) return 1;
  return 0;
}

export function dateAvant(
  j1: number,
  m1: number,
  a1: number,
  j2: number,
  m2: number,
  a2: number,
) {
  return comparerDates(j1, m1, a1, j2, m2, a2) === -1 ? 1 : 0;
}

export function periodeValide(hDeb: number, minDeb: number, hFin: number, minFin: number) {
  return comparerHeures(hDeb, minDeb, hFin, minFin) === -1 ? 1 : 0;
}

export function dateValide(jour: number, mois: number, annee: number) {
  let maxJour: number;

  if (annee < 1900 || annee > 2100) return 0;
  if (mois < 1 || mois > 12) return 0;

  if (mois === 1 || mois === 3 || mois === 5 || mois === 7 || mois === 8 || mois === 10 || mois === 12)
    maxJour = 31;
  else if (mois === 4 || mois === 6 || mois === 9 || mois === 11) maxJour = 30;
  else {
    if ((annee % 4 === 0 && annee % 100 !== 0) || annee % 400 === 0) maxJour = 29;
    else maxJour = 28;
  }

  if (jour < 1 || jour > maxJour) return 0;
  return 1;
}

export function comparerChaines(ch1: string, ch2: string) {
  // C logic: exact match, same length, case-sensitive
  return ch1 === ch2 ? 1 : 0;
}

export function longueurChaine(ch: string) {
  return ch.length;
}

export function categorieValide(categorie: string): categorie is RDVCategory {
  if (comparerChaines(categorie, "professionnel") === 1) return true;
  if (comparerChaines(categorie, "personnel") === 1) return true;
  if (comparerChaines(categorie, "medical") === 1) return true;
  return false;
}

export function rendezVousAvant(a: RDV, b: RDV) {
  const cmpDate = comparerDates(a.jour, a.mois, a.annee, b.jour, b.mois, b.annee);
  if (cmpDate === -1) return 1;
  if (cmpDate === 1) return 0;
  const cmpHeure = comparerHeures(a.heureDebut, a.minuteDebut, b.heureDebut, b.minuteDebut);
  return cmpHeure === -1 ? 1 : 0;
}

export function minutesTotal(h: number, m: number) {
  return h * 60 + m;
}

export function conflitRendezVous(
  existing: RDV[],
  jourSaisi: number,
  moisSaisi: number,
  anneeSaisie: number,
  hDeb: number,
  minDeb: number,
  hFin: number,
  minFin: number,
  idIgnore: number | null,
) {
  const debutNouveau = minutesTotal(hDeb, minDeb);
  const finNouveau = minutesTotal(hFin, minFin);

  for (const rdv of existing) {
    if (idIgnore !== null && rdv.id === idIgnore) continue;
    if (rdv.jour === jourSaisi && rdv.mois === moisSaisi && rdv.annee === anneeSaisie) {
      const debutExistant = minutesTotal(rdv.heureDebut, rdv.minuteDebut);
      const finExistant = minutesTotal(rdv.heureFin, rdv.minuteFin);
      if (debutNouveau < finExistant && finNouveau > debutExistant) return 1;
    }
  }
  return 0;
}

export function tokenSansEspacesCommeScanfPercentS(input: string) {
  // In C: scanf("%s") stops at whitespace; we replicate by taking the first token.
  const t = input.trim();
  if (!t) return "";
  return t.split(/\s+/)[0] ?? "";
}

export function tronquerCommeBufferC(input: string) {
  // In the C program, strings are stored in a fixed char buffer of size 50.
  // `scanf("%s")` is unbounded in C, but the *intended* in-memory capacity is 49 chars + '\0'.
  // We safely emulate this by truncating to 49 chars.
  const t = tokenSansEspacesCommeScanfPercentS(input);
  return t.slice(0, TAILLE_TEXTE - 1);
}

export function texteValideCommeCScanFPercentS(input: string) {
  // In interactive C usage, an empty token cannot be entered via `scanf("%s")`.
  // For the web, we reject empty strings.
  const t = tokenSansEspacesCommeScanfPercentS(input);
  if (longueurChaine(t) <= 0) return 0;
  return 1;
}

export function trierCommeAffichageC(rdvs: RDV[]) {
  // The C program doesn't sort in-place; it selects the next "min" repeatedly.
  // We return an equivalent ordered array.
  const deja = new Array(rdvs.length).fill(false);
  const out: RDV[] = [];

  for (let i = 0; i < rdvs.length; i++) {
    let trouve = 0;
    let minIndex = -1;
    for (let j = 0; j < rdvs.length; j++) {
      if (deja[j]) continue;
      if (trouve === 0) {
        minIndex = j;
        trouve = 1;
      } else if (rendezVousAvant(rdvs[j]!, rdvs[minIndex]!)) {
        minIndex = j;
      }
    }
    if (minIndex !== -1) {
      out.push(rdvs[minIndex]!);
      deja[minIndex] = true;
    }
  }
  return out;
}

