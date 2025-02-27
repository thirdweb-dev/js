import { EngineTierCard } from "./tier-card";

export default function Page() {
  return (
    <div className="pb-20">
      <h1 className="mb-1 font-semibold text-2xl tracking-tight">
        Choose an Engine deployment
      </h1>

      <p className="mb-8 text-muted-foreground text-sm">
        Host Engine on thirdweb with no setup or maintenance required
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <EngineTierCard tier="STARTER" />
        <EngineTierCard tier="PREMIUM" isPrimaryCta />
        <EngineTierCard tier="ENTERPRISE" previousTier="Premium Engine" />
      </div>
    </div>
  );
}
