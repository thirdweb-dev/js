import {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { Text } from "tw-components";
import { format } from "date-fns";
import { useMemo } from "react";
import { VStack } from "@chakra-ui/react";

interface BillingPeriodProps {
  account: Account;
  usage: UsageBillableByService | undefined;
}

export const BillingPeriod: React.FC<BillingPeriodProps> = ({
  account,
  usage,
}) => {
  const totalUsd = useMemo(() => {
    let total = 0;

    Object.values(usage?.billableUsd || {}).forEach((amount) => {
      total += amount;
    });

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(total);
  }, [usage]);

  if (
    !account.currentBillingPeriodStartsAt ||
    !account.currentBillingPeriodEndsAt
  ) {
    return null;
  }

  return (
    <VStack alignItems={{ base: "flex-start", lg: "flex-end" }} gap={1}>
      <Text size="body.md" as="span">
        Current billing period:
        <Text as="span" color="bgBlack" pl={2} fontWeight="medium">
          {format(
            new Date(account.currentBillingPeriodStartsAt as string),
            "MMM dd",
          )}{" "}
          {` - `}
          {format(
            new Date(account.currentBillingPeriodEndsAt as string),
            "MMM dd",
          )}{" "}
        </Text>
      </Text>

      <Text>
        Total upcoming bill:
        <Text as="span" color="bgBlack" pl={2} fontWeight="medium">
          {totalUsd}
        </Text>
      </Text>
    </VStack>
  );
};
