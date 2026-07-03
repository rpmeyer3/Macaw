"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { TimelineItem } from "@/lib/timeline-data";

interface CardFanProps {
  items: TimelineItem[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * Returns a multiplier (0..1] that scales y-offsets and entry animation
 * distances when the viewport is too short for the ideal layout height.
 */
function getHeightMultiplier(width: number) {
  // Ideal layout heights (in px at 16px root) matching the CSS breakpoints
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7; // 70vh budget
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  // Fractional center keeps even card counts symmetric (integer >> 1 made
  // a 6-card fan span -1..+2/3 and lean left).
  const center = (totalCards - 1) / 2;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.round(Math.abs(slot - center)),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-white/10 bg-white/5 backdrop-blur-[16px] text-white/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-white/25 hover:text-white/80 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-white/[0.04] before:pointer-events-none";

export default function CardFan({ items }: CardFanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = items.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(
    needsPagination ? HALF : totalCards >> 1,
  );

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        items.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set(
          (((center + slot - HALF) % totalCards) + totalCards) % totalCards,
          slot,
        );
      }
      return map;
    },
    [totalCards, needsPagination, items],
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right"
          ? (prev + 1) % totalCards
          : (prev - 1 + totalCards) % totalCards,
      );
    },
    [totalCards, needsPagination],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(
      container.querySelectorAll<HTMLElement>(".fan-card"),
    );
    if (!cardElements.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    // Hover/focus that arrives while the entry animation is running is
    // deferred, not dropped — mouseenter/focus won't re-fire for a pointer
    // or focus already resting on the card when the lock clears.
    let pendingSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized =
              centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength =
              8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot)
              targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          // duration 0 under reduced motion = plain set; also lets the
          // resize handler below re-apply base layout without animation.
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : delay,
          ease: "elastic.out(1,.75)",
          // 'auto' overwrite only kills conflicts when a tween first
          // renders — a still-delayed tween from a fast pointer sweep
          // survives and later stomps the newer one. true kills at
          // creation.
          overwrite: true,
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
        if (pendingSlot !== null) {
          const slot = pendingSlot;
          pendingSlot = null;
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        // autoAlpha (opacity + visibility) keeps hidden cards out of the
        // tab order and accessibility tree, matching the visibility:hidden
        // starting state in globals.css.
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          autoAlpha: 1,
          zIndex,
        };

        if (reduceMotion) {
          gsap.set(card, target);
          onCardDone();
        } else if (isFirstMount) {
          gsap.set(card, {
            x: 0,
            y: `${12 * hMult}rem`,
            rotation: 0,
            scale: 0.5,
            autoAlpha: 0,
          });
          gsap.to(card, {
            ...target,
            duration: 1.2,
            ease: "elastic.out(1.05,.78)",
            delay: 0.2 + slot * 0.06,
            onComplete: onCardDone,
          });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, {
            x: `${enterX}rem`,
            y: `${y * hMult}rem`,
            rotation: direction === "right" ? 30 : -30,
            scale: 0.5,
            autoAlpha: 0,
          });
          gsap.to(card, {
            ...target,
            duration: 0.6,
            ease: "power2.out",
            onComplete: onCardDone,
          });
        } else {
          gsap.to(card, {
            ...target,
            duration: 0.5,
            ease: "power2.out",
            onComplete: onCardDone,
          });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        const exitState = {
          x: `${exitX}rem`,
          autoAlpha: 0,
          scale: 0.5,
          rotation: direction === "right" ? -30 : 30,
          zIndex: 0,
        };
        if (reduceMotion) {
          gsap.set(card, exitState);
        } else {
          gsap.to(card, { ...exitState, duration: 0.4, ease: "power2.in" });
        }
      } else if (isFirstMount) {
        gsap.set(card, { autoAlpha: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Resize re-applies the base layout for everyone — under reduced motion
    // updateHoverLayout degenerates to gsap.set, so this is the only thing
    // keeping positions in sync with the CSS breakpoints there.
    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    // Hover/focus lift — skipped under prefers-reduced-motion (CSS border
    // hover on the card face still gives feedback).
    let enterHandlers: { el: HTMLElement; handler: () => void }[] = [];
    const onMouseLeave = () => {
      if (isAnimating.current) {
        pendingSlot = null;
        return;
      }
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };

    if (!reduceMotion) {
      enterHandlers = visibleEntries.map(({ el, slot }) => {
        const handler = () => {
          if (isAnimating.current) {
            pendingSlot = slot;
            return;
          }
          if (leaveTimer) {
            clearTimeout(leaveTimer);
            leaveTimer = null;
          }
          if (activeSlot !== slot) {
            activeSlot = slot;
            updateHoverLayout(slot);
          }
        };
        el.addEventListener("mouseenter", handler);
        // Keyboard parity: focusing a card lifts it the same way hover does.
        el.addEventListener("focus", handler);
        return { el, handler };
      });
      container.addEventListener("mouseleave", onMouseLeave);
      container.addEventListener("focusout", onMouseLeave);
    }

    return () => {
      enterHandlers.forEach(({ el, handler }) => {
        el.removeEventListener("mouseenter", handler);
        el.removeEventListener("focus", handler);
      });
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("focusout", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg
      className="relative z-[2] w-4 h-4 md:w-5 md:h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
      />
    </svg>
  );

  // Cards stack center-on-top, so on narrow screens only the outer edge of
  // each off-center card stays visible. Right-of-center cards get
  // right-aligned content so the icon/title sit in that visible strip.
  const centerOfFan = (totalCards - 1) / 2;

  return (
    <section className="flex flex-col items-center w-full py-4 lg:py-8 px-4 md:px-8 relative z-20">
      <div className="flex items-center justify-center w-full max-w-[90rem]">
        <div
          ref={containerRef}
          className="fan-layout flex relative justify-center items-center w-full max-w-[80rem]"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const alignEnd = !needsPagination && index > centerOfFan;
            return (
              <Link
                key={item.id}
                href={`/hub/${item.slug}`}
                className="fan-card group block cursor-pointer outline-none"
                aria-label={`${item.title} — ${item.content}`}
              >
                <article
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b10] shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-colors duration-300 group-hover:border-white/45 group-focus-visible:border-white p-5 md:p-6 ${
                    alignEnd ? "items-end text-right" : "items-start"
                  }`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)]"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/40 bg-black text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                    <Icon size={16} />
                  </div>
                  <h2 className="mt-4 font-mono text-base md:text-lg font-semibold uppercase tracking-[0.08em] text-white">
                    {item.title}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-white/45">
                    {item.date}
                  </p>
                  <p className="mt-3 hidden sm:line-clamp-4 text-xs md:text-sm leading-relaxed text-white/65">
                    {item.content}
                  </p>
                  <span className="mt-auto pt-3 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-white/50 transition-colors duration-300 group-hover:text-white">
                    open <span aria-hidden>→</span>
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-4 mt-4 md:mt-6 z-30">
          <button
            className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`}
            onClick={() => cycle("left")}
            aria-label="Previous"
          >
            {chevron("left")}
          </button>
          <div aria-hidden className="flex items-center gap-2">
            {items.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === centerIndex
                    ? "bg-white/80 scale-[1.3]"
                    : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <button
            className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`}
            onClick={() => cycle("right")}
            aria-label="Next"
          >
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
