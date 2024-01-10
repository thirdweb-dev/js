import { Flex, ListItem, SimpleGrid, UnorderedList } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import React, { useState } from "react";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { WALLETS_SNIPPETS } from "./wallet-sdk";

const TRACKING_CATEGORY = "embedded-wallet";

const DashboardWalletsLocal: ThirdwebNextPage = () => {
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");

  return (
    <Flex flexDir="column" gap={10}>
      <Flex flexDir="column" gap={4}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12}>
          <Flex flexDir="column" gap={8}>
            <Heading size="title.lg" as="h1">
              Local Wallet
            </Heading>
            <Text>
              A local wallet is a low-level wallet that allows you to create
              wallets within your application or project. It is a non-custodial
              solution that simplifies the onboarding process and improves the
              user experience for web3 apps in two ways:
            </Text>

            <TrackedLink
              category={TRACKING_CATEGORY}
              label="learn-more"
              href="https://portal.thirdweb.com/references/wallets/latest/LocalWallet"
              color="blue.500"
              isExternal
            >
              Learn more about Local Wallets
            </TrackedLink>
          </Flex>
          {/*  <ChakraNextImage
            borderRadius="xl"
            src={require("public/assets/dashboard/wallets/smart-wallet.png")}
            alt=""
          /> */}
        </SimpleGrid>
      </Flex>

      <Flex flexDir="column" gap={4}>
        <Heading size="title.sm" as="h2">
          Integrate into your app
        </Heading>

        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={
            WALLETS_SNIPPETS.find((w) => w.id === "local-wallet")
              ?.supportedLanguages || {}
          }
        />
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
        <Card
          as={Flex}
          gap={4}
          flex={1}
          bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
          p={6}
        >
          <Flex flexDir={"column"} gap={2}>
            <Heading size="title.sm" as="h1">
              Docs
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="docs"
                  trackingProps={{ breakdown: "full-docs" }}
                  href="https://portal.thirdweb.com/references/wallets/latest/LocalWallet"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Full Docs
                </TrackedLink>
              </Text>
            </UnorderedList>
          </Flex>
        </Card>
        <Card
          as={Flex}
          flexDir={"row"}
          gap={4}
          flex={1}
          p={6}
          overflow="hidden"
          bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
        >
          <Flex flexDir={"column"} gap={2}>
            <Heading size="title.sm" as="h1">
              Local Wallet Guides
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="guides"
                  trackingProps={{ breakdown: "getting-started" }}
                  href="https://blog.thirdweb.com/guides/how-to-use-local-wallets/"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Getting started with Local Wallets
                </TrackedLink>
              </Text>
            </UnorderedList>
          </Flex>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

DashboardWalletsLocal.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="local" />
    {page}
  </AppLayout>
);

DashboardWalletsLocal.pageId = PageId.DashboardWalletsLocal;

export default DashboardWalletsLocal;
