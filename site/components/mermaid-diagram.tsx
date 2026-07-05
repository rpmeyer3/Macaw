"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

// Renders a mermaid diagram client-side. mermaid is dynamically imported so
// its ~500KB engine stays out of the main bundle and only loads when a
// project overlay that uses a diagram actually mounts. Server render (and the
// first client paint) shows a placeholder, so there is no hydration mismatch.
export function MermaidDiagram({
  chart,
  accent = "#ffffff",
  className,
}: {
  chart: string;
  accent?: string;
  className?: string;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  // useId is SSR-stable; strip the colons mermaid can't use in a DOM id.
  const id = "mmd" + useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
          flowchart: { curve: "basis", useMaxWidth: true },
          themeVariables: {
            background: "transparent",
            primaryColor: "rgba(255,255,255,0.05)",
            primaryTextColor: "#e8e8ea",
            primaryBorderColor: accent,
            lineColor: accent,
            secondaryColor: "rgba(255,255,255,0.03)",
            tertiaryColor: "rgba(255,255,255,0.02)",
            fontSize: "14px",
          },
        });
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(svg);
      } catch {
        // Bad syntax or engine failure: drop the block rather than crash the
        // page. mermaid may leave a temp node behind on error; clean it up.
        document.getElementById(id)?.remove();
        document.getElementById("d" + id)?.remove();
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, accent, id]);

  if (failed) return null;

  return (
    <figure
      className={cn(
        "mt-6 overflow-x-auto rounded-xl border border-white/15 bg-black/40 p-4 backdrop-blur-sm [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full",
        className,
      )}
      role="img"
      aria-label="Architecture diagram of how the project works"
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="h-40 w-full animate-pulse rounded bg-white/[0.03]" />
      )}
    </figure>
  );
}
