import { Flex, HStack } from "@chakra-ui/react";
import { Card, Badge, Text, Heading } from "tw-components";
import { useAccount, useAccountCredits } from "@3rdweb-sdk/react/hooks/useApi";
import { CreditsItem } from "./CreditsItem";
import { PLANS } from "utils/pricing";

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
      <HStack>
        <Heading size="title.xs">Your current plan is</Heading>
        <Badge
          borderRadius="md"
          size="label.sm"
          textTransform="capitalize"
          px={3}
          py={1.5}
        >
          {PLANS[account.plan as keyof typeof PLANS].title}
        </Badge>
      </HStack>

      <Flex flexDir="column" gap={4}>
        <Text size="body.md"></Text>
        <CreditsItem credit={opCredit} isOpCreditDefault={true} />
        {restCredits?.map((credit) => (
          <CreditsItem key={credit.couponId} credit={credit} />
        ))}
      </Flex>
    </Card>
  );
};
