"use client";

import type { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  // Width (px) of the glare band that pans across the text.
  shimmerWidth?: number;
}

// Animated Shiny Text (magicui, via 21st.dev). A light glare pans across the
// text making it shimmer. Tuned for a dark background: the base glyphs sit at
// a dim white and the moving band brightens to full white. The keyframes live
// in globals.css as `.animate-shiny-text` so no Tailwind config is required.
export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 120,
}) => {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        "text-white/40",
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%]",
        "bg-gradient-to-r from-transparent via-white via-50% to-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
};
