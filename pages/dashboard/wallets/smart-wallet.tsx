import {
  Flex,
  ListItem,
  SimpleGrid,
  Spinner,
  UnorderedList,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkButton,
} from "tw-components";
import { ContractWithMetadata, useSupportedChains } from "@thirdweb-dev/react";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import React, { useMemo } from "react";
import invariant from "tiny-invariant";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { FactoryContracts } from "components/contract-components/tables/factory-contracts";
import { NextSeo } from "next-seo";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { FiPlus } from "react-icons/fi";
import { getEVMThirdwebSDK } from "lib/sdk";
import { Polygon } from "@thirdweb-dev/chains";
import { getDashboardChainRpc } from "lib/rpc";

const TRACKING_CATEGORY = "smart-wallet";

const useFactories = () => {
  const { user, isLoggedIn } = useLoggedInUser();
  const configuredChains = useSupportedChains();
  return useQuery(
    [
      "dashboard-registry",
      user?.address,
      "multichain-contract-list",
      "factories",
    ],
    async () => {
      invariant(user?.address, "user should be logged in");
      const polygonSDK = getEVMThirdwebSDK(
        Polygon.chainId,
        getDashboardChainRpc(Polygon),
      );
      const contractList = await polygonSDK.getMultichainContractList(
        user.address,
        configuredChains,
      );

      const contractWithExtensions = await Promise.all(
        contractList.map(async (c) => {
          const extensions =
            "extensions" in c ? await c.extensions().catch(() => []) : [];
          return extensions.includes("AccountFactory") ? c : null;
        }),
      );

      return contractWithExtensions.filter((f) => f !== null);
    },
    {
      enabled: !!user?.address && isLoggedIn,
    },
  );
};
export type SmartWalletFormData = {
  chainAndFactoryAddress: string;
  clientId: string;
};

const DashboardWalletsSmartWallet: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
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

  const seo = {
    title: "The Complete Account Abstraction Toolkit | thirdweb",
    desc: "Add smart wallets to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Get started.",
  };

  if (!isLoggedIn) {
    return <ConnectWalletPrompt description="manage smart wallets" />;
  }

  return (
    <Flex flexDir="column" gap={10}>
      <NextSeo
        title={seo.title}
        description={seo.desc}
        openGraph={{
          title: seo.title,
          description: seo.desc,
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/dashboard-wallets-smart-wallet.png`,
              width: 1200,
              height: 630,
              alt: seo.title,
            },
          ],
        }}
      />

      <Flex flexDir="column" gap={4}>
        <Flex gap={8} alignItems={"center"}>
          <Heading size="title.lg" as="h1">
            Smart Wallet
          </Heading>
          <TrackedLinkButton
            category={TRACKING_CATEGORY}
            variant={"solid"}
            label="docs-wallets"
            href="https://portal.thirdweb.com/wallets/smart-wallet"
            isExternal
          >
            View Documentation
          </TrackedLinkButton>
        </Flex>
        <Text>
          Easily integrate Account abstraction (ERC-4337) compliant smart
          accounts into your apps.
        </Text>
      </Flex>

      <Flex
        flexDir={{ base: "column", lg: "row" }}
        gap={8}
        justifyContent={"space-between"}
        alignItems={"left"}
      >
        <Flex flexDir={"column"} gap={4}>
          <Heading size="title.md" as="h1">
            Your account factories
          </Heading>
          <Text>
            Click an account factory contract to view analytics and accounts
            created.
          </Text>
        </Flex>

        <TrackedLinkButton
          leftIcon={<FiPlus />}
          category={TRACKING_CATEGORY}
          label="create-factory"
          colorScheme="primary"
          href="/explore/smart-wallet"
        >
          Deploy an Account Factory
        </TrackedLinkButton>
      </Flex>

      {factories.isLoading ? (
        <Spinner />
      ) : (
        <FactoryContracts
          contracts={(factories.data || []) as ContractWithMetadata[]}
          isLoading={factories.isLoading}
          isFetched={factories.isFetched}
        />
      )}

      {isLoggedIn && hasSmartWalletsWithoutBilling && (
        <SmartWalletsBillingAlert />
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
                  href="https://portal.thirdweb.com/wallets/smart-wallet"
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
                  href="https://portal.thirdweb.com/wallets/smart-wallet/guides/react"
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
                  href="https://portal.thirdweb.com/wallets/smart-wallet/guides/typescript"
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
                  href="https://github.com/thirdweb-example/smart-wallet-script"
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
