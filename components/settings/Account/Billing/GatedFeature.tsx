import { Box, Flex, HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { FiLock } from "react-icons/fi";
import { Card, Heading, Text, TrackedLinkButton } from "tw-components";
import Image from "next/image";
import { ReactNode } from "react";
import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";

interface GatedFeatureProps {
  children: ReactNode;
  title?: string;
  description?: ReactNode;
  imgSrc?: string;
  imgWidth?: number;
  imgHeight?: number;
  trackingLabel?: string;
}

export const GatedFeature: React.FC<GatedFeatureProps> = ({
  children,
  title,
  description,
  imgSrc,
  imgWidth,
  imgHeight,
  trackingLabel,
}) => {
  const meQuery = useAccount();
  const { data: account } = meQuery;

  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  if (!account) {
    return null;
  }

  if (account.advancedEnabled) {
    return children;
  }

  if (!title) {
    return null;
  }

  return (
    <Card
      pt={{ base: 4, lg: 8 }}
      pb={{ base: 8, lg: 8 }}
      px={{ base: 4, lg: 8, xl: 16 }}
      bg={bg}
    >
      <Flex
        flexDir={{ base: "column-reverse", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={8}
      >
        <Flex
          flexDir="column"
          gap={6}
          alignItems={{ base: "center", lg: "flex-start" }}
        >
          <Flex flexDir="column" gap={2}>
            <HStack
              gap={2}
              alignItems="center"
              justifyContent={{ base: "center", lg: "flex-start" }}
            >
              <Icon as={FiLock} opacity={0.3} boxSize={4} />
              <Text size="label.md" opacity={0.5}>
                Advanced feature
              </Text>
            </HStack>
            <Heading size="title.md" textAlign={{ base: "center", lg: "left" }}>
              {title}
            </Heading>
          </Flex>

          <Text size="body.lg" textAlign={{ base: "center", lg: "left" }}>
            {description}
          </Text>

          <Box>
            <TrackedLinkButton
              colorScheme="primary"
              category="advancedFeature"
              label={trackingLabel}
              href="/dashboard/settings/billing"
              borderRadius="lg"
              py={6}
              px={6}
            >
              Upgrade to Growth
            </TrackedLinkButton>
          </Box>
        </Flex>
        {imgSrc && (
          <Box overflow="hidden">
            <Image
              src={imgSrc}
              width={imgWidth}
              height={imgHeight}
              alt={trackingLabel ?? ""}
            />
          </Box>
        )}
      </Flex>
    </Card>
  );
};
