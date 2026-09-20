"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BadgeCheck, CircleCheck, FileText, Lightbulb, MessageSquare, UserCheck, type LucideIcon } from "lucide-react";
import { loanCategories, type LoanCategory, type LoanProduct } from "@/content/loans";
import { useConsultation } from "@/components/consultation/ConsultationProvider";

// Maps each product to the lead-form requirement label.
const requirementFor: Record<string, string> = {
  "home-loan": "Home Loan",
  "loan-against-property": "Loan Against Property",
  "other-secured": "Other",
  "msme-loan": "MSME Loan",
  "business-loan": "Unsecured Business Loan",
  "other-unsecured": "Personal / Other Loan",
};

export function ProductTabs({ category }: { category: LoanCategory }) {
  const data = loanCategories[category];
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeSlug = data.products.some((p) => p.slug === params.get("product")) ? params.get("product")! : data.products[0].slug;
  const product = data.products.find((p) => p.slug === activeSlug)!;

  const select = (slug: string) => router.replace(`${pathname}?product=${slug}`, { scroll: false });

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = data.products[(i + dir + data.products.length) % data.products.length];
    select(next.slug);
    document.getElementById(`ptab-${next.slug}`)?.focus();
  };

  return (
    <div>
      <div className="sticky top-[4.5rem] z-20 -mx-5 border-b border-sand-200 bg-ivory/95 px-5 backdrop-blur md:mx-0 md:rounded-2xl md:border md:bg-white md:p-1.5">
        <div role="tablist" aria-label={`${data.title} products`} className="flex gap-1 overflow-x-auto">
          {data.products.map((p, i) => {
            const on = p.slug === activeSlug;
            return (
              <button
                key={p.slug}
                id={`ptab-${p.slug}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="product-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(p.slug)}
                onKeyDown={(e) => onKey(e, i)}
                className={`shrink-0 whitespace-nowrap px-4 py-3.5 text-sm font-bold transition md:flex-1 md:rounded-xl md:py-3 ${
                  on ? "border-b-2 border-bronze-500 text-ink-950 md:border-0 md:bg-ink-900 md:text-ivory" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div id="product-panel" role="tabpanel" aria-labelledby={`ptab-${activeSlug}`} className="pt-10">
        <ProductDetail key={product.slug} product={product} />
      </div>
    </div>
  );
}

function ProductDetail({ product }: { product: LoanProduct }) {
  const { open } = useConsultation();
  const requirement = requirementFor[product.slug];

  const enquire = (about?: string) =>
    open({
      type: "product-enquiry",
      variant: "full",
      title: `Enquire about ${about ?? product.name}`,
      subtitle: "Tell us a little about your requirement and an advisor will call you with options from multiple lenders.",
      requirement,
      message: about ? `Interested in: ${about}` : undefined,
      submitLabel: "Send enquiry",
    });

  return (
    <div className="animate-[rise_.45s_cubic-bezier(.2,.7,.2,1)_both]">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <h2 className="heading text-4xl text-ink-950 md:text-5xl">{product.name}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">{product.overview}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => enquire()} className="btn btn-primary">
              Enquire about {product.name.replace(/^Other /, "")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => open({ requirement })} className="btn btn-outline">
              Schedule a Consultation
            </button>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-sand-200 bg-sand-200">
          {product.highlights.map((h) => (
            <div key={h.label} className="bg-white p-4 sm:p-5">
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-500">{h.label}</dt>
              <dd className="mt-2 text-sm font-extrabold leading-snug text-ink-950 sm:text-base">{h.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {product.offerings && (
        <div className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-bronze-700">Products in this category</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.offerings.map((o) => (
              <div key={o.name} className="card flex flex-col p-5">
                <h3 className="font-extrabold text-ink-950">{o.name}</h3>
                <p className="mt-1 flex-1 text-sm text-ink-600">{o.text}</p>
                <button type="button" onClick={() => enquire(o.name)} className="link-arrow mt-4 self-start text-sm">
                  Enquire <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <InfoBlock icon={BadgeCheck} title="Key features" items={product.features} />
        <InfoBlock icon={UserCheck} title="Eligibility" items={product.eligibility} />
        <InfoBlock icon={FileText} title="Documents required" items={product.documents} />
        <InfoBlock icon={Lightbulb} title="Typical use cases" items={product.useCases} />
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.25rem] bg-ink-950 p-7 text-ivory md:flex-row md:items-center md:p-9">
        <div className="flex gap-4">
          <MessageSquare className="mt-1 h-6 w-6 shrink-0 text-bronze-300" aria-hidden="true" />
          <div>
            <p className="heading text-2xl">Not sure {product.name.toLowerCase().startsWith("other") ? "which product fits" : `if ${product.name} is right for you`}?</p>
            <p className="mt-1 text-ink-400">Speak to an advisor — we'll compare options across lenders before you apply anywhere.</p>
          </div>
        </div>
        <button type="button" onClick={() => open({ requirement })} className="btn btn-primary shrink-0">
          Schedule a Consultation
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-500">
        * Indicative. Final amount, tenure, rate and collateral requirements depend on the lender's policy and your profile.{" "}
        <Link href="/resources#emi-calculator" className="font-semibold text-bronze-700 underline underline-offset-2">
          Calculate your EMI
        </Link>
      </p>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <section className="card p-6 md:p-7">
      <h3 className="flex items-center gap-2.5 text-lg font-extrabold text-ink-950">
        <Icon className="h-5 w-5 text-bronze-600" aria-hidden="true" /> {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-ink-700">
            <CircleCheck className="mt-[3px] h-4 w-4 shrink-0 text-moss-500" aria-hidden="true" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}
