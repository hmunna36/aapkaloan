import { Building2, Handshake, Landmark, Layers, Rocket, School, type LucideProps } from "lucide-react";
import type { FundingSolution } from "@/content/funding";

const map = { landmark: Landmark, building: Building2, rocket: Rocket, handshake: Handshake, school: School, layers: Layers };

export function FundingIcon({ name, ...props }: { name: FundingSolution["icon"] } & LucideProps) {
  const Icon = map[name];
  return <Icon aria-hidden="true" {...props} />;
}
