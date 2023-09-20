import {
  Container,
  Flex,
  SimpleGrid,
  Center,
  Icon,
  Box,
} from "@chakra-ui/react";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  TrackedLinkButton,
  Heading,
  Card,
  Text,
  TrackedLink,
} from "tw-components";

interface PricingSectionProps {
  TRACKING_CATEGORY: string;
  onHomepage?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  TRACKING_CATEGORY,
  onHomepage,
}) => {
  return (
    <Container maxW="max-content">
      <Flex flexDir="column" pt={{ base: 8, lg: 24 }} gap={{ base: 8, md: 24 }}>
        <Flex flexDir="column" gap={8}>
          <Heading
            as="h1"
            size="display.md"
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            Simple, transparent & flexible{" "}
            <Box bgGradient="linear(to-r, #4DABEE, #692AC1)" bgClip="text">
              pricing for every team.
            </Box>
          </Heading>
          {onHomepage && (
            <Text>
              Learn more about{" "}
              <TrackedLink
                category={TRACKING_CATEGORY}
                href="/pricing"
                label="pricing-plans"
              >
                pricing plans
              </TrackedLink>
              .
            </Text>
          )}
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Card
            as={Flex}
            gap={10}
            flexDir="column"
            borderColor="gray.900"
            p={{ base: 6, md: 10 }}
            h="full"
            maxH={{ base: "100%", md: "85%" }}
          >
            <Flex flexDir="column" gap={8}>
              <Flex flexDir="column" gap={4}>
                <Heading as="h3" size="title.lg">
                  Starter
                </Heading>
                <Text>
                  Ideal for individuals and small teams <br /> who require basic
                  features.
                </Text>
              </Flex>
              <Flex alignItems="flex-end" gap={2}>
                <Heading size="title.2xl" color="white">
                  $0
                </Heading>
                <Heading size="title.sm" color="gray.800" mb={1}>
                  / month
                </Heading>
              </Flex>
            </Flex>
            <Flex flexDir="column" gap={2}>
              <CheckmarkItem text="RPCs & Storage Gateway" />
              <CheckmarkItem text="Storage Pinning (First 50GB free)" />
              <CheckmarkItem text="NFT Checkout" />
              <CheckmarkItem text="Email Wallets" />
              <CheckmarkItem text="Device Wallets" />
              <CheckmarkItem text="Smart Wallets" />
            </Flex>
            <TrackedLinkButton
              variant="outline"
              borderColor="gray.900"
              py={6}
              category={TRACKING_CATEGORY}
              label="starter"
              href="/dashboard/settings/billing"
            >
              Get Started
            </TrackedLinkButton>
          </Card>
          <Center mt={-2}>
            <Center p={2} position="relative" mb={6}>
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

              <Card
                zIndex={999}
                background="black"
                as={Flex}
                gap={10}
                flexDir="column"
                borderColor="gray.900"
                p={{ base: 6, md: 10 }}
              >
                <Flex flexDir="column" gap={8}>
                  <Flex flexDir="column" gap={4}>
                    <Heading as="h3" size="title.lg">
                      Pro
                    </Heading>
                    <Text>
                      Ideal for teams that require more <br />
                      customization, SLAs, and support.
                    </Text>
                  </Flex>
                  <Flex alignItems="flex-end" gap={2}>
                    <Heading size="title.2xl" color="white">
                      $999+
                    </Heading>
                    <Heading size="title.sm" color="gray.800" mb={1}>
                      / month
                    </Heading>
                  </Flex>
                </Flex>
                <Flex flexDir="column" gap={2}>
                  <Text color="white">
                    Everything in Free Plan Bundle, plus:
                  </Text>
                  <CheckmarkItem text="Higher rate limits for RPC" />
                  <CheckmarkItem text="Higher rate limits for Storage Gateway" />
                  <CheckmarkItem text="Higher storage pinning file size for IPFS" />
                  <CheckmarkItem text="Higher transaction limit for checkout" />
                  <CheckmarkItem text="99.9% Infrastructure uptime SLAs" />
                  <CheckmarkItem text="24 hour customer support SLAs" />
                  <CheckmarkItem text="Dedicated Slack support channel" />
                </Flex>
                <TrackedLinkButton
                  bgColor="white"
                  _hover={{
                    bgColor: "white",
                    opacity: 0.8,
                  }}
                  color="black"
                  py={6}
                  category={TRACKING_CATEGORY}
                  label="pro"
                  href="/contact-us"
                >
                  Contact Sales
                </TrackedLinkButton>
              </Card>
            </Center>
          </Center>
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

interface CheckmarkItemProps {
  text: string;
}

const CheckmarkItem: React.FC<CheckmarkItemProps> = ({ text }) => (
  <Flex gap={2} alignItems="center">
    <Icon as={IoCheckmarkCircle} boxSize={5} />{" "}
    <Text color="gray.600">{text}</Text>
  </Flex>
);
