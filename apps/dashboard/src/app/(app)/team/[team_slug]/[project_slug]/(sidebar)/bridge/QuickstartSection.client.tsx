"use client";

import {
  ArrowRightLeftIcon,
  BadgeDollarSignIcon,
  WebhookIcon,
} from "lucide-react";
import { FeatureCard } from "../payments/components/FeatureCard.client";

export function QuickStartSection(props: {
  teamSlug: string;
  projectSlug: string;
  clientId: string;
  teamId: string;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">Get Started</h2>
        <p className="text-muted-foreground text-sm">
          Integrate bridge into your project and enable seamless cross-chain
          swaps
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Cross-chain Swap Tokens"
          icon={ArrowRightLeftIcon}
          setupTime={5}
          id="swap_tokens"
          features={["Swap any token", "Cross-chain swaps"]}
          description="Swap tokens cross-chain with dedicated swapping endpoints."
          link={{
            href: `https://portal.thirdweb.com/payments/swap`,
            label: "Setup Swaps",
          }}
        />

        <FeatureCard
          title="Earn Fees"
          description="Setup fees to earn any time a user swaps or bridges funds."
          icon={BadgeDollarSignIcon}
          id="fees"
          setupTime={1}
          features={[
            "Fees on every purchase",
            "Custom percentage",
            "Directly to your wallet",
          ]}
          link={{
            href: `/team/${props.teamSlug}/${props.projectSlug}/settings/payments`,
            label: "Configure Fees",
          }}
        />

        <FeatureCard
          title="Webhooks"
          description="Create Webhooks to get notified on each purchase or transaction."
          icon={WebhookIcon}
          setupTime={5}
          id="webhooks"
          features={["Instant events", "Transaction verification"]}
          link={{
            href: `/team/${props.teamSlug}/${props.projectSlug}/webhooks/payments`,
            label: "Setup Webhooks",
          }}
        />
      </div>
    </section>
  );
}
