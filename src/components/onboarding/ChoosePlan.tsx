import { SimpleGrid } from "@chakra-ui/react";
import { OnboardingTitle } from "./Title";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useTrack } from "hooks/analytics/useTrack";
import { AccountPlan, useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";

interface OnboardingChoosePlanProps {
  onSave: () => void;
}

export const OnboardingChoosePlan: React.FC<OnboardingChoosePlanProps> = ({
  onSave,
}) => {
  const trackEvent = useTrack();
  const mutation = useUpdateAccount();

  const handleSave = (plan: AccountPlan) => {
    trackEvent({
      category: "account",
      action: "choosePlan",
      label: "attempt",
    });

    // free is default, so no need to update account
    if (plan === AccountPlan.Free) {
      trackEvent({
        category: "account",
        action: "choosePlan",
        label: "success",
        data: {
          plan,
        },
      });

      onSave();
      return;
    }

    mutation.mutate(
      {
        plan,
      },
      {
        onSuccess: () => {
          onSave();

          trackEvent({
            category: "account",
            action: "choosePlan",
            label: "success",
            data: {
              plan,
            },
          });
        },
        onError: (error) => {
          trackEvent({
            category: "account",
            action: "choosePlan",
            label: "error",
            error,
          });
        },
      },
    );
  };

  return (
    <>
      <OnboardingTitle
        heading="Choose your plan"
        description="Get started for free with our Starter plan or subscribe to Growth plan to unlock higher rate limits and advanced features."
      />
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        <PricingCard
          size="sm"
          name={AccountPlan.Free}
          ctaTitle="Get started for free"
          ctaProps={{
            category: "account",
            onClick: (e) => {
              e.preventDefault();
              handleSave(AccountPlan.Free);
            },
            label: "freePlan",
            href: "/",
          }}
          onDashboard
        />

        <PricingCard
          size="sm"
          name={AccountPlan.Growth}
          ctaTitle={"Get started"}
          ctaProps={{
            category: "account",
            label: "growthPlan",
            onClick: (e) => {
              e.preventDefault();
              handleSave(AccountPlan.Growth);
            },
            href: "/",
            variant: "solid",
            colorScheme: "blue",
          }}
          onDashboard
        />
      </SimpleGrid>
    </>
  );
};
