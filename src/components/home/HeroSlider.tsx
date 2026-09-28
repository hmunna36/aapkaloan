"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircleQuestion, Pause, Play } from "lucide-react";
import type { HeroSlide } from "@/content/heroSlides";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

// Rotating service slides for the home hero. Slides are stacked in one grid cell
// so the hero keeps the height of the tallest slide and never jumps. Autoplay
// pauses on hover or keyboard focus, can be stopped with the pause button, and is
// off entirely for people who ask for reduced motion.

const INTERVAL_MS = 7000;
const SWIPE_PX = 50;

export function HeroSlider({ slides, visual, footer }: { slides: HeroSlide[]; visual: ReactNode; footer?: ReactNode }) {
  const { open } = useConsultation();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const swipeStart = useRef<number | null>(null);

  const count = slides.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const auto = playing && !held && !reducedMotion && count > 1;

  // Keyed on index, so moving by hand restarts the full interval.
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [auto, index, go]);

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  };

  const anyImage = slides.some((s) => s.image);

  return (
    <>
      <div
        className="min-w-0 animate-[rise_.8s_cubic-bezier(.2,.7,.2,1)_both]"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={onBlur}
      >
        <section aria-roledescription="carousel" aria-label="What we help with">
          <div className="grid touch-pan-y" aria-live={auto ? "off" : "polite"} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <div
                  key={s.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${s.eyebrow}`}
                  aria-hidden={!active}
                  inert={!active}
                  className={`[grid-area:1/1] transition duration-700 ease-out ${
                    active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <p className="eyebrow eyebrow-light">{s.eyebrow}</p>
                  <h2 className="display mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.2rem]">
                    {s.title}
                    <br />
                    <span className="italic text-bronze-300">{s.accent}</span>
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">{s.body}</p>

                  <ul className="mt-7 flex flex-col items-start gap-2.5" aria-label="Common questions">
                    {s.triggers.map((t) => (
                      <li key={t.question}>
                        <button
                          type="button"
                          onClick={() => open({ requirement: t.requirement, message: t.message })}
                          className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-2 pl-3 pr-4 text-left text-sm font-semibold text-ivory transition hover:border-bronze-300 hover:bg-white/10"
                        >
                          <MessageCircleQuestion className="h-4 w-4 shrink-0 text-bronze-300" aria-hidden="true" />
                          {t.question}
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-bronze-300 transition group-hover:translate-x-0.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => open()}>
                      Schedule a Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <Link href={s.link.href} className="btn btn-outline-light btn-lg">
                      {s.link.label}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {count > 1 && (
            <div className="mt-8 flex items-center gap-1">
              <SliderButton label="Previous slide" onClick={() => go(index - 1)}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </SliderButton>
              <div className="flex items-center">
                {slides.map((s, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
                      aria-current={active ? "true" : undefined}
                      className="group px-1.5 py-3"
                    >
                      <span
                        className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                          active ? "w-10 bg-white/20" : "w-4 bg-white/25 group-hover:bg-white/45"
                        }`}
                      >
                        {active && (
                          <span
                            key={`${index}-${auto}`}
                            className={`absolute inset-y-0 left-0 rounded-full bg-bronze-300 ${auto ? "animate-[hero-progress_7s_linear_forwards]" : "w-full"}`}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              <SliderButton label="Next slide" onClick={() => go(index + 1)}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </SliderButton>
              <SliderButton label={playing ? "Pause slides" : "Play slides"} onClick={() => setPlaying((p) => !p)}>
                {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
              </SliderButton>
            </div>
          )}
        </section>

        {footer}
      </div>

      <div className="relative min-w-0 animate-[rise_.9s_.15s_cubic-bezier(.2,.7,.2,1)_both]">
        {anyImage ? (
          <div className="grid">
            {slides.map((s, i) => (
              <div
                key={s.id}
                aria-hidden={i !== index}
                className={`[grid-area:1/1] transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
              >
                {s.image ? (
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    width={900}
                    height={1100}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 34rem, 100vw"
                    className="h-auto w-full rounded-[1.75rem] shadow-2xl"
                  />
                ) : (
                  visual
                )}
              </div>
            ))}
          </div>
        ) : (
          visual
        )}
      </div>
    </>
  );
}

function SliderButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ink-300 transition hover:border-bronze-300 hover:text-ivory"
    >
      {children}
    </button>
  );
}
