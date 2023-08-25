import {
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
import { Heading, Text } from "tw-components";
import { useAddress } from "@thirdweb-dev/react";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { formatSnippet } from "contract-ui/tabs/code/components/code-overview";
import { WALLETS_SNIPPETS } from "./wallet-sdk";
import React, { useState } from "react";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useSupportedChain } from "hooks/chains/configureChains";
import { ChakraNextImage } from "components/Image";
import invariant from "tiny-invariant";

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

const DashboardWalletsSmartWallet: ThirdwebNextPage = () => {
  const address = useAddress();
  const factories = useFactories();
  const keysQuery = useApiKeys();
  const form = useForm<SmartWalletFormData>();
  const [selectedLanguage, setSelectedLanguage] =
    useState<CodeEnvironment>("javascript");
  const snippet = WALLETS_SNIPPETS.find((s) => s.id === "smart-wallet");

  const chainId = form.watch("chainAndFactoryAddress")?.split("-")[0];
  const chainSlug = useChainSlug(chainId);

  return (
    <Flex flexDir="column" gap={16} mt={{ base: 2, md: 6 }}>
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
                  Let users connect to their smart wallet.
                </Text>
                <Text as={ListItem}>
                  Automatically deploy the individual account contracts for your
                  users when they do their first onchain transaction.
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
      <Flex flexDir={{ base: "column", md: "row" }} gap={4}>
        <FormControl as={Flex} flexDir="column" gap={4}>
          <Heading size="title.md" as="h1">
            Account Factories
          </Heading>

          <Skeleton
            isLoaded={!address || factories.isSuccess || factories.isFetched}
            borderRadius="lg"
          >
            <Select
              isDisabled={!address || (factories?.data || []).length === 0}
              {...form.register("chainAndFactoryAddress")}
              placeholder={
                !address
                  ? "Not connected"
                  : factories.isSuccess && (factories?.data || []).length === 0
                  ? "No factories found"
                  : "Select factory"
              }
            >
              {factories?.data?.map((f) => (
                <FactoryOption key={f.contract.address} contract={f.contract} />
              ))}
            </Select>
          </Skeleton>
        </FormControl>
        <FormControl as={Flex} flexDir="column" gap={4}>
          <Heading size="title.md" as="h1">
            Client IDs
          </Heading>

          <Skeleton
            isLoaded={!address || keysQuery.isSuccess || keysQuery.isFetched}
            borderRadius="lg"
          >
            <Select
              isDisabled={!address || (keysQuery?.data || []).length === 0}
              {...form.register("clientId")}
              placeholder={
                !address
                  ? "Not connected"
                  : keysQuery.isFetched && (keysQuery?.data || []).length === 0
                  ? "No client IDs found"
                  : "Select client ID"
              }
            >
              {keysQuery?.data?.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.name} - {f.key}
                </option>
              ))}
            </Select>
          </Skeleton>
        </FormControl>
      </Flex>
      <CodeSegment
        snippet={formatSnippet(snippet?.supportedLanguages as any, {
          contractAddress: form.watch("chainAndFactoryAddress")?.split("-")[1],
          clientId: form.watch("clientId"),
          chainName: chainSlug?.toString() || "ethereum",
        })}
        environment={selectedLanguage}
        setEnvironment={setSelectedLanguage}
        hideTabs
      />
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
