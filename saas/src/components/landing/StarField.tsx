"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function StarField() {
  const stars = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: (i * 31 + 7) % 100,
    top: (i * 47 + 13) % 100,
    size: 1 + ((i * 17) % 3),
    opacity: 0.15 + ((i * 11) % 40) / 100,
    duration: 3 + ((i * 7) % 8),
    delay: (i * 0.3) % 4,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.id % 3 === 0 ? "rgba(108,92,231,0.7)" : s.id % 3 === 1 ? "rgba(0,212,255,0.6)" : "rgba(255,255,255,0.5)",
          }}
          initial={{ opacity: s.opacity * 0.3 }}
          animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </div>
  );
}

export function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(108,92,231,0.08), transparent 50%)`,
      }}
    />
  );
}
