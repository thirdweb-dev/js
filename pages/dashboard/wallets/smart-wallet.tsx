import {
  ButtonGroup,
  Flex,
  FormControl,
  ListItem,
  Select,
  SimpleGrid,
  Skeleton,
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
  Button,
} from "tw-components";
import { useAddress } from "@thirdweb-dev/react";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAccount, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { formatSnippet } from "contract-ui/tabs/code/components/code-overview";
import { WALLETS_SNIPPETS } from "./wallet-sdk";
import React, { useMemo, useState } from "react";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useSupportedChain } from "hooks/chains/configureChains";
import { ChakraNextImage } from "components/Image";
import invariant from "tiny-invariant";
import { ContractCard } from "components/explore/contract-card";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeyTable/Alerts";

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
          return {
            contract: c,
            extensions,
          };
        }),
      );

      const factories = contractWithExtensions.filter((c) =>
        c.extensions.includes("AccountFactory"),
      );

      return factories;
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

const CONNECT_SNIPPET = WALLETS_SNIPPETS.find((s) => s.id === "smart-wallet");

const DashboardWalletsSmartWallet: ThirdwebNextPage = () => {
  const address = useAddress();
  const factories = useFactories();
  const keysQuery = useApiKeys();
  const meQuery = useAccount();
  const form = useForm<SmartWalletFormData>();
  const [selectedLanguage, setSelectedLanguage] =
    useState<CodeEnvironment>("javascript");

  const account = meQuery?.data;
  const chainId = form.watch("chainAndFactoryAddress")?.split("-")[0];
  const chainSlug = useChainSlug(chainId);
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
    <Flex flexDir="column" gap={12} mt={{ base: 2, md: 6 }}>
      {hasSmartWalletsWithoutBilling && <SmartWalletsBillingAlert />}
      <Flex flexDir="column" gap={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12}>
          <Flex flexDir="column" gap={4}>
            <Heading size="title.lg" as="h1">
              Smart Wallet
            </Heading>
            <Text>
              Easily integrate Account abstraction (ERC-4337) compliant smart
              accounts into your apps.
            </Text>
            <Flex flexDir="column" gap={2}>
              <Text>Once setup, your application will:</Text>
              <UnorderedList>
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
            </Flex>
          </Flex>
          <ChakraNextImage
            borderRadius="xl"
            src={require("public/assets/dashboard/wallets/smart-wallet.png")}
            alt=""
          />
        </SimpleGrid>
      </Flex>
      {(factories?.data || []).length === 0 ? (
        <Flex flexDir={"column"} gap={4}>
          <Heading size="title.md" as="h1">
            Deploy Account Factories
          </Heading>
          <Text>
            Ready to use Account Factory contracts that can deploy individual
            accounts gas-efficiently and provide on chain data about your user
            base.
            <br />
            <TrackedLink
              color={"blue.500"}
              category={TRACKING_CATEGORY}
              label="account-factory-blog"
              isExternal
              href="https://blog.thirdweb.com/smart-contract-deep-dive-building-smart-wallets-for-individuals-and-teams/"
            >
              Read about our different account factory contracts.
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
      ) : null}
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Integrate Smart Wallets into your apps
        </Heading>

        <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
          <FormControl as={Flex} flexDir="column" gap={4}>
            <Heading size="label.lg">Account Factories</Heading>

            <Skeleton
              isLoaded={!address || factories.isFetched}
              borderRadius="lg"
            >
              <Select
                isDisabled={!address || (factories?.data || []).length === 0}
                {...form.register("chainAndFactoryAddress")}
                placeholder={
                  !address
                    ? "Not connected"
                    : factories.isFetched &&
                      (factories?.data || []).length === 0
                    ? "No factories found"
                    : "Select factory"
                }
              >
                {factories?.data?.map((f) => (
                  <FactoryOption
                    key={f.contract.address}
                    contract={f.contract}
                  />
                ))}
              </Select>
            </Skeleton>
          </FormControl>
          <FormControl as={Flex} flexDir="column" gap={4}>
            <Heading size="label.lg">Client IDs</Heading>
            <Skeleton
              isLoaded={!address || keysQuery.isFetched}
              borderRadius="lg"
            >
              <Select
                isDisabled={!address || (apiKeys || []).length === 0}
                {...form.register("clientId")}
                placeholder={
                  !address
                    ? "Not connected"
                    : keysQuery.isFetched && (apiKeys || []).length === 0
                    ? "No client IDs found"
                    : "Select client ID"
                }
              >
                {apiKeys?.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.name} - {f.key}
                  </option>
                ))}
              </Select>
            </Skeleton>
          </FormControl>
        </Flex>
        <ButtonGroup size="sm" variant="ghost" spacing={{ base: 0.5, md: 2 }}>
          <Button
            isActive={true}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
          >
            Wallet SDK
          </Button>
          {!!form.watch("chainAndFactoryAddress") && (
            <TrackedLinkButton
              isActive={false}
              _active={{
                bg: "bgBlack",
                color: "bgWhite",
              }}
              rounded="lg"
              href={`/${form
                .watch("chainAndFactoryAddress")
                ?.split("-")[0]}/${form
                .watch("chainAndFactoryAddress")
                ?.split("-")[1]}/code`}
              category={TRACKING_CATEGORY}
              label="direct-contract-interaction"
            >
              Direct contract interaction (advanced)
            </TrackedLinkButton>
          )}
        </ButtonGroup>
        <CodeSegment
          snippet={formatSnippet(CONNECT_SNIPPET?.supportedLanguages as any, {
            contractAddress: form
              .watch("chainAndFactoryAddress")
              ?.split("-")[1],
            clientId: form.watch("clientId"),
            chainName: chainSlug?.toString() || "goerli",
          })}
          environment={selectedLanguage}
          setEnvironment={setSelectedLanguage}
        />
        <TrackedLinkButton
          category={TRACKING_CATEGORY}
          label="docs-wallets"
          href="https://portal.thirdweb.com/wallet/smart-wallet"
          colorScheme="primary"
          variant={"ghost"}
          w={"fit-content"}
          size="md"
          isExternal
        >
          View Smart Wallet documentation
        </TrackedLinkButton>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card
          as={Flex}
          gap={4}
          flex={1}
          bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
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

interface FactoryOptionProps {
  contract: {
    address: string;
    chainId: number;
  };
}

const FactoryOption: React.FC<FactoryOptionProps> = ({ contract }) => {
  const chainInfo = useSupportedChain(contract.chainId || -1);
  const chainName = chainInfo?.name || "Unknown";

  return (
    <option
      key={contract.address}
      value={`${contract.chainId}-${contract.address}`}
    >
      {chainName} - {contract.address}
    </option>
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
