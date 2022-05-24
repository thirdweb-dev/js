import { Flex, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { Heading, Text } from "tw-components";

interface ContractCardProps {
  icon: string;
  title: string;
  description: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  icon,
  title,
  description,
}) => {
  const { trackEvent } = useTrack();
  return (
    <Flex
      as={LinkBox}
      border="1px solid"
      borderColor="#ffffff26"
      py={3}
      px={4}
      borderRadius="lg"
      backgroundColor="#0000004d"
      flexDir="column"
      gap={2}
      _hover={{ borderColor: "primary.600", textDecoration: "none" }}
    >
      <Flex align="center" gap={2}>
        <ChakraNextImage
          src={require(`/public/assets/tw-icons/${icon}.png`)}
          alt={title}
          boxSize={7}
          flexShrink={0}
        />
        <LinkOverlay
          href={`https://portal.thirdweb.com/pre-built-contracts/${icon}`}
          isExternal
          onClick={() =>
            trackEvent({
              category: "pre-built-contract",
              action: "click",
              label: title.toLowerCase(),
            })
          }
        >
          <Heading as="h4" size="subtitle.sm" fontWeight="600" color="gray.50">
            {title}
          </Heading>
        </LinkOverlay>
      </Flex>

      <Text size="body.md" display={{ base: "none", md: "inherit" }}>
        {description}
      </Text>
    </Flex>
  );
};
