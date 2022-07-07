import { Box, Container, Flex, IconButton, SimpleGrid } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { LinkCard } from "components/link-card";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { Card, Heading } from "tw-components";
import { pushToPreviousRoute } from "utils/pushToPreviousRoute";

export default function DeployPrebuiltContract() {
  const router = useRouter();

  const { trackEvent } = useTrack();
  return (
    <Card px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
      <Flex direction="column" gap={8}>
        <Flex align="center" justify="space-between">
          <IconButton
            onClick={() => pushToPreviousRoute(router)}
            size="sm"
            aria-label="back"
            icon={<FiChevronLeft />}
          />
          <Heading size="title.lg">What do you want to build?</Heading>
          <Box />
        </Flex>
        <Container maxW="container.md">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 3, md: 5 }}>
            <LinkCard
              largeIcon
              bg="backgroundCardHighlight"
              borderWidth="2px"
              src={require("/public/assets/add-contract/drop.png")}
              alt="drop"
              href={`/contracts/new/pre-built/drop`}
              title="Release a drop"
              subtitle="Set up a drop that other people can mint, with an easy to use NFT batch upload"
              onClick={() =>
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-1",
                  type: "drop",
                })
              }
            />
            <LinkCard
              largeIcon
              bg="backgroundCardHighlight"
              borderWidth="2px"
              src={require("/public/assets/add-contract/nft.png")}
              alt="token"
              href={`/contracts/new/pre-built/token`}
              title="Create NFTs and Tokens"
              subtitle="Mint your own NFTs, packs and other tokens to transfer them or list them on a marketplace"
              onClick={() =>
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-1",
                  type: "token",
                })
              }
            />
            <LinkCard
              largeIcon
              bg="backgroundCardHighlight"
              borderWidth="2px"
              src={require("/public/assets/add-contract/marketplace.png")}
              alt="marketplace"
              href={`/contracts/new/pre-built/marketplace/marketplace`}
              title="Setup Marketplace"
              subtitle="Create marketplaces to list or auction both ERC721 and ERC1155 NFTs"
              onClick={() => {
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-1",
                  type: "marketplace",
                });
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-2",
                  contractType: "marketplace",
                });
              }}
            />
            <LinkCard
              largeIcon
              bg="backgroundCardHighlight"
              borderWidth="2px"
              src={require("/public/assets/add-contract/governance.png")}
              alt="governance"
              href={`/contracts/new/pre-built/governance`}
              title="Governance & Splits"
              subtitle="Establish decentralized governance or split revenue for your contracts"
              onClick={() =>
                trackEvent({
                  category: "ftux",
                  action: "click",
                  label: "step-1",
                  type: "governance",
                })
              }
            />
          </SimpleGrid>
        </Container>
      </Flex>
    </Card>
  );
}

DeployPrebuiltContract.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
