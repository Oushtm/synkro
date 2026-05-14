"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: 0.6, // Start after letters
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Attempt to play a premium UI chime sound using Web Audio API
    // Note: Browsers may block this if the user hasn't interacted with the document yet.
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        
        // Frequencies for a premium, soft, futuristic chord (Amaj9)
        const freqs = [440, 554.37, 659.25, 830.61]; 
        
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sine";
          osc.frequency.value = freq;
          
          // Soft attack and smooth decay
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.1 - (i * 0.02), ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 2);
        });
      }
    } catch (e) {
      console.log("Audio autoplay blocked by browser or not supported.");
    }

    // Total animation time is around 2 seconds, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const text = "Synkro".split("");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#06080f]"
        >
          {/* Background Ambient Glows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
            className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#6c5ce7] blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#00d4ff] blur-[120px]"
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="relative h-20 w-20 sm:h-24 sm:w-24"
            >
              {/* Subtle Pulse Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00d4ff] blur-xl"
              />
              <Image
                src="/logo.svg"
                alt="Synkro Logo"
                fill
                className="relative z-10 object-contain drop-shadow-[0_0_15px_rgba(108,92,231,0.5)]"
                priority
              />
            </motion.div>

            {/* Text Animation */}
            <div
              className="flex items-center text-4xl sm:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "Inter, 'SF Pro Display', sans-serif" }}
            >
              {text.map((char, i) => {
                // Calculate gradient color mix for each letter (purple -> blue -> cyan)
                const percent = i / (text.length - 1);
                // Approximate standard RGB mix for visual neon
                // Purple: rgb(108,92,231) -> Cyan: rgb(0,212,255)
                const r = Math.round(108 + percent * (0 - 108));
                const g = Math.round(92 + percent * (212 - 92));
                const b = Math.round(231 + percent * (255 - 231));

                return (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      color: `rgb(${r}, ${g}, ${b})`,
                      textShadow: `0 0 20px rgba(${r}, ${g}, ${b}, 0.6)`,
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
