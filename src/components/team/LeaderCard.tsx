import Image from "next/image";
import type { Leader } from "@/content/team";
import { LinkedInIcon } from "@/components/ui/BrandIcons";

export function LinkedInButton({ leader, className = "" }: { leader: Leader; className?: string }) {
  if (!leader.linkedin) {
    // Rendered as inert until the real URL is added in src/content/team.ts
    return (
      <span aria-disabled="true" title="LinkedIn link to be added" className={`btn btn-outline btn-sm cursor-default opacity-60 ${className}`}>
        <LinkedInIcon /> View LinkedIn Profile
      </span>
    );
  }
  return (
    <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className={`btn btn-outline btn-sm ${className}`}>
      <LinkedInIcon /> View LinkedIn Profile
    </a>
  );
}

export function LeaderCard({ leader, priority = false }: { leader: Leader; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-sand-100">
        <Image
          src={leader.photo}
          alt={`${leader.name}, ${leader.designation} at AapKaLoan`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent" aria-hidden="true" />
        <p className="absolute bottom-4 left-4 rounded-full bg-ivory/95 px-3 py-1 text-xs font-bold text-ink-900 backdrop-blur">
          <span className="num">{leader.experienceYears}</span> yrs experience
        </p>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="heading text-2xl text-ink-950">{leader.name}</h3>
        <p className="mt-1 text-sm font-semibold text-bronze-700">{leader.designation}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Areas of expertise">
          {leader.expertise.map((e) => (
            <li key={e} className="chip">
              {e}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <LinkedInButton leader={leader} />
        </div>
      </div>
    </article>
  );
}
