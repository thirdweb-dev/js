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
import { ContractWithMetadata, useAddress } from "@thirdweb-dev/react";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
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
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { getChainByChainId } from "@thirdweb-dev/chains";
import { shortenIfAddress } from "utils/usedapp-external";
import { useRouter } from "next/router";
import { ContractCard } from "components/explore/contract-card";

type ContractWithExtensions = {
  contract: ContractWithMetadata;
  extensions: string[];
};

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
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Deploy Account Factories
        </Heading>
        <Text>
          Account Factory contracts do the heavy lifting of deploying individual
          accounts for your users when needed.
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
                  source: "smart-wallet",
                  itemIndex: `${idx}`,
                }}
              />
            );
          })}
        </SimpleGrid>
      </Flex>
      <FactoriesTable walletAddress={address} factoriesQuery={factories} />
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Integrate Smart Wallets into your apps
        </Heading>
        <Text>
          Use the following code to integrate smart wallets into your apps. This
          will handle: from the app will only deploy the individual account
          contracts for your users when they do their first onchain transaction.
        </Text>
        <UnorderedList>
          <Text as={ListItem}>
            Connecting your users to their smart wallet based of their personal
            wallet (can be any wallet, including email or local wallets).
          </Text>
          <Text as={ListItem}>
            Automatically deploy the individual account contracts for your users
            when they do their first onchain transaction.
          </Text>
          <Text as={ListItem}>
            Handle all transaction gas costs via the thirdweb paymaster.
          </Text>
        </UnorderedList>
        <Text>
          Select your deployed account factory and client ID to get a fully
          funcitonal code snippet.
        </Text>
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
                isDisabled={!address || (keysQuery?.data || []).length === 0}
                {...form.register("clientId")}
                placeholder={
                  !address
                    ? "Not connected"
                    : keysQuery.isFetched &&
                      (keysQuery?.data || []).length === 0
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
            contractAddress: form
              .watch("chainAndFactoryAddress")
              ?.split("-")[1],
            clientId: form.watch("clientId"),
            chainName: chainSlug?.toString() || "ethereum",
          })}
          environment={selectedLanguage}
          setEnvironment={setSelectedLanguage}
        />
      </Flex>
    </Flex>
  );
};

interface FactoryTableProps {
  walletAddress: string | undefined;
  factoriesQuery: UseQueryResult<ContractWithExtensions[], unknown>;
}

type FactoryTableRow = {
  name: string;
  address: string;
  chainId: number;
  chainName: string;
  walletsDeployed: number;
};
const columnHelper = createColumnHelper<FactoryTableRow>();

const useFactoryTableData = (
  walletAddress: string | undefined,
  factoriesQuery: FactoryTableProps["factoriesQuery"],
) => {
  return useQuery(
    [
      "dashboard-registry",
      walletAddress,
      "multichain-contract-list",
      "factories",
      "table",
    ],
    async () => {
      const factories = factoriesQuery.data;
      invariant(factories, "factories should be defined");

      const rows = await Promise.all(
        factories.map(async (f) => {
          const chainInfo = getChainByChainId(f.contract.chainId || -1);
          const chainName = chainInfo?.name || "Unknown";
          return {
            name:
              "metadata" in f.contract
                ? (await f.contract.metadata()).name
                : "Unknown",
            address: f.contract.address,
            chainId: f.contract.chainId,
            chainName,
            walletsDeployed: 0,
          };
        }),
      );
      return rows;
    },
    {
      enabled:
        !!walletAddress &&
        !!factoriesQuery.data &&
        factoriesQuery.data.length > 0,
    },
  );
};

const FactoriesTable: React.FC<FactoryTableProps> = ({
  walletAddress,
  factoriesQuery,
}) => {
  const data = useFactoryTableData(walletAddress, factoriesQuery);
  const router = useRouter();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => <Text>{cell.getValue()}</Text>,
    }),
    columnHelper.accessor("chainName", {
      header: "Chain",
      cell: (cell) => <Text>{cell.getValue()}</Text>,
    }),
    columnHelper.accessor("address", {
      header: "Address",
      cell: (cell) => <Text>{shortenIfAddress(cell.getValue())}</Text>,
    }),
  ];

  return (
    <Flex flexDir={"column"} gap={4}>
      <Heading size="title.md" as="h1">
        Your Account Factories
      </Heading>
      <Text>Quickly access your deployed account factories.</Text>
      {walletAddress ? (
        <TWTable
          title="deployed factories"
          columns={columns}
          data={data.data || []}
          isLoading={!!walletAddress && factoriesQuery.isLoading}
          isFetched={!!walletAddress && factoriesQuery.isFetched}
          onRowClick={(row) => router.push(`/${row.chainId}/${row.address}`)}
        />
      ) : (
        <Text color="inherit" fontStyle={"italic"}>
          Connect your wallet to view your deployed factories.
        </Text>
      )}
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
