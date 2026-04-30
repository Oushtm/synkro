"use client";

import type { RDV } from "@/lib/rdv/types";
import { motion } from "framer-motion";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function fmtDate(r: RDV) {
  return `${pad2(r.jour)}/${pad2(r.mois)}/${String(r.annee).padStart(4, "0")}`;
}

function fmtTime(h: number, m: number) {
  return `${pad2(h)}:${pad2(m)}`;
}

export function AppointmentList({
  items,
  onEdit,
  onDelete,
}: {
  items: RDV[];
  onEdit: (rdv: RDV) => void;
  onDelete: (rdv: RDV) => void;
}) {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <div className="text-xs text-[color:var(--muted)]">Rendez-vous</div>
          <div className="text-base font-semibold tracking-tight">Sorted by date + start time</div>
        </div>
        <div className="text-xs text-[color:var(--muted)]">{items.length} items</div>
      </div>
      <div className="border-t border-white/10" />

      {items.length === 0 ? (
        <div className="px-5 py-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-sm font-medium">No appointments yet</div>
            <div className="mt-1 text-sm text-[color:var(--muted)]">
              Create your first rendez-vous to unlock timeline + calendar insights.
            </div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {items.map((rdv, idx) => (
            <motion.div
              key={rdv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.2) }}
              className="px-5 py-4 hover:bg-white/[0.03] transition"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-[color:var(--muted)]">
                      ID {rdv.id}
                    </span>
                    <span className="text-sm font-semibold tracking-tight">{fmtDate(rdv)}</span>
                    <span className="text-sm text-[color:var(--muted)]">
                      {fmtTime(rdv.heureDebut, rdv.minuteDebut)} → {fmtTime(rdv.heureFin, rdv.minuteFin)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-[color:var(--foreground)]">{rdv.lieu}</span>
                    <span className="text-[color:var(--muted)]">•</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color:
                          rdv.categorie === "professionnel"
                            ? "rgba(108,92,231,0.95)"
                            : rdv.categorie === "personnel"
                              ? "rgba(0,212,255,0.95)"
                              : "rgba(233,231,255,0.95)",
                      }}
                    >
                      {rdv.categorie}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(rdv)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[color:var(--foreground)] hover:bg-white/[0.06]"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => onDelete(rdv)}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-[color:var(--muted)] hover:bg-white/[0.06] hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

