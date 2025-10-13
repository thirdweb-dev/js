"use client";

import { Button } from "@workspace/ui/components/button";
import {
  BadgeDollarSignIcon,
  CodeIcon,
  LinkIcon,
  PlusIcon,
} from "lucide-react";
import { CreatePaymentLinkButton } from "../links/components/CreatePaymentLinkButton.client";
import { FeatureCard } from "./FeatureCard.client";

export function QuickStartSection(props: {
  teamSlug: string;
  projectSlug: string;
  clientId: string;
  teamId: string;
  projectWalletAddress?: string;
  authToken: string;
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
          title="Create Payments"
          description="Create hosted payment UIs to receive any token in seconds."
          icon={LinkIcon}
          id="payment_links"
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
          action={
            <CreatePaymentLinkButton
              clientId={props.clientId}
              projectWalletAddress={props.projectWalletAddress}
              teamId={props.teamId}
              authToken={props.authToken}
            >
              <Button
                className="w-full gap-2 group text-foreground bg-background"
                variant="outline"
              >
                <PlusIcon className="size-4" />
                Create Payment Link
              </Button>
            </CreatePaymentLinkButton>
          }
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
          title="UI Components"
          description="Instantly add payments to your React app with prebuilt components."
          icon={CodeIcon}
          id="components"
          setupTime={2}
          features={[
            "Drop-in components",
            "Supports custom user data",
            "Transactions, products, and direct payments",
          ]}
          link={{
            href: "https://portal.thirdweb.com/payments/products",
            label: "Get Started",
          }}
        />
      </div>
    </section>
  );
}
