import { Box, Container, Flex, Icon, IconButton } from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { FiArrowRight, FiX } from "react-icons/fi";
import { Heading, TrackedLink } from "tw-components";

export const AnnouncementBanner = () => {
  const [hasDismissedAnnouncement, setHasDismissedAnnouncement] =
    useLocalStorage("dismissed-announcement", false);

  if (hasDismissedAnnouncement.data || hasDismissedAnnouncement.isLoading) {
    return null;
  }

  return (
    <Box
      position="sticky"
      zIndex="10"
      py={3}
      bgImage="linear-gradient(95.15deg, #AA2F2F 3.36%, #6600FF 68.25%)"
    >
      <Flex w="full" justifyContent="space-between" alignItems="center">
        <Box ml={4} />
        <TrackedLink
          href="https://twitter.com/thirdweb/status/1562842674679652352"
          category="landingpage"
          label="announcement-tweet"
          isExternal
        >
          <Container maxW="container.page" display="flex">
            <Flex
              cursor="pointer"
              mx="auto"
              align="center"
              gap={{ base: 0.5, md: 2 }}
              color="white"
            >
              <Heading
                size="label.lg"
                as="p"
                lineHeight={{ base: 1.5, md: undefined }}
                color="white"
              >
                Announcing our{" "}
                <Box as="span" display={{ base: "none", md: "inline" }}>
                  $24m
                </Box>{" "}
                Series A: Accelerating the adoption of web3 with Haun Ventures,
                Coinbase Ventures, and Shopify
              </Heading>
              <Icon as={FiArrowRight} />
            </Flex>
          </Container>
        </TrackedLink>
        <IconButton
          size="xs"
          mr={4}
          aria-label="Close announcement"
          icon={<FiX />}
          color="white"
          variant="ghost"
          onClick={() => setHasDismissedAnnouncement(true)}
        />
      </Flex>
    </Box>
  );
};
