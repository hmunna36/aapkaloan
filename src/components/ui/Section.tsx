import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  action,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${center ? "text-center md:flex-col md:items-center" : ""}`}>
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <p className={`eyebrow ${dark ? "eyebrow-light" : ""}`}>
          {index && <span className="num opacity-70">{index}</span>}
          {eyebrow}
        </p>
        <h2 className={`heading mt-4 text-[2.1rem] sm:text-[2.6rem] md:text-5xl ${dark ? "text-ivory" : "text-ink-950"}`}>{title}</h2>
        {intro && (
          <p className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? "text-ink-300" : "text-ink-600"}`}>{intro}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  crumbs,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 text-ivory">
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(202 144 63 / 0.55), transparent 65%)" }}
        aria-hidden="true"
      />
      <div className="container-x relative pb-16 pt-32 md:pb-24 md:pt-40">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-400">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-bronze-300">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-ink-300" aria-current="page">
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1 className="display mt-5 max-w-4xl text-[2.6rem] sm:text-6xl md:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">{intro}</p>}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  );
}
