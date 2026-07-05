import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github, Lock, Phone } from "lucide-react";
import {
  aboutContent,
  projectsContent,
  experienceContent,
  educationContent,
  contactContent,
  skillsContent,
} from "@/lib/node-content";
import { SECTION_THEMES } from "@/lib/section-themes";
import { TitleSparkles } from "@/components/sparkles";

export type NodeSlug =
  | "about"
  | "projects"
  | "experience"
  | "education"
  | "contact";

const SLUG_TITLE: Record<NodeSlug, string> = {
  about: "About",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
};

export function NodeOverlay({ slug }: { slug: NodeSlug }) {
  const theme = SECTION_THEMES[slug];
  return (
    <div
      className="relative min-h-[400dvh] text-white"
      style={{ "--accent": theme.accent } as React.CSSProperties}
    >
      {/* The same landscape the hub card grew from, pinned behind the
          content with a readability scrim tinted by the section's glow. */}
      <div aria-hidden className="fixed inset-0 z-0">
        <Image
          src={theme.image}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.62) 45%, rgba(0,0,0,0.82) 100%), radial-gradient(120% 70% at 50% 0%, ${theme.glow}, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-20 px-6 md:px-10 pt-6 pb-2 backdrop-blur-sm bg-black/30">
          <Link
            href="/hub"
            className="inline-flex items-center text-xs font-mono uppercase tracking-[0.08em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} className="mr-2" />
            back to hub
          </Link>
        </header>

        <section className="min-h-[100dvh] flex items-center justify-center px-6">
          <div className="max-w-3xl w-full">
            <p
              className="text-xs font-mono uppercase tracking-[0.08em] mb-4"
              style={{ color: "var(--accent)" }}
            >
              {slug}
            </p>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {SLUG_TITLE[slug]}
            </h1>
            <TitleSparkles
              className="h-12 mt-4"
              particleDensity={1000}
              particleColor={theme.accent}
            />
          </div>
        </section>

        {slug === "about" && <AboutOverlay />}
        {slug === "projects" && <ProjectsOverlay accent={theme.accent} />}
        {slug === "experience" && <ExperienceOverlay accent={theme.accent} />}
        {slug === "education" && <EducationOverlay accent={theme.accent} />}
        {slug === "contact" && <ContactOverlay />}

        <footer className="min-h-[40dvh] flex items-end justify-center pb-16 text-xs font-mono uppercase tracking-[0.08em] text-white/30">
          <span>
            ↓ keep scrolling, or{" "}
            <Link
              href="/hub"
              className="text-white/60 underline underline-offset-4 hover:text-white transition-colors"
            >
              return to hub
            </Link>
          </span>
        </footer>
      </div>
    </div>
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-h-[80dvh] flex items-center justify-center px-6 py-16 ${className}`}
    >
      <div className="max-w-3xl w-full">{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-mono uppercase tracking-[0.08em] mb-3"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </p>
  );
}

function AboutOverlay() {
  return (
    <>
      <Section>
        <SectionLabel>bio</SectionLabel>
        <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/90">
          {aboutContent.bio}
        </p>
        <p className="mt-8 text-sm font-mono uppercase tracking-[0.08em] text-white/50">
          {aboutContent.tagline} · {aboutContent.location}
        </p>
      </Section>

      <Section>
        <SectionLabel>looking for</SectionLabel>
        <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90">
          {aboutContent.lookingFor}
        </p>
      </Section>

      <Section>
        <SectionLabel>tech</SectionLabel>
        <ul className="space-y-6">
          {skillsContent.map((group) => (
            <li key={group.label}>
              <p className="text-sm font-mono uppercase tracking-[0.08em] text-white/50 mb-2">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 text-[11px] font-mono uppercase tracking-[0.08em] border text-white/80"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--accent) 45%, transparent)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionLabel>elsewhere</SectionLabel>
        <ul className="space-y-3 text-lg">
          <li>
            <a
              href={aboutContent.previousPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-white hover:text-white/80 transition-colors inline-flex items-center"
            >
              ryanmeyer.dev (older portfolio)
              <ExternalLink size={14} className="ml-2" />
            </a>
          </li>
          <li>
            <a
              href={contactContent.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-white hover:text-white/80 transition-colors inline-flex items-center"
            >
              github.com/rpmeyer3
              <Github size={14} className="ml-2" />
            </a>
          </li>
        </ul>
      </Section>
    </>
  );
}

function ProjectsOverlay({ accent }: { accent: string }) {
  return (
    <>
      {projectsContent.map((p) => (
        <Section key={p.name}>
          <article>
            <SectionLabel>
              {p.period ? `project · ${p.period}` : "project"}
            </SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {p.name}
            </h2>
            <TitleSparkles particleColor={accent} />
            <p className="mt-2 text-base md:text-lg text-white/60 italic">
              {p.tagline}
            </p>

            {p.image &&
              (() => {
                const href = p.repo ?? p.live;
                const img = (
                  <Image
                    src={p.image}
                    alt={`${p.name} repository card`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                );
                const frame =
                  "relative mt-6 block aspect-[2/1] overflow-hidden rounded-xl border border-white/15";
                // Private/internal projects have a card image but no link.
                return href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${frame} transition-colors hover:border-white/40`}
                  >
                    {img}
                  </a>
                ) : (
                  <div className={frame}>{img}</div>
                );
              })()}
            <p className="mt-6 text-base md:text-lg text-white/80 leading-relaxed">
              {p.description}
            </p>

            {p.highlights.length > 0 && (
              <ul className="mt-6 space-y-2">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start text-sm md:text-base text-white/75"
                  >
                    <span className="mr-3 mt-2 inline-block h-px w-4 bg-[var(--accent)] opacity-70 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.08em] border border-white/30 text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {!p.repo && p.repoPrivate && (
                <span className="inline-flex items-center text-xs font-mono uppercase tracking-[0.08em] text-white/45">
                  <Lock size={12} className="mr-2" />
                  private repo
                </span>
              )}
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-mono uppercase tracking-[0.08em] text-white/70 hover:text-white transition-colors"
                >
                  source
                  <Github size={12} className="ml-2" />
                </a>
              )}
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-mono uppercase tracking-[0.08em] text-white/70 hover:text-white transition-colors"
                >
                  live demo
                  <ExternalLink size={12} className="ml-2" />
                </a>
              )}
            </div>
          </article>
        </Section>
      ))}
    </>
  );
}

function ExperienceOverlay({ accent }: { accent: string }) {
  return (
    <>
      {experienceContent.map((e) => (
        <Section key={`${e.org}-${e.period}`}>
          <article>
            <SectionLabel>{e.period}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {e.role}
            </h2>
            <TitleSparkles particleColor={accent} />
            <p className="mt-1 text-lg text-white/70">
              {e.org}
              {e.location ? (
                <span className="text-white/50"> · {e.location}</span>
              ) : null}
            </p>
            <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed">
              {e.description}
            </p>
            {e.bullets && e.bullets.length > 0 && (
              <ul className="mt-6 space-y-3">
                {e.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start text-sm md:text-base text-white/75 leading-relaxed"
                  >
                    <span className="mr-3 mt-2 inline-block h-px w-4 bg-[var(--accent)] opacity-70 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {e.repos && e.repos.length > 0 && (
              <div className="mt-8">
                <p
                  className="text-xs font-mono uppercase tracking-[0.08em] mb-3"
                  style={{ color: "var(--accent)" }}
                >
                  repos from this role
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {e.repos.map((r) => (
                    <div
                      key={r.name}
                      className="rounded-xl border border-white/15 bg-black/30 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-mono text-sm uppercase tracking-[0.08em] text-white hover:underline"
                          >
                            <Github size={12} className="mr-2" />
                            {r.name}
                          </a>
                        ) : (
                          <p className="font-mono text-sm uppercase tracking-[0.08em] text-white">
                            {r.name}
                          </p>
                        )}
                        {r.isPrivate && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.08em] text-white/45">
                            <Lock size={10} />
                            private
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs md:text-sm text-white/65 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </Section>
      ))}
    </>
  );
}

function EducationOverlay({ accent }: { accent: string }) {
  return (
    <Section>
      {educationContent.map((e) => (
        <div key={e.school} className="mb-10">
          <SectionLabel>{e.period}</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight">{e.school}</h2>
          <TitleSparkles particleColor={accent} />
          <p className="mt-1 text-lg text-white/70">
            {e.degree}
            {e.location ? (
              <span className="text-white/50"> · {e.location}</span>
            ) : null}
          </p>
          {e.notes && (
            <p className="mt-4 text-base text-white/80 leading-relaxed">
              {e.notes}
            </p>
          )}
          {e.coursework && e.coursework.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-mono uppercase tracking-[0.08em] text-white/50 mb-2">
                coursework
              </p>
              <ul className="space-y-1 text-sm text-white/75">
                {e.coursework.map((c) => (
                  <li key={c} className="flex items-start">
                    <span className="mr-3 mt-2 inline-block h-px w-4 bg-[var(--accent)] opacity-70 flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </Section>
  );
}

function ContactOverlay() {
  return (
    <Section>
      <ul className="space-y-6 text-lg">
        <li>
          <a
            href={`mailto:${contactContent.email}`}
            className="font-mono text-white hover:text-white/80 transition-colors break-all"
          >
            {contactContent.email}
          </a>
        </li>
        <li>
          <a
            href={`tel:${contactContent.phone.replace(/\D/g, "")}`}
            className="font-mono text-white hover:text-white/80 transition-colors inline-flex items-center"
          >
            {contactContent.phone}
            <Phone size={14} className="ml-2" />
          </a>
        </li>
        <li>
          <a
            href={contactContent.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white hover:text-white/80 transition-colors inline-flex items-center"
          >
            linkedin.com/in/rmeyer3
            <ExternalLink size={14} className="ml-2" />
          </a>
        </li>
        <li>
          <a
            href={contactContent.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white hover:text-white/80 transition-colors inline-flex items-center"
          >
            github.com/rpmeyer3
            <Github size={14} className="ml-2" />
          </a>
        </li>
        <li>
          <a
            href={contactContent.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white/70 hover:text-white transition-colors inline-flex items-center"
          >
            ryanmeyer.dev
            <ExternalLink size={14} className="ml-2" />
          </a>
        </li>
      </ul>
    </Section>
  );
}
