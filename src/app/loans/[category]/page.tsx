import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/Section";
import { ProductTabs } from "@/components/loans/ProductTabs";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";
import { loanCategories, type LoanCategory } from "@/content/loans";

type Params = { category: string };

export function generateStaticParams() {
  return Object.keys(loanCategories).map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const c = loanCategories[category as LoanCategory];
  if (!c) return {};
  return {
    title: c.title,
    description: `${c.summary} ${c.products.map((p) => p.name).join(", ")}.`,
    alternates: { canonical: `/loans/${category}` },
  };
}

export default async function LoanCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = loanCategories[category as LoanCategory];
  if (!c) notFound();
  const other = (category === "secured" ? "unsecured" : "secured") as LoanCategory;

  return (
    <>
      <PageHero
        eyebrow={c.kicker}
        title={c.title}
        intro={c.summary}
        crumbs={[{ label: "Home", href: "/" }, { label: "Loans", href: "/loans" }, { label: c.title }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ConsultButton className="btn btn-primary btn-lg">Schedule a Consultation</ConsultButton>
          <Link href={`/loans/${other}`} className="btn btn-outline-light btn-lg">
            View {loanCategories[other].title} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-400">
          <span className="font-bold text-ink-300">Best for:</span> {c.bestFor}
        </p>
      </PageHero>

      <section className="py-12 md:py-16">
        <div className="container-x">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-sand-100" />}>
            <ProductTabs category={category as LoanCategory} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
