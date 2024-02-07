import { SimpleGrid } from "@chakra-ui/react";
import { AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useMemo } from "react";
import { CONTACT_US_URL } from "utils/pricing";
import { remainingDays } from "utils/date-utils";

interface BillingPricingProps {
  plan: AccountPlan;
  validPayment: boolean;
  paymentVerification: boolean;
  invalidPayment: boolean;
  loading: boolean;
  canTrialGrowth?: boolean;
  trialPeriodEndedAt?: string;
  onSelect: (plan: AccountPlan) => void;
}

export const BillingPricing: React.FC<BillingPricingProps> = ({
  plan,
  validPayment,
  paymentVerification,
  invalidPayment,
  trialPeriodEndedAt,
  loading,
  canTrialGrowth,
  onSelect,
}) => {
  const isPro = [AccountPlan.Pro, AccountPlan.Enterprise].includes(plan);

  const freeCtaTitle = useMemo(() => {
    if (!validPayment) {
      return "Get started for free";
    }
    if (plan !== AccountPlan.Free) {
      return "Downgrade";
    }
  }, [plan, validPayment]);

  const growthCtaTitle = useMemo(() => {
    const trialTitle = "Claim your 1-month free";

    if (!validPayment) {
      return canTrialGrowth ? trialTitle : "Get started";
    }
    // pro/enterprise cant change plan
    if (isPro) {
      return "Contact us";
    }

    if (plan === AccountPlan.Free) {
      return canTrialGrowth ? trialTitle : "Upgrade";
    }
  }, [validPayment, isPro, plan, canTrialGrowth]);

  const trialPeriodDays = useMemo(() => {
    let days = undefined;

    // can trial growth and not pro
    if (canTrialGrowth && !isPro) {
      days = 30;
    }
    // already has trial period
    else if (trialPeriodEndedAt && plan === AccountPlan.Growth) {
      days = remainingDays(trialPeriodEndedAt);
    }

    if (!days) {
      return undefined;
    }

    return `Your free trial will end in ${days} days.`;
  }, [canTrialGrowth, isPro, plan, trialPeriodEndedAt]);

  const handleSelect = (newPlan: AccountPlan) => {
    onSelect(newPlan);
  };

  return (
    <SimpleGrid columns={{ base: 1, xl: 3 }} gap={{ base: 6, xl: 8 }}>
      <PricingCard
        current={plan === AccountPlan.Free}
        size="sm"
        name={AccountPlan.Free}
        ctaTitle={freeCtaTitle}
        ctaProps={{
          onClick: (e) => {
            e.preventDefault();
            handleSelect(AccountPlan.Free);
          },
          isLoading: loading,
          isDisabled: loading || invalidPayment || paymentVerification,
          category: "account",
          label: "freePlan",
          href: "/pricing",
        }}
        onDashboard
      />

      <PricingCard
        current={plan === AccountPlan.Growth}
        size="sm"
        name={AccountPlan.Growth}
        ctaTitle={growthCtaTitle}
        ctaHint={trialPeriodDays}
        canTrialGrowth={canTrialGrowth}
        ctaProps={{
          onClick: (e) => {
            e.preventDefault();
            handleSelect(AccountPlan.Growth);
          },
          isLoading: loading,
          isDisabled: loading || invalidPayment || paymentVerification,
          category: "account",
          label: canTrialGrowth ? "claimGrowthTrial" : "growthPlan",
          href: "/pricing",
          variant: "solid",
          colorScheme: "blue",
        }}
        onDashboard
      />

      <PricingCard
        current={isPro}
        size="sm"
        name={AccountPlan.Pro}
        ctaTitle="Contact us"
        ctaProps={{
          category: "account",
          label: "proPlan",
          href: CONTACT_US_URL,
          isExternal: true,
        }}
        onDashboard
      />
    </SimpleGrid>
  );
};
