import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { RocketIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../@/components/ui/button";
import { useDashboardRouter } from "../../../@/lib/DashboardRouter";
import { AppLayout } from "../../../components/app-layouts/app";
import { EngineSidebar } from "../../../components/engine/EngineSidebar";
import {
  EngineTierCard,
  MONTHLY_PRICE_USD,
} from "../../../components/engine/tier-card";
import { LazyOnboardingBilling } from "../../../components/onboarding/LazyOnboardingBilling";
import { OnboardingModal } from "../../../components/onboarding/Modal";
import { THIRDWEB_API_HOST } from "../../../constants/urls";
import { useTrack } from "../../../hooks/analytics/useTrack";
import { PageId } from "../../../page-id";
import type { ThirdwebNextPage } from "../../../utils/types";

const Page: ThirdwebNextPage = () => {
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
            if (accountQuery.data?.status === AccountStatus.ValidPayment) {
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

      <OnboardingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      >
        <LazyOnboardingBilling
          onSave={async () => {
            if (!selectedTier) {
              return;
            }

            await createEngineInstance(selectedTier);
            setIsBillingModalOpen(false);
          }}
          onCancel={() => setIsBillingModalOpen(false)}
        />
      </OnboardingModal>

      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        Choose an Engine deployment
      </h1>

      <p className="text-muted-foreground mb-7">
        Host Engine on thirdweb with no setup or maintenance required
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
};

// Confirmation Dialog for confirming the selected Engine Tier

const ConfirmEngineTierDialog = (props: {
  tier: "STARTER" | "PREMIUM";
  onConfirm: () => void;
  onOpenChange: (v: boolean) => void;
  open: boolean;
}) => {
  const { tier, onConfirm, open, onOpenChange } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="leading-snug pr-4">
            Are you sure you want to deploy a{" "}
            {tier === "STARTER" ? "Standard" : "Premium"} Engine?
          </DialogTitle>

          <DialogDescription>
            You will be charged ${MONTHLY_PRICE_USD[tier]} per month for the
            subscription
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="primary" className="gap-2">
            <RocketIcon className="size-3" />
            Deploy now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

Page.pageId = PageId.EngineCreate;

export default Page;

Page.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <EngineSidebar />
    {page}
  </AppLayout>
);
