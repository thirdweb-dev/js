import { SimpleGrid } from "@chakra-ui/react";
import { Account, AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useMemo } from "react";
import { CONTACT_US_URL } from "utils/pricing";
import { remainingDays } from "utils/date-utils";

interface BillingPricingProps {
  account: Account;
  onSelect: (plan: AccountPlan) => void;
  validPayment: boolean;
  loading: boolean;
  canTrialGrowth?: boolean;
}

export const BillingPricing: React.FC<BillingPricingProps> = ({
  account,
  onSelect,
  validPayment,
  loading,
  canTrialGrowth,
}) => {
  const isPro = [AccountPlan.Pro, AccountPlan.Enterprise].includes(
    account.plan,
  );

  const freeCtaTitle = useMemo(() => {
    if (!validPayment) {
      return "Add payment method";
    }
    if (account.plan !== AccountPlan.Free) {
      return "Downgrade";
    }
  }, [account, validPayment]);

  const growthCtaTitle = useMemo(() => {
    const trialTitle = "Claim your 1-month free";

    if (!validPayment) {
      return canTrialGrowth ? trialTitle : "Get started";
    }
    // pro/enterprise cant change plan
    if (isPro) {
      return "Contact us";
    }

    if (account.plan === AccountPlan.Free) {
      return canTrialGrowth ? trialTitle : "Upgrade";
    }
  }, [account, validPayment, isPro, canTrialGrowth]);

  const trialPeriodDays = useMemo(() => {
    let days = undefined;

    // can trial growth and not pro
    if (canTrialGrowth && !isPro) {
      days = 30;
    }
    // already has trial period
    else if (
      account.trialPeriodEndedAt &&
      account.plan === AccountPlan.Growth
    ) {
      days = remainingDays(account.trialPeriodEndedAt);
    }

    if (!days) {
      return undefined;
    }

    return `Your free trial will end in ${days} days.`;
  }, [account, canTrialGrowth, isPro]);

  const handleSelect = (plan: AccountPlan) => {
    onSelect(plan);
  };

  return (
    <SimpleGrid columns={{ base: 1, xl: 3 }} gap={{ base: 6, xl: 8 }}>
      <PricingCard
        current={account.plan === AccountPlan.Free}
        size="sm"
        name={AccountPlan.Free}
        ctaTitle={freeCtaTitle}
        ctaProps={{
          onClick: (e) => {
            e.preventDefault();
            handleSelect(AccountPlan.Free);
          },
          isLoading: loading,
          isDisabled: loading,
          category: "account",
          label: "freePlan",
          href: "/pricing",
        }}
      />

      <PricingCard
        current={account.plan === AccountPlan.Growth}
        size="sm"
        name={AccountPlan.Growth}
        ctaTitle={growthCtaTitle}
        ctaHint={trialPeriodDays}
        striked={canTrialGrowth}
        ctaProps={{
          onClick: (e) => {
            e.preventDefault();
            handleSelect(AccountPlan.Growth);
          },
          isLoading: loading,
          isDisabled: loading,
          category: "account",
          label: "growthPlan",
          href: "/pricing",
          variant: "solid",
          colorScheme: "blue",
        }}
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
      />
    </SimpleGrid>
  );
};
