import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";
import { EcosystemWalletPricingCard } from "./components/pricing-card";

export async function EcosystemCreatePage(props: {
  teamSlug: string;
  teamId: string;
}) {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <main className="container max-w-5xl py-20">
        <div className="flex flex-col rounded-lg border bg-card lg:flex-row">
          <CreateEcosystemForm
            teamId={props.teamId}
            teamSlug={props.teamSlug}
          />
          <EcosystemWalletPricingCard />
        </div>
      </main>
    </div>
  );
}
