"use client";

import CardFan from "@/components/card-fan";
import { timelineData } from "@/lib/timeline-data";

export default function HubPage() {
  return (
    <main className="flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black text-white">
      <CardFan items={timelineData} />
    </main>
  );
}
