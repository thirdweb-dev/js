import { Box, CardProps, Center, Flex } from "@chakra-ui/react";
import {
  TrackedLinkButton,
  Heading,
  Card,
  Text,
  TrackedLinkButtonProps,
  Badge,
} from "tw-components";

import { PLANS } from "utils/pricing";
import { AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
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
}) => {
  const plan = PLANS[name];
  const isCustomPrice = typeof plan.price === "string";

  const content = (
    <Card
      w="full"
      as={Flex}
      gap={10}
      flexDir="column"
      p={{ base: 6, md: 10 }}
      h="full"
      zIndex={999}
      background={highlighted ? "black" : "transparent"}
      borderColor={current ? "blue.500" : "gray.900"}
      {...cardProps}
    >
      <Flex flexDir="column" gap={6}>
        <Flex flexDir="column" gap={3}>
          <Flex gap={2}>
            <Heading
              as="h3"
              size={size === "lg" ? "title.lg" : "title.sm"}
              textTransform="capitalize"
            >
              {plan.title}
            </Heading>
            {current && (
              <Badge
                borderRadius="md"
                size="label.sm"
                px={3}
                py={1.5}
                textTransform="capitalize"
              >
                Current plan
              </Badge>
            )}
          </Flex>
          <Text maxW={320} h={12}>
            {plan.description}
          </Text>
        </Flex>
        <Flex alignItems={{ base: "center", md: "flex-end" }} gap={2}>
          <Heading
            size={size === "lg" ? "title.2xl" : "title.md"}
            lineHeight={1}
            textDecor={canTrialGrowth ? "line-through" : "none"}
          >
            {!isCustomPrice && "$"}
            {plan.price}
          </Heading>
          {!isCustomPrice && <Text size="body.lg">/ month</Text>}
        </Flex>
      </Flex>
      <Flex
        flexDir="column"
        gap={3}
        grow={1}
        alignItems="flex-start"
        color="accent.900"
      >
        {plan.subTitle && (
          <Text color="accent.900" fontWeight="medium">
            {plan.subTitle}
          </Text>
        )}

        {plan.features.map((f) => (
          <FeatureItem key={f} text={f} />
        ))}
      </Flex>
      {name === AccountPlan.Growth && onDashboard ? (
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
            <TrackedLinkButton
              variant="outline"
              py={6}
              label={ctaProps.label ?? name}
              size={size === "lg" ? "md" : "sm"}
              {...ctaProps}
            >
              {ctaTitle}
            </TrackedLinkButton>
          )}
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
        </Flex>
      )}
    </Card>
  );

  if (highlighted) {
    return (
      <Center position="relative" p={0.5} mt={-0.5} mb={-0.5}>
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
      </Center>
    );
  }

  return content;
};
