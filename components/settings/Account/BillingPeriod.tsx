import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Heading, Text } from "tw-components";
import { format } from "date-fns";

interface BillingPeriodProps {
  account: Account;
}

export const BillingPeriod: React.FC<BillingPeriodProps> = ({ account }) => {
  if (
    !account.currentBillingPeriodStartsAt ||
    !account.currentBillingPeriodEndsAt
  ) {
    return null;
  }

  return (
    <Heading as="h3" size="label.md">
      <Text size="body.md" as="span" pr={2}>
        Billing period:
      </Text>
      {format(
        new Date(account.currentBillingPeriodStartsAt as string),
        "MMM dd",
      )}{" "}
      {` - `}
      {format(
        new Date(account.currentBillingPeriodEndsAt as string),
        "MMM dd",
      )}{" "}
    </Heading>
  );
};
