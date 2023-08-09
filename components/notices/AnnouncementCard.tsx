import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { Container, Flex, HStack } from "@chakra-ui/react";
import { useLocalStorage } from "hooks/useLocalStorage";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedLinkButton,
} from "tw-components";

export const AnnouncementCard = () => {
  const [hasDismissedAnnouncement] = useLocalStorage(
    "dismissed-api-keys",
    false,
    true,
  );
  const { data: apiKeys, isLoading, error } = useApiKeys();
  const hasApiKeys = (apiKeys || []).length > 0;

  // Should never happen, but just in case.
  if (error) {
    console.error(error);
    return null;
  }

  if (hasDismissedAnnouncement || isLoading || hasApiKeys) {
    return null;
  }

  return (
    <Card
      p={6}
      bg="linear-gradient(147.15deg, #410AB6 30.17%, #D45CFF 100.01%)"
    >
      <Flex w="full" justifyContent="space-between" gap={{ base: 1, md: 2 }}>
        <Container maxW="container.page" display="flex" px={0}>
          <Flex gap={4} color="white" flexDir="column">
            <Flex flexDir="column" gap={3}>
              <Heading size="label.lg" as="p" color="white">
                thirdweb services now require an API key
              </Heading>
              <Text color="white">
                Action <strong>required</strong> for all users: use of client
                API keys is now <strong>mandatory</strong> to continue using
                thirdweb infrastructure services.
              </Text>
            </Flex>
            <HStack alignItems="center" gap={4}>
              <LinkButton variant="solid" href="/dashboard/settings/api-keys">
                Create API Key
              </LinkButton>

              <TrackedLinkButton
                href="https://blog.thirdweb.com/changelog/api-keys-to-access-thirdweb-infra"
                category="announcement"
                label="api-keys"
                variant="link"
              >
                Learn More
              </TrackedLinkButton>
            </HStack>
          </Flex>
        </Container>

        {/* <IconButton
          size="xs"
          aria-label="Close announcement"
          icon={<FiX />}
          variant="ghost"
          onClick={() => setHasDismissedAnnouncement(true)}
        /> */}
      </Flex>
    </Card>
  );
};
