import Link from "next/link";
import { PageHero } from "@/components/ui/Section";
import { ConsultButton } from "@/components/consultation/ConsultationProvider";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Page not found"
      title="This page has moved — or never existed."
      intro="The page you were looking for isn't here. Try one of these instead, or talk to an advisor."
    >
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary btn-lg">Go to homepage</Link>
        <Link href="/loans" className="btn btn-outline-light btn-lg">Explore loans</Link>
        <ConsultButton className="btn btn-outline-light btn-lg">Schedule a Consultation</ConsultButton>
      </div>
    </PageHero>
  );
}
