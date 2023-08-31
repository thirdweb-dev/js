import {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { Badge, Text } from "tw-components";
import { HStack } from "@chakra-ui/react";
import { useMemo } from "react";

const PLAN_TITLE = {
  free: "Starter",
  enterprise: "Pro",
};

interface BillingUsageProps {
  account: Account;
  usage: UsageBillableByService | undefined;
}

export const BillingUsage: React.FC<BillingUsageProps> = ({
  account,
  usage: usageData,
}) => {
  const totalUsd = useMemo(() => {
    let total = 0;

    Object.values(usageData?.billableUsd || {}).forEach((amount) => {
      total += amount;
    });

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(total);
  }, [usageData]);

  return (
    <HStack gap={4}>
      <HStack>
        <Text size="label.md">Your current plan:</Text>
        <Badge
          borderRadius="full"
          size="label.sm"
          variant="subtle"
          px={3}
          py={1.5}
        >
          {(PLAN_TITLE as any)[account.plan]}
        </Badge>
      </HStack>

      <Text size="label.md">Total upcoming bill: {totalUsd}</Text>
    </HStack>
  );
};
