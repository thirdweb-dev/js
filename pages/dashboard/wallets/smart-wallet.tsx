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
import {
  Card,
  Heading,
  Text,
  TrackedLink,
  TrackedLinkButton,
} from "tw-components";
import { ContractWithMetadata, useAddress } from "@thirdweb-dev/react";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
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
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { getChainByChainId } from "@thirdweb-dev/chains";
import { shortenIfAddress } from "utils/usedapp-external";
import { useRouter } from "next/router";
import { ContractCard } from "components/explore/contract-card";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeyTable/Alerts";

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

const CONNECT_SNIPPET = WALLETS_SNIPPETS.find((s) => s.id === "smart-wallet");
const INTERACT_SNIPPET = {
  javascript: `import {{chainName}} from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Simply initialize your SDK with the created smart wallet
const sdk = await ThirdwebSDK.fromWallet(smartWallet, {{chainName}}, {
  clientId: "YOUR_CLIENT_ID"
});

// You can now interact with the blockchain as you would with a regular EOA
const smartWalletAddress = await sdk.wallet.getAddress();

// gas free wallet actions
await sdk.wallet.transfer("{{contract_address}}", "0.01");

// gas free contract deployments
const contractAddress = await sdk.deployer.deployNFTCollection({ 
  name: "My NFT Collection", 
  primary_sale_recipient: smartWalletAddress 
});

// gas free contract interactions
const contract = await sdk.getContract(contractAddress);
await contract.erc721.mint({ 
  name: "My NFT",
  description: "My NFT description",
  image: "https://example.com/image.png",
});
`,
  react: `import {{chainName}} from "@thirdweb-dev/chains";
import { useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";

// The ThirdwebProvider setup above already handles connection to the smart wallet
// Within the provider, you can use the react SDK hooks to interact with the blockchain
export default function MyComponent() {
  // Get the connected smart wallet address
  const smartWalletAddress = useAddress();

  // Fetch owned NFTs
  const { contract } = useContract("{{contract_address}}");
  const { data, isLoading } = useOwnedNFTs(contract, smartWalletAddress);

  // Mint a new NFT
  return (
    <Web3Button
      contractAddress={"{{contract_address}}"}
      action={(contract) => contract.erc721.mint({ 
          name: "My NFT",
          description: "My NFT description",
          image: "https://example.com/image.png",
        })
      }
    >
      Mint NFT
    </Web3Button>
  );
}`,
  "react-native": `import {{chainName}} from "@thirdweb-dev/chains";
import { useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react-native";

// The ThirdwebProvider setup above already handles connection to the smart wallet
// Within the provider, you can use the react SDK hooks to interact with the blockchain
export default function MyComponent() {
  // Get the connected smart wallet address
  const smartWalletAddress = useAddress();

  // Fetch owned NFTs
  const { contract } = useContract("{{contract_address}}");
  const { data, isLoading } = useOwnedNFTs(contract, smartWalletAddress);

  // Mint a new NFT
  return (
    <Web3Button
      contractAddress={"{{contract_address}}"}
      action={(contract) => contract.erc721.mint({ 
          name: "My NFT",
          description: "My NFT description",
          image: "https://example.com/image.png",
        })
      }
    >
      Mint NFT
    </Web3Button>
  );
}`,
  unity: `using Thirdweb;

public async void MintNFT()
{
  // The ThirdwebManger prefab holds the smart wallet connection state
  var sdk = ThirdwebManager.Instance.SDK;

  // Get the connected smart wallet address
  var smartWalletAddress = await sdk.Wallet.GetAddress();

  // Interact with contracts
  Contract contract = sdk.GetContract("{{contract_address}}");
  await contract.ERC721.Mint(new NFTMetadata()
  {
      name = "My NFT",
      description = "My NFT description",
      image = "https://example.com/image.png",
  });
}`,
};

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
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Bundler and Paymaster Infrastructure
        </Heading>
        <Text>
          The thirdweb SDK handles all the heavy lifting of bundling operations
          and covering gas fees with a turn key infrastructure.
        </Text>
        <UnorderedList>
          <Text as={ListItem}>
            On testnets, the only requirement is to obtain a{" "}
            <TrackedLink
              color={"blue.500"}
              href="/dashboard/settings/api-keys"
              category="smart-wallet"
              label="api-key"
              isExternal
            >
              free client id
            </TrackedLink>{" "}
            to get started.
          </Text>
          <Text as={ListItem}>
            Once you&apos;re ready to deploy on mainnets, you will require an
            active billing account.
          </Text>
          <Text as={ListItem}>
            You can configure your client id to restrict interactions only with
            your own contracts or with any contract.
          </Text>
        </UnorderedList>
      </Flex>
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Supported chains
        </Heading>
        <Text>
          We continuously add support for new chains. Looking for a chain not
          listed below?{" "}
          <TrackedLink
            color={"blue.500"}
            category="smart-wallet"
            label="chain-request"
            href={`https://docs.google.com/forms/d/e/1FAIpQLSffFeEw7rPGYA8id7LwL22-W3irT6siXE5EHgD3xrxmxpLKCw/viewform?entry.948574526=${
              address || ""
            }`}
            isExternal
          >
            Contact us.
          </TrackedLink>
        </Text>
        <Flex flexDir="row" gap={12}>
          <Flex flexDir="column" gap={2}>
            <Text size="label.lg">Mainnets</Text>
            <UnorderedList>
              <Text as={ListItem}>Polygon</Text>
              <Text as={ListItem}>Optimism</Text>
              <Text as={ListItem}>Arbitrum</Text>
              <Text as={ListItem}>Base</Text>
            </UnorderedList>
          </Flex>
          <Flex flexDir="column" gap={2}>
            <Text size="label.lg">Testnets</Text>
            <UnorderedList>
              <Text as={ListItem}>Goerli</Text>
              <Text as={ListItem}>Mumbai</Text>
              <Text as={ListItem}>Optimism Goerli</Text>
              <Text as={ListItem}>Arbitrum Goerli</Text>
              <Text as={ListItem}>Base Goerli</Text>
            </UnorderedList>
          </Flex>
        </Flex>
      </Flex>
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
            category="smart-wallet"
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
      <FactoriesTable walletAddress={address} factoriesQuery={factories} />
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Integrate Smart Wallets into your apps
        </Heading>
        <Text>Get started quickly by cloning one of the starter templates</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <TrackedLink
            category="smart-wallet"
            label="node-template"
            href="https://github.com/thirdweb-example/smart-wallet-script"
            isExternal
            _hover={{ textDecor: "none" }}
          >
            <Card
              as={Flex}
              flexDir={"row"}
              gap={4}
              flex={1}
              transition="150ms border-color ease-in-out"
              _hover={{
                _dark: {
                  borderColor: "blue.400",
                },
                _light: {
                  borderColor: "blue.600",
                },
              }}
              overflow="hidden"
              bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
            >
              <SiGithub size={"42"} />
              <Flex flexDir={"column"} gap={2}>
                <Heading size="title.sm" as="h1">
                  Node.js template
                </Heading>
                <Text>
                  Simple Node.js script that connects to a smart wallet and
                  mints ERC20 tokens.
                </Text>
              </Flex>
            </Card>
          </TrackedLink>
          <TrackedLink
            category="smart-wallet"
            label="react-template"
            href="https://github.com/thirdweb-example/smart-wallet-react"
            isExternal
            _hover={{ textDecor: "none" }}
          >
            <Card
              as={Flex}
              flexDir={"row"}
              gap={4}
              flex={1}
              transition="150ms border-color ease-in-out"
              _hover={{
                _dark: {
                  borderColor: "blue.400",
                },
                _light: {
                  borderColor: "blue.600",
                },
              }}
              overflow="hidden"
              bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
            >
              <SiGithub size={"42"} />
              <Flex flexDir={"column"} gap={2}>
                <Heading size="title.sm" as="h1">
                  React template
                </Heading>
                <Text>
                  Simple web application that lets users connects to their smart
                  wallet and mint NFTs.
                </Text>
              </Flex>
            </Card>
          </TrackedLink>
        </SimpleGrid>
        <Text>
          Or use the following code to integrate smart wallets into your apps.
          This will handle:
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
          functional code snippet.
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
          category="smart-wallet"
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
      <Flex flexDir={"column"} gap={4}>
        <Heading size="title.md" as="h1">
          Executing gas free transactions with Smart Wallets
        </Heading>
        <Text>
          Once setup, you can use the thirdweb{" "}
          <TrackedLink
            category="smart-wallet"
            label="docs-typescript"
            href="https://portal.thirdweb.com/typescript"
            color={"blue.500"}
            isExternal
          >
            TypeScript
          </TrackedLink>
          ,{" "}
          <TrackedLink
            category="smart-wallet"
            label="docs-react"
            href="https://portal.thirdweb.com/react"
            color={"blue.500"}
            isExternal
          >
            React
          </TrackedLink>
          ,{" "}
          <TrackedLink
            category="smart-wallet"
            label="docs-react-native"
            href="https://portal.thirdweb.com/react-native"
            color={"blue.500"}
            isExternal
          >
            React Native
          </TrackedLink>{" "}
          and{" "}
          <TrackedLink
            category="smart-wallet"
            label="docs-unity"
            href="https://portal.thirdweb.com/unity"
            color={"blue.500"}
            isExternal
          >
            Unity
          </TrackedLink>{" "}
          SDKs to deploy contracts, perform transactions, and manipulate wallets
          just like you would with any other wallet.
        </Text>
        <CodeSegment
          snippet={formatSnippet(INTERACT_SNIPPET as any, {
            contractAddress: form
              .watch("chainAndFactoryAddress")
              ?.split("-")[1],
            clientId: form.watch("clientId"),
            chainName: chainSlug?.toString() || "goerli",
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
