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

const DashboardWalletsEmbedded: ThirdwebNextPage = () => {
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");

  return (
    <Flex flexDir="column" gap={10} mt={{ base: 2, md: 6 }}>
      <Flex flexDir="column" gap={4}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12}>
          <Flex flexDir="column" gap={8}>
            <Heading size="title.lg" as="h1">
              Embedded Wallet
            </Heading>
            <Text>
              A wallet infrastructure that enables apps to create, manage, and
              control their users&apos; wallets. Email login, social login, and
              bring-your-own auth supported.
            </Text>

            <TrackedLink
              category={TRACKING_CATEGORY}
              label="learn-more"
              href="https://portal.thirdweb.com/wallet/paper"
              color="blue.500"
              isExternal
            >
              Learn more about Embedded Wallets
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
            WALLETS_SNIPPETS.find((w) => w.id === "paper")
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
                  href="https://docs.withpaper.com/reference/embedded-wallet-service-overview"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Full Docs
                </TrackedLink>
              </Text>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="docs"
                  trackingProps={{ breakdown: "integration-guide" }}
                  href="https://docs.withpaper.com/reference/embedded-wallet-service-integration"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Integration guide
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
              Embedded Wallet Guides
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="guides"
                  trackingProps={{ breakdown: "how-to-user-paper" }}
                  href="https://blog.thirdweb.com/guides/how-to-use-paper-wallet/"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  How to use Paper Wallet
                </TrackedLink>
              </Text>
            </UnorderedList>
          </Flex>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

DashboardWalletsEmbedded.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="embedded" />
    {page}
  </AppLayout>
);

DashboardWalletsEmbedded.pageId = PageId.DashboardWalletsEmbedded;

export default DashboardWalletsEmbedded;
