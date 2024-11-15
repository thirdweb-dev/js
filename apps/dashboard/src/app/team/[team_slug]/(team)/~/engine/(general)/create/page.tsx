"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import { accountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { ConfirmEngineTierDialog } from "app/team/[team_slug]/(team)/~/engine/(general)/create/ConfirmEngineTierDialog";
import { EngineTierCard } from "app/team/[team_slug]/(team)/~/engine/(general)/create/tier-card";
import { LazyAddPaymentMethod } from "components/onboarding/LazyOnboardingBilling";
import { TWModal } from "components/onboarding/Modal";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const trackEvent = useTrack();
  const router = useDashboardRouter();
  const [selectedTier, setSelectedTier] = useState<"STARTER" | "PREMIUM">();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const accountQuery = useAccount();
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  async function createEngineInstance(tier: "STARTER" | "PREMIUM") {
    trackEvent({
      category: "engine",
      action: "click",
      label: "clicked-cloud-hosted",
      tier: tier,
    });

    try {
      toast.info("Starting Engine deployment");

      const res = await fetch(
        `${THIRDWEB_API_HOST}/v1/engine/add-cloud-hosted`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            tier: tier,
          }),
        },
      );

      if (!res.ok) {
        if (res.status === 409) {
          toast.warning(
            "There is a pending Engine deployment. Please contact support@thirdweb.com if this takes longer than 2 hours.",
          );
          return;
        }

        const json = await res.json();
        const error =
          json.error?.message ??
          "Unexpected error. Please try again or visit https://thirdweb.com/support.";
        throw error;
      }

      toast.success(
        "Thank you! Your Engine deployment will begin shortly. You can view the progress in Overview page.",
      );
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div>
      {selectedTier && (
        <ConfirmEngineTierDialog
          tier={selectedTier}
          onOpenChange={setIsConfirmationDialogOpen}
          open={isConfirmationDialogOpen}
          onConfirm={async () => {
            setIsConfirmationDialogOpen(false);

            // If Payment is already setup, deploy the Engine
            if (accountQuery.data?.status === accountStatus.validPayment) {
              await createEngineInstance(selectedTier);
            } else {
              trackEvent({
                category: "engine",
                action: "click",
                label: "clicked-add-payment-method",
              });
              setIsBillingModalOpen(true);
            }
          }}
        />
      )}

      <TWModal isOpen={isBillingModalOpen}>
        <LazyAddPaymentMethod
          onSave={async () => {
            if (!selectedTier) {
              return;
            }

            await createEngineInstance(selectedTier);
            setIsBillingModalOpen(false);
          }}
          onCancel={() => setIsBillingModalOpen(false)}
        />
      </TWModal>

      <h1 className="mb-2 font-semibold text-2xl tracking-tight">
        Choose an Engine deployment
      </h1>

      <p className="mb-7 text-muted-foreground">
        Host Engine on thirdweb with no setup or maintenance required.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <EngineTierCard
          tier="STARTER"
          onClick={() => {
            setSelectedTier("STARTER");
            setIsConfirmationDialogOpen(true);
          }}
        />

        <EngineTierCard
          tier="PREMIUM"
          isPrimaryCta
          onClick={() => {
            setSelectedTier("PREMIUM");
            setIsConfirmationDialogOpen(true);
          }}
        />

        <EngineTierCard
          tier="ENTERPRISE"
          previousTier="Premium Engine"
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "click",
              label: "clicked-cloud-hosted",
              tier: "ENTERPRISE",
            });
            router.push("/contact-us");
          }}
        />
      </div>
    </div>
  );
}
