// One landscape per hub section. The card fan shows the photo on the card
// face; clicking grows it into the section page's background, and `accent`
// + `glow` tint that page's labels, bullets, chips, and sparkles to match
// the photo. Photos live in public/landscapes (picsum.photos originals,
// Unsplash-licensed).
export interface SectionTheme {
  image: string;
  alt: string;
  // Accent for small text/labels — picked light enough to pass on black.
  accent: string;
  // Translucent wash used in the page background gradient.
  glow: string;
}

export const SECTION_THEMES: Record<string, SectionTheme> = {
  about: {
    image: "/landscapes/about.jpg",
    alt: "Aerial view of a blue Norwegian fjord between granite ridges",
    accent: "#7cc4f2",
    glow: "rgba(38, 99, 145, 0.35)",
  },
  projects: {
    image: "/landscapes/projects.jpg",
    alt: "Green aurora rippling over a spruce forest at night",
    accent: "#5fe0a0",
    glow: "rgba(22, 120, 74, 0.32)",
  },
  experience: {
    image: "/landscapes/experience.jpg",
    alt: "Red canyon walls catching low desert sunlight",
    accent: "#f2a35e",
    glow: "rgba(150, 72, 25, 0.32)",
  },
  education: {
    image: "/landscapes/education.jpg",
    alt: "Snowbound Himalayan peaks under a deep blue sky",
    accent: "#b9d4f0",
    glow: "rgba(70, 105, 150, 0.30)",
  },
  contact: {
    image: "/landscapes/contact.jpg",
    alt: "Dark ocean shoreline under a breaking storm sky",
    accent: "#8fc3d4",
    glow: "rgba(30, 80, 100, 0.32)",
  },
};
