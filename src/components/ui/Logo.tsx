import Image from "next/image";
import Link from "next/link";

// Official Aapka Loan logo, cut from the brand artwork into transparent PNGs
// (public/brand). "-light" variants swap the brown for ivory for dark backgrounds.
// Sizes keep the artwork's own proportions: the tagline sits at ~40% of the
// wordmark's height, exactly as in the original lockup.

export function Logo({
  tone = "dark",
  withTagline = true,
  className = "",
}: {
  tone?: "dark" | "light";
  withTagline?: boolean;
  className?: string;
}) {
  const v = tone === "light" ? "-light" : "";
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Aapka Loan — Gain economic growth — home">
      <Image
        src={`/brand/logo-mark${v}.png`}
        alt=""
        width={59}
        height={44}
        priority
        className="h-10 w-auto shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-11"
      />
      {/* width/height = rendered size, so next/image serves small files */}
      <span className="flex flex-col gap-[5px]">
        <Image src={`/brand/logo-wordmark${v}.png`} alt="Aapka Loan" width={147} height={18} priority className="h-4 w-auto sm:h-[18px]" />
        {withTagline && (
          <Image
            src={`/brand/logo-tagline${v}.png`}
            alt="Gain economic growth"
            width={133}
            height={8}
            className="h-[6.5px] w-auto opacity-90 sm:h-[7.5px]"
          />
        )}
      </span>
    </Link>
  );
}
