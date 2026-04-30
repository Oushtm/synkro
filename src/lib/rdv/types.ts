export type RDVCategory = "professionnel" | "personnel" | "medical";

export type RDV = {
  id: number;
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

