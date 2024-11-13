import { Badge } from "@/components/ui/badge";
import { useAccount, useAccountCredits } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { Card, Heading, Text } from "tw-components";
import { PLANS } from "utils/pricing";
import { CreditsItem } from "./CreditsItem";

export const BillingPlanCard = () => {
  const { data: credits } = useAccountCredits();
  const { data: account } = useAccount();

  const opCredit = credits?.find((crd) => crd.name.startsWith("OP -"));
  const restCredits = credits?.filter((crd) => !crd.name.startsWith("OP -"));

  if (!account) {
    return null;
  }

  return (
    <Card as={Flex} flexDir="column" gap={2}>
      <div className="flex flex-row items-center gap-2">
        <Heading size="title.xs">Your current plan is</Heading>
        <Badge className="capitalize">
          {PLANS[account.plan as keyof typeof PLANS].title}
        </Badge>
      </div>

      <Flex flexDir="column" gap={4}>
        <Text size="body.md" />
        <CreditsItem credit={opCredit} isOpCreditDefault={true} />
        {restCredits?.map((credit) => (
          <CreditsItem key={credit.couponId} credit={credit} />
        ))}
      </Flex>
    </Card>
  );
};
