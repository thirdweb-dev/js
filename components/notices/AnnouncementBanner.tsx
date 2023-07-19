import {
  Box,
  Container,
  Flex,
  Icon,
  IconButton,
  Img,
  SimpleGrid,
} from "@chakra-ui/react";
import { IconLogo } from "components/logo";
import { useLocalStorage } from "hooks/useLocalStorage";
import { FiArrowRight, FiX } from "react-icons/fi";
import { Heading, TrackedLink } from "tw-components";

export const AnnouncementBanner = () => {
  const [hasDismissedAnnouncement, setHasDismissedAnnouncement] =
    useLocalStorage("dismissed-paper-acquisition", false, true);

  if (hasDismissedAnnouncement) {
    return null;
  }

  return (
    <Box
      position="sticky"
      zIndex="10"
      py={3}
      bgImage="linear-gradient(145.96deg, #410AB6 5.07%, #7bdefe 100%)"
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
          isExternal
          href="https://blog.thirdweb.com/acquiring-paper"
          category="announcement"
          label="paper-acquisition"
        >
          <Container maxW="container.page" display="flex" px={0}>
            <Flex
              cursor="pointer"
              mx="auto"
              align="center"
              gap={{ base: 0.5, md: 2 }}
              color="white"
            >
              <SimpleGrid
                columns={3}
                placeItems="center"
                gap={0}
                display={{ base: "none", md: "grid" }}
              >
                <IconLogo boxSize={6} />
                <Icon as={FiX} boxSize={3} />
                <Img src="/logos/paper-logo-icon.svg" boxSize={6} />
              </SimpleGrid>
              <Heading
                size="label.lg"
                as="p"
                lineHeight={{ base: 1.5, md: undefined }}
                color="white"
                fontWeight={500}
              >
                <strong>
                  thirdweb acquires Paper, leading checkout and wallet solution.
                </strong>{" "}
                Learn more
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
