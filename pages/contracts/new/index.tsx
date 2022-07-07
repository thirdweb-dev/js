import { Box, Container, Flex, IconButton, SimpleGrid } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { LinkCard } from "components/link-card";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { Card, Heading } from "tw-components";

export default function DeployContract() {
  const router = useRouter();
  const { trackEvent } = useTrack();
  return (
    <Card px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
      <Flex direction="column" gap={8}>
        <Flex align="center" justify="space-between">
          <IconButton
            onClick={() => router.push("/dashboard")}
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />
          <Heading size="title.lg">What do you want to deploy?</Heading>
          <Box />
        </Flex>
        <Container maxW="container.md">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 3, md: 5 }}>
            <LinkCard
              largeIcon
              bg="backgroundCardHighlight"
              borderWidth="2px"
              src={require("/public/assets/add-contract/tw-publish.png")}
              alt="custom"
              href="/contracts/new/custom"
              title="My contracts"
              subtitle="Publish custom contracts so you can deploy them at any time."
              onClick={() =>
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-0",
                  type: "custom",
                })
              }
            />
            <LinkCard
              largeIcon
              bg="backgroundCardHighlight"
              borderWidth="2px"
              src={require("/public/assets/add-contract/drop.png")}
              alt="token"
              href="/contracts/new/pre-built"
              title="Pre-built contracts"
              subtitle="From NFT Drop to payment splitters to marketplaces."
              onClick={() =>
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-0",
                  type: "pre-built",
                })
              }
            />
          </SimpleGrid>
        </Container>
      </Flex>
    </Card>
  );
}

DeployContract.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
