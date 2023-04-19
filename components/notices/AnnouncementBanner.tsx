import { Box, Container, Flex, Icon, IconButton } from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { FiArrowRight, FiX } from "react-icons/fi";
import { Heading, TrackedLink } from "tw-components";

export const AnnouncementBanner = () => {
  const [hasDismissedAnnouncement, setHasDismissedAnnouncement] =
    useLocalStorage("dismissed-learn-announcement", false, true);

  if (hasDismissedAnnouncement) {
    return null;
  }

  return (
    <Box
      position="sticky"
      zIndex="10"
      py={3}
      bgImage="linear-gradient(145.96deg, rgba(205, 0, 238, 1) 5.07%, #1652F0 100%)"
    >
      <Flex
        w="full"
        justifyContent="space-between"
        alignItems="center"
        gap={{ base: 1, md: 2 }}
        px={4}
      >
        <Box display={{ base: "none", md: "block" }} />
        <TrackedLink
          href="https://discord.gg/thirdweb"
          category="announcement"
          label="learn-announcement"
        >
          <Container maxW="container.page" display="flex" px={0}>
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
                fontWeight={500}
              >
                <strong>thirdweb Community:</strong> Join our community to stay
                updated!
              </Heading>
              <Icon display={{ base: "none", md: "block" }} as={FiArrowRight} />
            </Flex>
          </Container>
        </TrackedLink>

        <IconButton
          size="xs"
          aria-label="Close announcement"
          icon={<FiX />}
          colorScheme="blackAlpha"
          color={{ base: "white", md: "black" }}
          variant="ghost"
          onClick={() => setHasDismissedAnnouncement(true)}
        />
      </Flex>
    </Box>
  );
};
