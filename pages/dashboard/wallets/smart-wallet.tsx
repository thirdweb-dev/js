import {
  Flex,
  HStack,
  ListItem,
  SimpleGrid,
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
import {
  AccountStatus,
  ApiKey,
  useAccount,
  useApiKeys,
} from "@3rdweb-sdk/react/hooks/useApi";
import React, { useEffect, useMemo, useState } from "react";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { NextSeo } from "next-seo";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { SmartWallets } from "components/smart-wallets";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { useRouter } from "next/router";

const TRACKING_CATEGORY = "smart-wallet";

export type SmartWalletFormData = {
  chainAndFactoryAddress: string;
  clientId: string;
};

const DashboardWalletsSmartWallet: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultTabIndex = parseInt(router.query.tab?.toString() || "0");
  const defaultClientId = router.query.clientId?.toString();
  const { isLoggedIn } = useLoggedInUser();
  const keysQuery = useApiKeys();
  const [selectedKey, setSelectedKey] = useState<undefined | ApiKey>();
  const meQuery = useAccount();
  const account = meQuery?.data;

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return !!(key.services || []).find((srv) => srv.name === "bundler");
    });
  }, [keysQuery]);

  const hasApiKeys = apiKeys.length > 0;

  useEffect(() => {
    if (selectedKey) {
      return;
    }
    if (apiKeys.length > 0) {
      if (defaultClientId) {
        const key = apiKeys.find((k) => k.key === defaultClientId);
        if (key) {
          setSelectedKey(key);
        } else {
          setSelectedKey(apiKeys[0]);
        }
      } else {
        setSelectedKey(apiKeys[0]);
      }
    } else {
      setSelectedKey(undefined);
    }
  }, [apiKeys, selectedKey, defaultClientId]);

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    if (!account || !apiKeys) {
      return;
    }

    return apiKeys.find((k) =>
      k.services?.find(
        (s) =>
          account.status !== AccountStatus.ValidPayment && s.name === "bundler",
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

      <Flex
        flexDir={{ base: "column", lg: "row" }}
        gap={4}
        alignContent={"top"}
        justifyContent={"space-between"}
      >
        <Flex flexDir="column" gap={4}>
          <Flex gap={8} alignItems={"center"}>
            <Heading size="title.lg" as="h1">
              Account Abstraction
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
        {hasApiKeys && (
          <HStack gap={3}>
            {selectedKey && (
              <ApiKeysMenu
                apiKeys={apiKeys}
                selectedKey={selectedKey}
                onSelect={setSelectedKey}
              />
            )}
          </HStack>
        )}
      </Flex>

      {isLoggedIn && hasSmartWalletsWithoutBilling && (
        <SmartWalletsBillingAlert />
      )}

      {!hasApiKeys && <NoApiKeys service="smart wallets" />}

      {hasApiKeys && selectedKey && (
        <SmartWallets
          apiKey={selectedKey}
          trackingCategory={TRACKING_CATEGORY}
          defaultTabIndex={defaultTabIndex}
        />
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
