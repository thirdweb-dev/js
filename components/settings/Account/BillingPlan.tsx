import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Badge, Text, TrackedLink } from "tw-components";
import { Flex, HStack } from "@chakra-ui/react";

const PLAN_TITLE = {
  free: "Starter",
  enterprise: "Pro",
};

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
    <Flex direction={direction} gap={2}>
      <HStack>
        <Text color={titleColor} size={titleSize}>
          Your current plan is
        </Text>
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

      <HStack>
        {description && <Text>{description}</Text>}

        <TrackedLink
          href="/pricing"
          category="billing"
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
