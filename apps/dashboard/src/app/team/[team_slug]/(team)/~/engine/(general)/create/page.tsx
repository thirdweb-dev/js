import { EngineTierCard } from "./tier-card";

export default function Page() {
  return (
    <div>
      <h1 className="mb-2 font-semibold text-2xl tracking-tight">
        Choose an Engine deployment
      </h1>

      <p className="mb-7 text-muted-foreground">
        Host Engine on thirdweb with no setup or maintenance required.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <EngineTierCard tier="STARTER" />
        <EngineTierCard tier="PREMIUM" isPrimaryCta />
        <EngineTierCard tier="ENTERPRISE" previousTier="Premium Engine" />
      </div>
    </div>
  );
}
