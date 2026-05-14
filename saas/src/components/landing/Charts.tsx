"use client";
import { motion } from "framer-motion";

const bars = [65, 45, 80, 55, 70, 40, 90, 60, 50, 75, 85, 42];

export function MiniChart({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] h-10 ${className}`}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-full"
          style={{ background: i % 2 === 0 ? "rgba(108,92,231,0.7)" : "rgba(0,212,255,0.5)" }}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function MiniLineChart() {
  const points = "0,28 15,22 30,26 45,14 60,18 75,8 90,12 105,6";
  return (
    <svg viewBox="0 0 110 32" className="w-full h-8" fill="none">
      <defs>
        <linearGradient id="lcg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6c5ce7" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <linearGradient id="lcf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(108,92,231,0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        stroke="url(#lcg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />
      <polygon points={`0,32 ${points} 105,32`} fill="url(#lcf)" opacity="0.5" />
    </svg>
  );
}

export function LivePulse({ color = "var(--accent)" }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inset-0 rounded-full pulse-ring" style={{ background: color, opacity: 0.4 }} />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: color }} />
    </span>
  );
}
