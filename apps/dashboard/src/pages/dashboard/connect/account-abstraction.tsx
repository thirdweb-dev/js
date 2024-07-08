import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  AccountStatus,
  type ApiKey,
  useAccount,
  useApiKeys,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  HStack,
  ListItem,
  SimpleGrid,
  UnorderedList,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { SmartWallets } from "components/smart-wallets";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkButton,
} from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "smart-wallet";

export type SmartWalletFormData = {
  chainAndFactoryAddress: string;
  clientId: string;
};

const DashboardConnectAccountAbstraction: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultTabIndex = Number.parseInt(router.query.tab?.toString() || "0");
  const defaultClientId = router.query.clientId?.toString();
  const { isLoading } = useLoggedInUser();
  const keysQuery = useApiKeys();
  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();
  const meQuery = useAccount();
  const account = meQuery?.data;

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return !!(key.services || []).find((srv) => srv.name === "bundler");
    });
  }, [keysQuery]);

  const hasApiKeys = apiKeys.length > 0;

  // compute the actual selected key based on if there is a state, if there is a query param, or otherwise the first one
  const selectedKey = useMemo(() => {
    if (selectedKey_) {
      return selectedKey_;
    }
    if (apiKeys.length) {
      if (defaultClientId) {
        return apiKeys.find((k) => k.key === defaultClientId);
      }
      return apiKeys[0];
    }
    return undefined;
  }, [apiKeys, defaultClientId, selectedKey_]);

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
    desc: "Add account abstraction to your web3 app & unlock powerful features for seamless onboarding, customizable transactions, & maximum security. Get started.",
  };

  if (isLoading) {
    return (
      <div className="grid w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    );
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
          <Flex
            gap={8}
            alignItems={"center"}
            flexDir={{ base: "column", md: "row" }}
          >
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

      {hasSmartWalletsWithoutBilling ? (
        <SmartWalletsBillingAlert />
      ) : (
        <Alert
          status="info"
          borderRadius="lg"
          backgroundColor="backgroundCardHighlight"
          borderLeftColor="blue.500"
          borderLeftWidth={4}
          as={Flex}
          gap={1}
        >
          <AlertIcon />
          <Flex flexDir="column">
            <AlertTitle>
              Using the gas credits for OP chain paymaster
            </AlertTitle>
            <AlertDescription as={Text}>
              Credits will automatically be applied to cover gas fees for any
              onchain activity across thirdweb services. <br />
              Eligible chains: OP Mainnet, Base, Zora, Frax, Mode.
            </AlertDescription>
          </Flex>
        </Alert>
      )}

      {!hasApiKeys && <NoApiKeys service="Account Abstraction" />}

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
                  Using Account Abstraction in React
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
                  Using Account Abstraction with the Typescript SDK
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
              Account Abstraction Guides
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
                  How to Deploy an Smart Account (ERC-4337)
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
                  How to Extend the Base Account Abstraction Contracts Using the
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
                  Batch Transactions with Account Abstraction
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
              Account Abstraction Templates
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

DashboardConnectAccountAbstraction.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="account-abstraction" />
    {page}
  </AppLayout>
);

DashboardConnectAccountAbstraction.pageId =
  PageId.DashboardConnectAccountAbstraction;

export default DashboardConnectAccountAbstraction;
