import Image from "next/image";
import Link from "next/link";

// Official AapkaLoan Financial Services logo (client artwork, 29 Sep), cut into
// mark / name / tagline PNGs in public/brand. The client asked for the logo to
// sit on white everywhere so its colours never change, so it always renders on
// a white plate — there is no recoloured version for dark backgrounds.
// Sizes keep the artwork's own proportions: tagline height is 0.6 × the name's,
// centred under it as in the original lockup.

export function Logo({ withTagline = true, className = "" }: { withTagline?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 shadow-[0_1px_3px_rgb(0_0_0/0.08)] sm:gap-2.5 sm:px-3 sm:py-2 ${className}`}
      aria-label="AapkaLoan Financial Services — Gain economic growth — home"
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={45}
        height={36}
        priority
        className="h-[30px] w-auto shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-9"
      />
      {/* width/height = largest rendered size, so next/image serves small files */}
      <span className="flex flex-col items-center gap-[4px] sm:gap-[5px]">
        <Image
          src="/brand/logo-name.png"
          alt="AapkaLoan Financial Services"
          width={238}
          height={10.5}
          priority
          className="h-[9px] w-auto sm:h-[10.5px]"
        />
        {withTagline && (
          <Image
            src="/brand/logo-tagline.png"
            alt="Gain economic growth"
            width={132}
            height={6.3}
            className="hidden h-[6.3px] w-auto sm:block"
          />
        )}
      </span>
    </Link>
  );
}
