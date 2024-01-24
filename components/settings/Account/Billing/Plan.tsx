import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Badge, Text, TrackedLink } from "tw-components";
import { Flex, HStack } from "@chakra-ui/react";
import { PLANS } from "utils/pricing";

interface BillingPlanProps {
  account: Account;
  direction?: "column" | "row";
  description?: string;
  titleSize?: "body.md" | "label.lg";
  titleColor?: string;
}

export const BillingPlan: React.FC<BillingPlanProps> = ({
  account,
  description,
  titleSize = "body.md",
  titleColor = "GrayText",
  direction = "row",
}) => {
  return (
    <Flex direction={direction} gap={3}>
      <HStack>
        <Text color={titleColor} size={titleSize}>
          Your current plan is
        </Text>
        <Badge
          borderRadius="md"
          size="label.sm"
          textTransform="capitalize"
          px={3}
          py={1.5}
        >
          {(PLANS as any)[account.plan].title}
        </Badge>
      </HStack>

      <HStack>
        {description && <Text>{description}</Text>}

        <TrackedLink
          href="/pricing"
          category="billingAccount"
          label="learn-more-pricing"
          color="blue.500"
        >
          <Text size="body.md" color="blue.500">
            Learn more
          </Text>
        </TrackedLink>
      </HStack>
    </Flex>
  );
};
