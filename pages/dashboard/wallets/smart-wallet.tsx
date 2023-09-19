import { Flex, ListItem, SimpleGrid, UnorderedList } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ContractWithMetadata, useAddress } from "@thirdweb-dev/react";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import React, { useMemo } from "react";
import { ChakraNextImage } from "components/Image";
import invariant from "tiny-invariant";
import { ContractCard } from "components/explore/contract-card";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeyTable/Alerts";
import { FactoryContracts } from "components/contract-components/tables/factory-contracts";

const TRACKING_CATEGORY = "smart-wallet";

const useFactories = () => {
  const walletAddress = useAddress();
  const contracts = useMultiChainRegContractList(walletAddress);
  return useQuery(
    [
      "dashboard-registry",
      walletAddress,
      "multichain-contract-list",
      "factories",
    ],
    async () => {
      invariant(contracts.data, "contracts.data should be defined");

      const contractWithExtensions = await Promise.all(
        contracts.data.map(async (c) => {
          const extensions =
            "extensions" in c ? await c.extensions().catch(() => []) : [];
          return extensions.includes("AccountFactory") ? c : null;
        }),
      );

      return contractWithExtensions.filter((f) => f !== null);
    },
    {
      enabled: !!walletAddress && !!contracts.data && contracts.data.length > 0,
    },
  );
};
export type SmartWalletFormData = {
  chainAndFactoryAddress: string;
  clientId: string;
};

const accountFactories = [
  "thirdweb.eth/AccountFactory",
  "thirdweb.eth/DynamicAccountFactory",
  "thirdweb.eth/ManagedAccountFactory",
];

const DashboardWalletsSmartWallet: ThirdwebNextPage = () => {
  const address = useAddress();
  const factories = useFactories();
  const keysQuery = useApiKeys();
  const meQuery = useAccount();
  const account = meQuery?.data;
  const apiKeys = keysQuery?.data;

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    if (!account || !apiKeys) {
      return;
    }

    return apiKeys.find(
      (k) =>
        k.services?.find(
          (s) => account.status !== "validPayment" && s.name === "bundler",
        ),
    );
  }, [apiKeys, account]);

  return (
    <Flex flexDir="column" gap={10} mt={{ base: 2, md: 6 }}>
      {address && hasSmartWalletsWithoutBilling && <SmartWalletsBillingAlert />}

      <Flex flexDir="column" gap={4}>
        <Heading size="title.lg" as="h1">
          Smart Wallet
        </Heading>

        <Text>
          Easily integrate Account abstraction (ERC-4337) compliant smart
          accounts into your apps.
        </Text>
      </Flex>

      {(!address ||
        (!factories.isLoading &&
          (!factories?.data || factories.data?.length === 0))) && (
        <>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12}>
            <Flex flexDir="column" gap={8}>
              <UnorderedList spacing={2}>
                <Text as={ListItem}>
                  Let users <b>connect to their smart wallet</b> using any
                  personal wallet, including email and local wallets for easy
                  onboarding.
                </Text>
                <Text as={ListItem}>
                  Automatically <b>deploy individual account contracts</b> for
                  your users when they do their first onchain transaction.
                </Text>
                <Text as={ListItem}>
                  <b>Handle all transaction gas costs</b> via the thirdweb
                  paymaster.
                </Text>
              </UnorderedList>

              <TrackedLink
                category={TRACKING_CATEGORY}
                label="docs-wallets"
                href="https://portal.thirdweb.com/smart-wallet"
                color="blue.500"
                isExternal
              >
                Learn more about Smart Wallets
              </TrackedLink>
            </Flex>
            <ChakraNextImage
              borderRadius="xl"
              src={require("public/assets/dashboard/wallets/smart-wallet.png")}
              alt=""
            />
          </SimpleGrid>

          <Flex flexDir={"column"} gap={6}>
            <Heading size="title.md" as="h2">
              Deploy an Account Factory
            </Heading>
            <Text>
              Account factories are contracts that spin up ERC-4337 compliant
              smart accounts. The account will automatically be deployed when
              the user performs their first on-chain transaction. Learn more
              about factories and which factory type is right for your use case{" "}
              <TrackedLink
                color={"blue.500"}
                category={TRACKING_CATEGORY}
                label="account-factory-blog"
                isExternal
                href="https://blog.thirdweb.com/smart-contract-deep-dive-building-smart-wallets-for-individuals-and-teams/"
              >
                here.
              </TrackedLink>
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              {accountFactories.map((publishedContractId, idx) => {
                const [publisher, contractId] = publishedContractId.split("/");
                return (
                  <ContractCard
                    key={publishedContractId}
                    publisher={publisher}
                    contractId={contractId}
                    tracking={{
                      source: "smart-wallet-tab",
                      itemIndex: `${idx}`,
                    }}
                  />
                );
              })}
            </SimpleGrid>
          </Flex>
        </>
      )}

      {address && !factories.isLoading && (factories.data || []).length > 0 && (
        <Flex flexDir={"column"} gap={4}>
          <Heading size="title.md" as="h1">
            Your account factories
          </Heading>

          <Text>
            Click into a contract to manage accounts under it and to view
            contract-specific analytics.
          </Text>

          <FactoryContracts
            contracts={factories.data as ContractWithMetadata[]}
            isLoading={factories.isLoading}
            isFetched={factories.isFetched}
          />
        </Flex>
      )}

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={4}>
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
                  label="full-docs"
                  href="https://portal.thirdweb.com/smart-wallet"
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
                  label="smart-wallet-react"
                  href="https://portal.thirdweb.com/smart-wallet/guides/react"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Using Smart Wallet in React
                </TrackedLink>
              </Text>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="smart-wallet-typescript"
                  href="https://portal.thirdweb.com/smart-wallet/guides/typescript"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Using Smart Wallet with the Typescript SDK
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
              Smart Wallet Guides
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="deploy-smart-wallet"
                  href="https://blog.thirdweb.com/guides/how-to-use-erc4337-smart-wallets/"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  How to Deploy a Smart Wallet (ERC-4337)
                </TrackedLink>
              </Text>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="extend-base-smart-wallet"
                  href="https://blog.thirdweb.com/guides/custom-smart-wallet-contracts/"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  How to Extend the Base Smart Wallet Contracts Using the
                  Solidity SDK
                </TrackedLink>
              </Text>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="batch-txns"
                  href="https://blog.thirdweb.com/guides/how-to-batch-transactions-with-the-thirdweb-sdk/"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Batch Transactions with the Smart Wallet
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
              Smart Wallet Templates
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="node-template"
                  href="https://github.com/thirdweb-example/smart-wallet-react"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Node.js template
                </TrackedLink>
              </Text>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="react-template"
                  href="https://github.com/thirdweb-example/smart-wallet-react"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  React template
                </TrackedLink>
              </Text>
            </UnorderedList>
          </Flex>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

DashboardWalletsSmartWallet.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="smart-wallet" />
    {page}
  </AppLayout>
);

DashboardWalletsSmartWallet.pageId = PageId.DashboardWalletsSmartWallet;

export default DashboardWalletsSmartWallet;
