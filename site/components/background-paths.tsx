"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { TextScramble } from "@/components/text-scramble";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            pathLength={1}
            className="floating-path"
            style={{
              // CSS animation (keyframes in globals.css): seamless dash
              // drift with no per-frame JS. The old framer version snapped
              // pathLength from 1 back to 0.3 on every repeat and ran all
              // 72 paths in phase. Deterministic values keep SSR and client
              // markup identical.
              animationDuration: `${20 + ((path.id * 7) % 10)}s`,
              animationDelay: `${-(path.id * 1.7)}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface BackgroundPathsProps {
  text?: string;
  // Seconds to wait after the paths start moving before mounting the
  // text — gives the "first group of lines" time to come through.
  textDelayMs?: number;
}

export function BackgroundPaths({
  text = "get to know me",
  textDelayMs = 2000,
}: BackgroundPathsProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), textDelayMs);
    return () => clearTimeout(t);
  }, [textDelayMs]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <AnimatePresence>
        {showText && (
          <motion.div
            key="welcome-text"
            className="absolute top-[26%] right-[14%] md:top-[28%] md:right-[16%] z-10"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Link
              href="/hub"
              className="group inline-flex items-center font-mono text-xs md:text-sm uppercase tracking-[0.08em] text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] transition-colors"
            >
              <TextScramble as="span">{text}</TextScramble>
              <span
                aria-hidden
                className="ml-2 inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
