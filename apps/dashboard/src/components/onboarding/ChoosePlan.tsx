import {
  type AccountPlan,
  accountPlan,
  useUpdateAccountPlan,
} from "@3rdweb-sdk/react/hooks/useApi";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useTrack } from "hooks/analytics/useTrack";
import { TitleAndDescription } from "./Title";

interface OnboardingChoosePlanProps {
  onSave: () => void;
}

const OnboardingChoosePlan: React.FC<OnboardingChoosePlanProps> = ({
  onSave,
}) => {
  const trackEvent = useTrack();
  const mutation = useUpdateAccountPlan();

  const handleSave = (plan: AccountPlan) => {
    trackEvent({
      category: "account",
      action: "choosePlan",
      label: "attempt",
    });

    // free is default, so no need to update account
    if (plan === accountPlan.free) {
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
      <TitleAndDescription
        heading="Choose your plan"
        description="Get started for free with our Starter plan or subscribe to Growth plan to unlock higher rate limits and advanced features."
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PricingCard
          size="sm"
          name={accountPlan.free}
          ctaTitle="Get started for free"
          ctaProps={{
            category: "account",
            onClick: (e) => {
              e.preventDefault();
              handleSave(accountPlan.free);
            },
            label: "freePlan",
            href: "/",
          }}
          onDashboard
        />

        <PricingCard
          size="sm"
          ctaTitle="Claim your 1-month free"
          name={accountPlan.growth}
          ctaHint="Your free trial will end after 30 days."
          canTrialGrowth={true}
          ctaProps={{
            category: "account",
            label: "growthPlan",
            onClick: (e) => {
              e.preventDefault();
              handleSave(accountPlan.growth);
            },
            href: "/",
            variant: "solid",
            colorScheme: "blue",
          }}
          onDashboard
        />
      </div>
    </>
  );
};

export default OnboardingChoosePlan;
