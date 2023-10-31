import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Divider,
  Flex,
  Icon,
  LinkBox,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Badge, Card, Heading, Text, TrackedLinkOverlay } from "tw-components";

export const EngineHostingOptionsCta: React.FC = () => {
  const meQuery = useAccount();

  const earlyAccessRequestformUrl = `https://share.hsforms.com/1k5tu00ueS5OYMaxHK6De-gea58c?email=${
    meQuery.data?.email || ""
  }&thirdweb_account_id=${meQuery.data?.id || ""}`;

  return (
    <>
      <Divider />

      <Text fontStyle="italic">Don&apos;t have Engine running yet?</Text>

      <SimpleGrid columns={2} gap={8}>
        <LinkBox>
          <Card
            p={10}
            _hover={{
              borderColor: "blue.500",
            }}
            transitionDuration="200ms"
            h="full"
          >
            <Stack spacing={4}>
              <Badge
                variant="outline"
                w="fit-content"
                colorScheme="gray"
                rounded="md"
                size="label.sm"
              >
                Free
              </Badge>
              <TrackedLinkOverlay
                href="https://portal.thirdweb.com/engine/getting-started"
                isExternal
                category="engine"
                label="clicked-self-host-instructions"
              >
                <Flex align="center" gap={2}>
                  <Heading size="title.sm">Self-host Engine</Heading>
                  <Icon as={FiArrowRight} boxSize={6} />
                </Flex>
              </TrackedLinkOverlay>

              <Text>
                Host Engine on your own infrastructure with minimal setup.
              </Text>
            </Stack>
          </Card>
        </LinkBox>

        <LinkBox>
          <Card
            p={10}
            _hover={{
              borderColor: "blue.500",
            }}
            transitionDuration="200ms"
            h="full"
          >
            <Stack spacing={4}>
              <Badge
                variant="outline"
                w="fit-content"
                colorScheme="gray"
                rounded="md"
                size="label.sm"
              >
                $99 / month
              </Badge>
              <TrackedLinkOverlay
                href={earlyAccessRequestformUrl}
                isExternal
                category="engine"
                label="clicked-request-early-access"
              >
                <Flex align="center" gap={2}>
                  <Heading size="title.sm">
                    Request a cloud-hosted Engine
                  </Heading>
                  <Icon as={FiArrowRight} boxSize={6} />
                </Flex>
              </TrackedLinkOverlay>

              <Text>
                Host Engine on thirdweb-managed infrastructure with no setup.
              </Text>
            </Stack>
          </Card>
        </LinkBox>
      </SimpleGrid>
    </>
  );
};
