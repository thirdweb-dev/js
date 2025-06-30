import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";
import { EcosystemWalletPricingCard } from "./components/pricing-card";

export async function EcosystemCreatePage(props: {
  teamSlug: string;
  teamId: string;
}) {
  return (
    <div>
      <div className="border-border py-8 border-b">
        <div className="container max-w-5xl">
          <h1 className="font-semibold text-3xl tracking-tight mb-1">
            Create Ecosystem
          </h1>
          <p className="text-muted-foreground">
            Ecosystem Wallets enable your users to seamlessly access their
            assets across various apps and games within your ecosystem.
            <br /> You can control which apps join your ecosystem and how their
            users interact with your wallet.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/connect/ecosystems/overview"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more
            </UnderlineLink>
          </p>
        </div>
      </div>

      <div className="flex flex-col grow container max-w-5xl pb-20 pt-8">
        <div className="flex flex-col rounded-lg border bg-card lg:flex-row">
          <CreateEcosystemForm
            teamId={props.teamId}
            teamSlug={props.teamSlug}
          />
          <EcosystemWalletPricingCard />
        </div>
      </div>
    </div>
  );
}
