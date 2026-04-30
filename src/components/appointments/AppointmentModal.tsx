"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { RDV, RDVCategory } from "@/lib/rdv/types";
import {
  categorieValide,
  dateValide,
  periodeValide,
  tokenSansEspacesCommeScanfPercentS,
  texteValideCommeCScanFPercentS,
  tronquerCommeBufferC,
} from "@/lib/rdv/engine";
import { getErrorMessage } from "@/lib/errors";

type Mode = "add" | "modify";
import type { ModifyMode } from "@/lib/api";

function FieldLabel({ children }: { children: string }) {
  return <div className="text-xs font-medium text-slate-300">{children}</div>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "mt-1 h-11 w-full rounded-2xl border border-white/15 bg-[#020617] px-4 text-sm text-white outline-none",
        "placeholder:text-slate-500",
        "focus:border-[#6C5CE7] focus:shadow-[0_0_0_4px_rgba(108,92,231,0.18)]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "mt-1 h-11 w-full rounded-2xl border border-white/15 bg-[#020617] px-4 text-sm text-white outline-none",
        "focus:border-[#6C5CE7] focus:shadow-[0_0_0_4px_rgba(108,92,231,0.18)]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="mt-1 text-xs text-red-200/90">{message}</div>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-sm font-semibold tracking-tight text-white">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-400">{subtitle}</div> : null}
      </div>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function toISODate(annee: number, mois: number, jour: number) {
  const y = String(annee).padStart(4, "0");
  const m = String(mois).padStart(2, "0");
  const d = String(jour).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toTimeStr(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseISODate(value: string) {
  // value = "YYYY-MM-DD"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  return { annee: Number(m[1]), mois: Number(m[2]), jour: Number(m[3]) };
}

function parseTime(value: string) {
  // value = "HH:MM"
  const m = /^(\d{2}):(\d{2})$/.exec(value);
  if (!m) return null;
  return { h: Number(m[1]), min: Number(m[2]) };
}

export function AppointmentModal({
  open,
  mode,
  initial,
  onClose,
  onSubmitAdd,
  onSubmitModify,
}: {
  open: boolean;
  mode: Mode;
  initial?: RDV | null;
  onClose: () => void;
  onSubmitAdd: (rdv: Omit<RDV, "id">) => Promise<void>;
  onSubmitModify: (id: number, payload: { mode: ModifyMode } & Partial<Omit<RDV, "id">>) => Promise<void>;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [modifyMode, setModifyMode] = useState<ModifyMode>("date");

  const defaults = useMemo(() => {
    const now = new Date();
    return {
      jour: now.getDate(),
      mois: now.getMonth() + 1,
      annee: now.getFullYear(),
      heureDebut: 9,
      minuteDebut: 0,
      heureFin: 10,
      minuteFin: 0,
      lieu: "bureau",
      categorie: "professionnel" as RDVCategory,
    };
  }, []);

  const [form, setForm] = useState<Omit<RDV, "id">>(() => ({
    jour: initial?.jour ?? defaults.jour,
    mois: initial?.mois ?? defaults.mois,
    annee: initial?.annee ?? defaults.annee,
    heureDebut: initial?.heureDebut ?? defaults.heureDebut,
    minuteDebut: initial?.minuteDebut ?? defaults.minuteDebut,
    heureFin: initial?.heureFin ?? defaults.heureFin,
    minuteFin: initial?.minuteFin ?? defaults.minuteFin,
    lieu: initial?.lieu ?? defaults.lieu,
    categorie: initial?.categorie ?? defaults.categorie,
  }));

  const [dateStr, setDateStr] = useState(() => toISODate(form.annee, form.mois, form.jour));
  const [startTimeStr, setStartTimeStr] = useState(() => toTimeStr(form.heureDebut, form.minuteDebut));
  const [endTimeStr, setEndTimeStr] = useState(() => toTimeStr(form.heureFin, form.minuteFin));

  const [fieldErrors, setFieldErrors] = useState<{
    date?: string;
    startTime?: string;
    endTime?: string;
    timeRange?: string;
    location?: string;
    category?: string;
  }>({});

  const title = mode === "add" ? "Create appointment" : "Modify appointment";

  function mapApiOrClientErrorToFields(message: string) {
    if (message.includes("Date invalide")) return { date: message };
    if (message.includes("Lieu invalide")) return { location: message };
    if (message.includes("Categorie invalide")) return { category: message };
    if (message.includes("Periode invalide") || message.includes("heure de debut")) return { timeRange: message };
    if (message.includes("Conflit horaire") || message.includes("conflit horaire")) return { timeRange: message };
    return {};
  }

  async function submit() {
    setErr(null);
    setFieldErrors({});
    setBusy(true);
    try {
      // Convert native inputs -> C-like numeric fields.
      const parsedDate = parseISODate(dateStr);
      const parsedStart = parseTime(startTimeStr);
      const parsedEnd = parseTime(endTimeStr);

      const nextErrors: typeof fieldErrors = {};
      if (!parsedDate) nextErrors.date = "Please select a valid date.";
      if (!parsedStart) nextErrors.startTime = "Please select a valid start time.";
      if (!parsedEnd) nextErrors.endTime = "Please select a valid end time.";
      if (Object.keys(nextErrors).length) {
        setFieldErrors(nextErrors);
        return;
      }

      const nextForm: Omit<RDV, "id"> = {
        ...form,
        jour: parsedDate!.jour,
        mois: parsedDate!.mois,
        annee: parsedDate!.annee,
        heureDebut: parsedStart!.h,
        minuteDebut: parsedStart!.min,
        heureFin: parsedEnd!.h,
        minuteFin: parsedEnd!.min,
      };
      setForm(nextForm);

      const lieu = tokenSansEspacesCommeScanfPercentS(form.lieu);
      const categorie = tokenSansEspacesCommeScanfPercentS(form.categorie);

      if (dateValide(nextForm.jour, nextForm.mois, nextForm.annee) === 0) throw new Error("Date invalide.");
      const lieuTronque = tronquerCommeBufferC(lieu);
      if (texteValideCommeCScanFPercentS(lieuTronque) === 0) throw new Error("Lieu invalide.");
      if (!categorieValide(categorie)) throw new Error("Categorie invalide.");
      if (periodeValide(nextForm.heureDebut, nextForm.minuteDebut, nextForm.heureFin, nextForm.minuteFin) === 0) {
        throw new Error("Periode invalide : l'heure de debut doit etre avant l'heure de fin.");
      }

      if (mode === "add") {
        await onSubmitAdd({ ...nextForm, lieu: lieuTronque, categorie: categorie as RDVCategory });
      } else {
        if (!initial) throw new Error("Rendez-vous introuvable.");
        if (modifyMode === "date")
          await onSubmitModify(initial.id, {
            mode: "date",
            jour: nextForm.jour,
            mois: nextForm.mois,
            annee: nextForm.annee,
          });
        if (modifyMode === "heureDebut")
          await onSubmitModify(initial.id, {
            mode: "heureDebut",
            heureDebut: nextForm.heureDebut,
            minuteDebut: nextForm.minuteDebut,
          });
        if (modifyMode === "heureFin")
          await onSubmitModify(initial.id, {
            mode: "heureFin",
            heureFin: nextForm.heureFin,
            minuteFin: nextForm.minuteFin,
          });
        if (modifyMode === "lieu")
          await onSubmitModify(initial.id, { mode: "lieu", lieu: lieuTronque });
        if (modifyMode === "categorie")
          await onSubmitModify(initial.id, {
            mode: "categorie",
            categorie: categorie as RDVCategory,
          });
      }

      onClose();
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      setErr(msg);
      setFieldErrors((prev) => ({ ...prev, ...mapApiOrClientErrorToFields(msg) }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-3xl rounded-3xl p-6 bg-[#0F172A] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Appointments</div>
                <div className="text-lg font-semibold tracking-tight text-white">{title}</div>
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.08] hover:shadow-[0_0_25px_rgba(108,92,231,0.18)]"
              >
                Close
              </button>
            </div>

            {mode === "modify" ? (
              <div className="mt-5">
                <FieldLabel>Modification mode (matches C menu)</FieldLabel>
                  <Select value={modifyMode} onChange={(e) => setModifyMode(e.target.value as ModifyMode)}>
                    <option value="date">Modifier la date</option>
                    <option value="heureDebut">Modifier l&apos;heure de debut</option>
                    <option value="heureFin">Modifier l&apos;heure de fin</option>
                    <option value="lieu">Modifier le lieu</option>
                    <option value="categorie">Modifier la categorie</option>
                  </Select>
              </div>
            ) : null}

            <div className="mt-6 space-y-6">
              {/* DATE */}
              <div>
                <SectionTitle title="Date" subtitle="Native date input, converted to day / month / year (C logic)" />
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <FieldLabel>Appointment date</FieldLabel>
                    <TextInput
                      type="date"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      className="appearance-none"
                      disabled={mode === "modify" && modifyMode !== "date"}
                    />
                    <FieldError message={fieldErrors.date} />
                  </div>
                </div>
              </div>

              {/* TIME */}
              <div>
                <SectionTitle title="Time" subtitle="Start time must be strictly before end time (C: periodeValide)" />
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Start time</FieldLabel>
                    <TextInput
                      type="time"
                      value={startTimeStr}
                      onChange={(e) => setStartTimeStr(e.target.value)}
                      step={60}
                      disabled={mode === "modify" && modifyMode !== "heureDebut" && modifyMode !== "date"}
                    />
                    <FieldError message={fieldErrors.startTime} />
                  </div>
                  <div>
                    <FieldLabel>End time</FieldLabel>
                    <TextInput
                      type="time"
                      value={endTimeStr}
                      onChange={(e) => setEndTimeStr(e.target.value)}
                      step={60}
                      disabled={mode === "modify" && modifyMode !== "heureFin" && modifyMode !== "date"}
                    />
                    <FieldError message={fieldErrors.endTime} />
                  </div>
                </div>
                <FieldError message={fieldErrors.timeRange} />
              </div>

              {/* DETAILS */}
              <div>
                <SectionTitle title="Details" subtitle="Location is stored like C scanf(&quot;%s&quot;) (first token, truncated to 49 chars)" />
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Location</FieldLabel>
                    <TextInput
                      value={form.lieu}
                      onChange={(e) => setForm((s) => ({ ...s, lieu: e.target.value }))}
                      placeholder="bureau"
                      disabled={mode === "modify" && modifyMode !== "lieu"}
                    />
                    <FieldError message={fieldErrors.location} />
                    <div className="mt-1 text-xs text-slate-400">
                      Spaces are ignored (only the first token is stored).
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <Select
                      value={form.categorie}
                      onChange={(e) => setForm((s) => ({ ...s, categorie: e.target.value as RDVCategory }))}
                      disabled={mode === "modify" && modifyMode !== "categorie"}
                    >
                      <option value="professionnel">professionnel</option>
                      <option value="personnel">personnel</option>
                      <option value="medical">medical</option>
                    </Select>
                    <FieldError message={fieldErrors.category} />
                  </div>
                </div>
              </div>
            </div>

            {err ? (
              <div className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {err}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                disabled={busy}
                onClick={submit}
                className="rounded-2xl px-5 py-3 text-sm font-medium text-black disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(108,92,231,1) 0%, rgba(0,212,255,1) 100%)",
                  boxShadow: "0 0 55px rgba(108,92,231,0.22), 0 0 55px rgba(0,212,255,0.12)",
                }}
              >
                {busy ? "Saving..." : mode === "add" ? "Add appointment" : "Apply modification"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

