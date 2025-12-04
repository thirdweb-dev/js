"use client";

import { CodeIcon, WebhookIcon } from "lucide-react";
import { FeatureCard } from "./FeatureCard.client";

export function AdvancedSection({
  teamSlug,
  projectSlug,
}: {
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">Going Further</h2>
        <p className="text-muted-foreground text-sm">
          Advanced features to drive revenue in your app.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Customized Experience"
          description="Build your own branded experiences with the HTTP API or TypeScript SDK."
          icon={CodeIcon}
          setupTime={10}
          id="http_api"
          features={["Route discovery", "Real-time token prices"]}
          link={{
            href: "https://payments.thirdweb.com/reference",
            label: "Documentation",
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
            href: `/team/${teamSlug}/${projectSlug}/bridge/webhooks`,
            label: "Setup Webhooks",
          }}
        />
      </div>
    </section>
  );
}
