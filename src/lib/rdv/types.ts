export type RDVCategory = "professionnel" | "personnel" | "medical";

export type RDV = {
  id: number;
  /** Set by Supabase; omitted in forms. */
  user_id?: string;
  jour: number;
  mois: number;
  annee: number;
  heureDebut: number;
  minuteDebut: number;
  heureFin: number;
  minuteFin: number;
  lieu: string;
  categorie: RDVCategory;
};

