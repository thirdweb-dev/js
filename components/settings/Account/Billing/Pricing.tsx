import { SimpleGrid } from "@chakra-ui/react";
import { Account, AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useMemo } from "react";
import { CONTACT_US_URL } from "utils/pricing";

interface BillingPricingProps {
  account: Account;
  onSelect: (plan: AccountPlan) => void;
  validPayment: boolean;
  loading: boolean;
}

export const BillingPricing: React.FC<BillingPricingProps> = ({
  account,
  onSelect,
  validPayment,
  loading,
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
    if (!validPayment) {
      return "Get started";
    }
    // pro/enterprise cant change plan
    if (isPro) {
      return "Contact us";
    }

    if (account.plan === AccountPlan.Free) {
      return "Upgrade";
    }
  }, [account, validPayment, isPro]);

  const proCtaTitle = useMemo(() => {
    if (!validPayment) {
      return "Add payment method";
    }

    if (!isPro) {
      return "Contact us";
    }
  }, [isPro, validPayment]);

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
        ctaTitle={proCtaTitle}
        ctaProps={{
          category: "account",
          label: "growthPlan",
          href: CONTACT_US_URL,
          ...(validPayment
            ? { isExternal: true }
            : {
                onClick: (e) => {
                  e.preventDefault();
                  handleSelect(AccountPlan.Pro);
                },
              }),
        }}
      />
    </SimpleGrid>
  );
};
