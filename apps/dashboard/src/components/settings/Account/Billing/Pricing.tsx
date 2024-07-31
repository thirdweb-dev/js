import { AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { SimpleGrid } from "@chakra-ui/react";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useMemo } from "react";
import { CONTACT_US_URL } from "utils/pricing";

interface BillingPricingProps {
  plan: string;
  trialPeriodEndedAt: string | undefined;
  canTrialGrowth: boolean;
  validPayment: boolean;
  paymentVerification: boolean;
  invalidPayment: boolean;
  loading: boolean;
  onSelect: (plan: AccountPlan) => void;
}

export const BillingPricing: React.FC<BillingPricingProps> = ({
  plan,
  trialPeriodEndedAt,
  canTrialGrowth,
  validPayment,
  paymentVerification,
  invalidPayment,
  loading,
  onSelect,
}) => {
  const isPro = [AccountPlan.Pro, AccountPlan.Enterprise].includes(
    plan as AccountPlan,
  );

  const freeCtaTitle = useMemo(() => {
    if (!validPayment) {
      return "Get started for free";
    }
    if (plan !== AccountPlan.Free) {
      return "Downgrade";
    }

    return undefined;
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

    return undefined;
  }, [validPayment, isPro, plan, canTrialGrowth]);

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
        activeTrialEndsAt={
          plan === AccountPlan.Growth ? trialPeriodEndedAt : undefined
        }
        current={plan === AccountPlan.Growth}
        size="sm"
        name={AccountPlan.Growth}
        ctaTitle={growthCtaTitle}
        ctaHint="Your free trial will end after 30 days."
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
