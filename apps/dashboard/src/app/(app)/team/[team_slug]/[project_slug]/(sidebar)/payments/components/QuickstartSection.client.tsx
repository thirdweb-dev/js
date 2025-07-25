"use client";

import { BadgeDollarSignIcon, CodeIcon, LinkIcon } from "lucide-react";
import { FeatureCard } from "./FeatureCard.client";

export function QuickStartSection({
  teamSlug,
  projectSlug,
}: {
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">Quick Start</h2>
        <p className="text-muted-foreground text-sm">
          Choose how to integrate payments into your project.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Create Payment Links"
          description="Create shareable URLs to receive any token in seconds."
          icon={LinkIcon}
          id="payment_links"
          color="violet"
          badge={{
            label: "New",
            variant: "success",
          }}
          setupTime={1}
          features={[
            "No coding required",
            "Get paid in any token",
            "Send instantly",
          ]}
          link={{
            href: `/team/${teamSlug}/${projectSlug}/payments/links`,
            label: "Create Link",
          }}
        />
        <FeatureCard
          title="Earn Fees"
          description="Setup fees to earn any time a user swaps or bridges funds."
          icon={BadgeDollarSignIcon}
          id="fees"
          setupTime={1}
          color="violet"
          features={[
            "Fees on every purchase",
            "Custom percentage",
            "Directly to your wallet",
          ]}
          link={{
            href: `/team/${teamSlug}/${projectSlug}/payments/settings`,
            label: "Configure Fees",
          }}
        />
        <FeatureCard
          title="UI Components"
          description="Instantly add payments to your React app with prebuild components."
          icon={CodeIcon}
          id="components"
          color="violet"
          setupTime={2}
          features={[
            "Drop-in components",
            "Supports custom user data",
            "Transactions, products, and direct payments",
          ]}
          link={{
            href: "https://portal.thirdweb.com/payments/products",
            label: "Get Started",
            target: "_blank",
          }}
        />
      </div>
    </section>
  );
}
