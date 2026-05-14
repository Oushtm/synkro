"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import type { RDV, RDVCategory } from "@/lib/rdv/types";
import { apiAddAppointment, apiModifyAppointment, type ModifyMode } from "@/lib/api";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingRdv?: RDV | null;
};

const categories: { value: RDVCategory; label: string; color: string }[] = [
  { value: "professionnel", label: "Professionnel", color: "var(--cat-professionnel)" },
  { value: "personnel", label: "Personnel", color: "var(--cat-personnel)" },
  { value: "medical", label: "Medical", color: "var(--cat-medical)" },
];

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-[color:var(--muted)] mb-1.5">{children}</label>;
}

function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]/40 focus:ring-1 focus:ring-[color:var(--primary)]/20 placeholder:text-[color:var(--muted)]/60"
    />
  );
}

export function AppointmentDrawer({ open, onClose, onSaved, editingRdv }: DrawerProps) {
  const { toast } = useToast();
  const isEdit = !!editingRdv;

  const [jour, setJour] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [minuteDebut, setMinuteDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [minuteFin, setMinuteFin] = useState("");
  const [lieu, setLieu] = useState("");
  const [categorie, setCategorie] = useState<RDVCategory>("professionnel");
  const [loading, setLoading] = useState(false);
  const [editField, setEditField] = useState<ModifyMode>("date");

  // Reset form when drawer opens
  useEffect(() => {
    if (open && editingRdv) {
      setJour(String(editingRdv.jour));
      setMois(String(editingRdv.mois));
      setAnnee(String(editingRdv.annee));
      setHeureDebut(String(editingRdv.heureDebut));
      setMinuteDebut(String(editingRdv.minuteDebut));
      setHeureFin(String(editingRdv.heureFin));
      setMinuteFin(String(editingRdv.minuteFin));
      setLieu(editingRdv.lieu);
      setCategorie(editingRdv.categorie);
      setEditField("date");
    } else if (open) {
      const now = new Date();
      setJour(String(now.getDate()));
      setMois(String(now.getMonth() + 1));
      setAnnee(String(now.getFullYear()));
      setHeureDebut("9");
      setMinuteDebut("0");
      setHeureFin("10");
      setMinuteFin("0");
      setLieu("");
      setCategorie("professionnel");
    }
  }, [open, editingRdv]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      if (isEdit && editingRdv) {
        // Modification — C style: one field at a time
        const payload: Record<string, unknown> = { mode: editField };
        if (editField === "date") {
          payload.jour = Number(jour);
          payload.mois = Number(mois);
          payload.annee = Number(annee);
        } else if (editField === "heureDebut") {
          payload.heureDebut = Number(heureDebut);
          payload.minuteDebut = Number(minuteDebut);
        } else if (editField === "heureFin") {
          payload.heureFin = Number(heureFin);
          payload.minuteFin = Number(minuteFin);
        } else if (editField === "lieu") {
          payload.lieu = lieu;
        } else if (editField === "categorie") {
          payload.categorie = categorie;
        }
        await apiModifyAppointment(editingRdv.id, payload as Parameters<typeof apiModifyAppointment>[1]);
        toast("Rendez-vous modifié avec succès.", "success");
      } else {
        await apiAddAppointment({
          jour: Number(jour),
          mois: Number(mois),
          annee: Number(annee),
          heureDebut: Number(heureDebut),
          minuteDebut: Number(minuteDebut),
          heureFin: Number(heureFin),
          minuteFin: Number(minuteFin),
          lieu,
          categorie,
        });
        toast("Rendez-vous ajouté avec succès.", "success");
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [isEdit, editingRdv, editField, jour, mois, annee, heureDebut, minuteDebut, heureFin, minuteFin, lieu, categorie, onSaved, onClose, toast]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[70] flex w-full max-w-[480px] flex-col border-l border-white/[0.06] bg-[#0a0e1a]/95 backdrop-blur-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <div className="text-lg font-semibold tracking-tight">
                  {isEdit ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
                </div>
                <div className="mt-0.5 text-xs text-[color:var(--muted)]">
                  {isEdit ? `ID: ${editingRdv?.id} — Modifier un champ` : "Remplissez les informations ci-dessous"}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-[color:var(--muted)] transition hover:bg-white/[0.06] hover:text-[color:var(--foreground)]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Edit field selector (only for edit mode) */}
              {isEdit && (
                <div className="mb-6">
                  <FieldLabel>Champ à modifier</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { mode: "date" as const, label: "Date" },
                      { mode: "heureDebut" as const, label: "Heure début" },
                      { mode: "heureFin" as const, label: "Heure fin" },
                      { mode: "lieu" as const, label: "Lieu" },
                      { mode: "categorie" as const, label: "Catégorie" },
                    ]).map((f) => (
                      <button
                        key={f.mode}
                        onClick={() => setEditField(f.mode)}
                        className={[
                          "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                          editField === f.mode
                            ? "border-[color:var(--primary)]/40 bg-[color:var(--primary)]/15 text-[color:var(--primary)]"
                            : "border-white/[0.08] bg-white/[0.03] text-[color:var(--muted)] hover:bg-white/[0.06]",
                        ].join(" ")}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date fields */}
              {(!isEdit || editField === "date") && (
                <div className="mb-5">
                  <FieldLabel>Date</FieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Input type="number" value={jour} onChange={setJour} placeholder="Jour" min={1} max={31} />
                    </div>
                    <div>
                      <Input type="number" value={mois} onChange={setMois} placeholder="Mois" min={1} max={12} />
                    </div>
                    <div>
                      <Input type="number" value={annee} onChange={setAnnee} placeholder="Année" min={1900} max={2100} />
                    </div>
                  </div>
                </div>
              )}

              {/* Start time */}
              {(!isEdit || editField === "heureDebut") && (
                <div className="mb-5">
                  <FieldLabel>Heure de début</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" value={heureDebut} onChange={setHeureDebut} placeholder="Heure" min={0} max={23} />
                    <Input type="number" value={minuteDebut} onChange={setMinuteDebut} placeholder="Minute" min={0} max={59} />
                  </div>
                </div>
              )}

              {/* End time */}
              {(!isEdit || editField === "heureFin") && (
                <div className="mb-5">
                  <FieldLabel>Heure de fin</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" value={heureFin} onChange={setHeureFin} placeholder="Heure" min={0} max={23} />
                    <Input type="number" value={minuteFin} onChange={setMinuteFin} placeholder="Minute" min={0} max={59} />
                  </div>
                </div>
              )}

              {/* Location */}
              {(!isEdit || editField === "lieu") && (
                <div className="mb-5">
                  <FieldLabel>Lieu</FieldLabel>
                  <Input value={lieu} onChange={setLieu} placeholder="bureau, cafe, cabinet..." />
                </div>
              )}

              {/* Category */}
              {(!isEdit || editField === "categorie") && (
                <div className="mb-5">
                  <FieldLabel>Catégorie</FieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCategorie(c.value)}
                        className={[
                          "rounded-xl border py-3 text-xs font-medium transition",
                          categorie === c.value
                            ? `cat-bg-${c.value} border-current`
                            : "border-white/[0.08] bg-white/[0.03] text-[color:var(--muted)] hover:bg-white/[0.06]",
                        ].join(" ")}
                        style={categorie === c.value ? { color: c.color } : undefined}
                      >
                        <span
                          className={`inline-block h-2 w-2 rounded-full mr-1.5 cat-dot-${c.value}`}
                        />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-6 py-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm text-[color:var(--muted)] transition hover:bg-white/[0.06]"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-black transition disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                }}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    En cours...
                  </span>
                ) : isEdit ? (
                  "Modifier"
                ) : (
                  "Ajouter"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
