import { Box, CardProps, Center, Flex, Icon, Tooltip } from "@chakra-ui/react";
import {
  TrackedLinkButton,
  Heading,
  Card,
  Text,
  TrackedLinkButtonProps,
  Badge,
} from "tw-components";

import { IoCheckmarkCircle } from "react-icons/io5";
import { PLANS } from "utils/pricing";
import { AccountPlan } from "@3rdweb-sdk/react/hooks/useApi";
import { AiOutlineDollarCircle } from "react-icons/ai";

interface PricingCardProps {
  name: AccountPlan;
  ctaProps: TrackedLinkButtonProps;
  ctaTitle?: string;
  onHomepage?: boolean;
  cardProps?: CardProps;
  highlighted?: boolean;
  current?: boolean;
  size?: "sm" | "lg";
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  ctaTitle,
  ctaProps,
  cardProps,
  size = "lg",
  highlighted = false,
  current = false,
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
          <Text maxW={320}>{plan.description}</Text>
        </Flex>
        <Flex alignItems="flex-end" gap={2}>
          <Heading
            size={size === "lg" ? "title.2xl" : "title.md"}
            lineHeight={1}
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
      {ctaTitle && (
        <TrackedLinkButton
          variant="outline"
          py={6}
          label={name}
          size={size === "lg" ? "md" : "sm"}
          {...ctaProps}
        >
          {ctaTitle}
        </TrackedLinkButton>
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

interface FeatureItemProps {
  text: string | string[];
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => {
  const titleStr = Array.isArray(text) ? text[0] : text;

  return (
    <Flex gap={2} alignItems="flex-start">
      <Icon as={IoCheckmarkCircle} boxSize={5} mt={0.5} />{" "}
      {Array.isArray(text) ? (
        <Flex alignItems="center" justifyItems="center" gap={2}>
          <Text>{titleStr}</Text>
          <Tooltip
            label={
              <Card
                py={2}
                px={4}
                bgColor="backgroundHighlight"
                borderRadius="lg"
              >
                <Text size="label.sm" lineHeight={1.5}>
                  {text[1]}
                </Text>
              </Card>
            }
            p={0}
            bg="transparent"
            boxShadow="none"
          >
            <Box pt={1} display={{ base: "none", md: "block" }}>
              <Icon as={AiOutlineDollarCircle} boxSize={4} color="blue.500" />
            </Box>
          </Tooltip>
          <Text
            color="gray.700"
            minW="max-content"
            display={{ base: "block", md: "none" }}
          >
            {text[1]}
          </Text>
        </Flex>
      ) : (
        <Text>{titleStr}</Text>
      )}
    </Flex>
  );
};
