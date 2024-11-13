import { Badge } from "@/components/ui/badge";
import { type AccountPlan, accountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { Box, type CardProps, Flex } from "@chakra-ui/react";
import {
  Card,
  Heading,
  Text,
  TrackedLinkButton,
  type TrackedLinkButtonProps,
} from "tw-components";
import { PLANS } from "utils/pricing";
import { remainingDays } from "../../../utils/date-utils";
import { FeatureItem } from "./FeatureItem";
import { UpgradeModal } from "./UpgradeModal";

interface PricingCardProps {
  name: AccountPlan;
  ctaProps: TrackedLinkButtonProps;
  ctaTitle?: string;
  ctaHint?: string;
  onDashboard?: boolean;
  cardProps?: CardProps;
  highlighted?: boolean;
  current?: boolean;
  canTrialGrowth?: boolean;
  size?: "sm" | "lg";
  activeTrialEndsAt?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  ctaTitle,
  ctaHint,
  ctaProps,
  cardProps,
  onDashboard,
  size = "lg",
  highlighted = false,
  current = false,
  canTrialGrowth = false,
  activeTrialEndsAt,
}) => {
  const plan = PLANS[name];
  const isCustomPrice = typeof plan.price === "string";

  const remainingTrialDays =
    (activeTrialEndsAt ? remainingDays(activeTrialEndsAt) : 0) || 0;

  const content = (
    <Card
      w="full"
      as={Flex}
      gap={10}
      flexDir="column"
      p={{ base: 6, md: 10 }}
      zIndex={999}
      background={highlighted ? "black" : "transparent"}
      borderColor={current ? "blue.500" : "gray.900"}
      {...cardProps}
    >
      <Flex flexDir="column" gap={6}>
        <Flex flexDir="column" gap={3}>
          <div className="flex flex-row items-center gap-2">
            <Heading
              as="h3"
              size={size === "lg" ? "title.lg" : "title.sm"}
              textTransform="capitalize"
            >
              {plan.title}
            </Heading>
            {current && <Badge className="capitalize">Current plan</Badge>}
          </div>
          <Text maxW={320} h={12}>
            {plan.description}
          </Text>
        </Flex>
        <Flex direction="column" gap={0.5}>
          <Flex alignItems={{ base: "center", md: "flex-end" }} gap={2}>
            <Heading
              size={size === "lg" ? "title.2xl" : "title.md"}
              lineHeight={1}
            >
              {isCustomPrice ? (
                plan.price
              ) : canTrialGrowth ? (
                <>
                  <Box as="span" textDecor="line-through" opacity={0.4}>
                    ${plan.price}
                  </Box>{" "}
                  $0
                </>
              ) : (
                `$${plan.price}`
              )}
            </Heading>

            {!isCustomPrice && <Text size="body.lg">/ month</Text>}
          </Flex>
          {remainingTrialDays > 0 && (
            <Text size="body.sm" fontStyle="italic">
              Your free trial will{" "}
              {remainingTrialDays > 1
                ? `end in ${remainingTrialDays} days.`
                : "end today."}
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex
        flexDir="column"
        gap={3}
        grow={1}
        alignItems="flex-start"
        className="!text-foreground"
      >
        {plan.subTitle && (
          <Text className="!text-foreground" fontWeight="medium">
            {plan.subTitle}
          </Text>
        )}

        {plan.features.map((f) => (
          <FeatureItem key={Array.isArray(f) ? f[0] : f} text={f} />
        ))}
      </Flex>
      {name === accountPlan.growth && onDashboard ? (
        <UpgradeModal
          name={name}
          ctaProps={ctaProps}
          ctaTitle={ctaTitle}
          ctaHint={ctaHint}
          canTrialGrowth={canTrialGrowth}
        />
      ) : (
        <Flex flexDir="column" gap={3} position="relative" mb={3}>
          {ctaTitle && (
            <>
              <TrackedLinkButton
                variant="outline"
                py={6}
                label={ctaProps.label ?? name}
                size={size === "lg" ? "md" : "sm"}
                {...ctaProps}
              >
                {ctaTitle}
              </TrackedLinkButton>
              {ctaHint && (
                <Text
                  textAlign="center"
                  size="body.sm"
                  w="full"
                  position={{ base: "static", xl: "absolute" }}
                  top={ctaTitle ? 14 : -9}
                >
                  {ctaHint}
                </Text>
              )}
            </>
          )}
        </Flex>
      )}
    </Card>
  );

  if (highlighted) {
    return (
      <div className="-m-2 relative flex items-center justify-center p-2">
        <Box
          position="absolute"
          bgGradient="linear(to-b, #4DABEE, #692AC1)"
          top={0}
          left={0}
          bottom={0}
          right={0}
          borderRadius="3xl"
          overflow="visible"
          filter="blur(8px)"
        />
        {content}
      </div>
    );
  }

  return content;
};
