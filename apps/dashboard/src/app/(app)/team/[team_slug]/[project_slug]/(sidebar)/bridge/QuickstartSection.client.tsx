"use client";

import { CodeIcon, WebhookIcon } from "lucide-react";
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
          title="Bridge Widget"
          description="Integrate cross-chain swaps and fiat onramp into your app using bridge widget"
          icon={CodeIcon}
          id="fees"
          features={[
            "Integrate with iframe, script, or React component",
            "Cross-chain token swaps across 85+ blockchains",
            "Fiat onramp support to buy tokens with credit/debit cards",
          ]}
          link={{
            href: `https://portal.thirdweb.com/bridge/bridge-widget`,
            label: "Get Started",
          }}
        />

        <FeatureCard
          title="Webhooks"
          description="Create Webhooks to get notified on each purchase or transaction."
          icon={WebhookIcon}
          id="webhooks"
          features={["Instant events", "Transaction verification"]}
          link={{
            href: `/team/${props.teamSlug}/${props.projectSlug}/bridge/webhooks`,
            label: "Setup Webhooks",
          }}
        />
      </div>
    </section>
  );
}
