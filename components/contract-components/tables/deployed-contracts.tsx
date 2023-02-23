import { ShowMoreButton } from "./show-more-button";
import {
  useAllContractList,
  useContractMetadataWithAddress,
  useWeb3,
} from "@3rdweb-sdk/react";
import {
  Box,
  Center,
  Flex,
  Icon,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  ChainId,
  CommonContractOutputSchema,
  ContractType,
  ContractWithMetadata,
  PrebuiltContractType,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk/evm";
import { ChakraNextImage } from "components/Image";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { GettingStartedBox } from "components/getting-started/box";
import { GettingStartedCard } from "components/getting-started/card";
import { ChainIcon } from "components/icons/ChainIcon";
import { CONTRACT_TYPE_NAME_MAP, FeatureIconMap } from "constants/mappings";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { Column, Row, useTable } from "react-table";
import {
  Badge,
  ChakraNextLink,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { ComponentWithChildren } from "types/component-with-children";
import { shortenIfAddress } from "utils/usedapp-external";
import { z } from "zod";

interface DeployedContractsProps {
  noHeader?: boolean;
  contractListQuery: ReturnType<typeof useAllContractList>;
  limit?: number;
}

export const DeployedContracts: React.FC<DeployedContractsProps> = ({
  noHeader,
  contractListQuery,
  limit = 10,
}) => {
  const [showMoreLimit, setShowMoreLimit] = useState(limit);

  const slicedData = useMemo(() => {
    if (contractListQuery.data) {
      return contractListQuery.data.slice(0, showMoreLimit);
    }
    return [];
  }, [contractListQuery.data, showMoreLimit]);

  const router = useRouter();

  return (
    <>
      {!noHeader && (
        <Flex
          justify="space-between"
          align="top"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Flex gap={2} direction="column">
            <Heading size="title.md">Deployed contracts</Heading>
            <Text fontStyle="italic" maxW="container.md">
              The list of contract instances that you have deployed with
              thirdweb across all networks.
            </Text>
          </Flex>
          <LinkButton
            leftIcon={<FiPlus />}
            colorScheme="primary"
            href="/explore"
          >
            Deploy new contract
          </LinkButton>
        </Flex>
      )}

      <ContractTable combinedList={slicedData}>
        {contractListQuery.isLoading && (
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Loading contracts</Text>
            </Flex>
          </Center>
        )}
        {contractListQuery.data.length === 0 && contractListQuery.isFetched && (
          <Center>
            <Flex py={4} direction="column" gap={4} align="center">
              {router.pathname === "/dashboard" ? (
                <GettingStartedBox title="No contracts found, yet!">
                  <GettingStartedCard
                    title="Explore"
                    description={
                      <>
                        Browse a large collection of ready-to-deploy contracts
                        built by thirdweb and other contract developers. Find a
                        contract for your app&apos; or game&apos;s use case.
                      </>
                    }
                    icon={require("public/assets/product-icons/contracts.png")}
                    linkProps={{
                      category: "getting-started",
                      label: "browse-contracts",
                      href: "/explore",
                      children: (
                        <>
                          Get Started <Icon as={FiArrowRight} />
                        </>
                      ),
                    }}
                  />
                  <GettingStartedCard
                    title="Build your own"
                    description={
                      <>
                        Get started with <b>ContractKit</b> to create custom
                        contracts specific to your use case.
                      </>
                    }
                    icon={require("public/assets/product-icons/extensions.png")}
                    linkProps={{
                      category: "getting-started",
                      label: "custom-contracts",
                      href: "https://portal.thirdweb.com/contractkit",
                      isExternal: true,
                      children: (
                        <>
                          View Docs <Icon as={FiArrowRight} />
                        </>
                      ),
                    }}
                  />
                  <GettingStartedCard
                    title="Deploy from source"
                    description={
                      <>
                        You are ready to deploy your contract with our
                        interactive <b>CLI</b>.
                      </>
                    }
                    icon={require("public/assets/product-icons/deploy.png")}
                  >
                    <CodeBlock
                      mt="auto"
                      language="bash"
                      code="npx thirdweb deploy"
                    />
                  </GettingStartedCard>
                </GettingStartedBox>
              ) : (
                <Text>No contracts found, yet!</Text>
              )}
            </Flex>
          </Center>
        )}
        {contractListQuery.data.length > slicedData.length && (
          <ShowMoreButton
            limit={limit}
            showMoreLimit={showMoreLimit}
            setShowMoreLimit={setShowMoreLimit}
          />
        )}
      </ContractTable>
    </>
  );
};

interface ContractTableProps {
  combinedList: {
    chainId: ChainId;
    address: string;
    contractType: () => Promise<ContractType>;
    metadata: () => Promise<z.output<typeof CommonContractOutputSchema>>;
  }[];
  isFetching?: boolean;
}

export const ContractTable: ComponentWithChildren<ContractTableProps> = ({
  combinedList,
  children,
  isFetching,
}) => {
  const { getNetworkMetadata } = useWeb3();
  const configuredChains = useConfiguredChains();

  const columns: Column<(typeof combinedList)[number]>[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) => row.metadata,
        Cell: (cell: any) => {
          return <AsyncContractNameCell cell={cell.row.original} />;
        },
      },
      {
        Header: "Contract Type",
        accessor: (row) => row.contractType,
        Cell: (cell: any) => <AsyncContractTypeCell cell={cell.row.original} />,
      },
      {
        Header: "Network",
        accessor: (row) => row.chainId,
        Cell: (cell: any) => {
          const data = getNetworkMetadata(cell.row.original.chainId);
          return (
            <Flex align="center" gap={2}>
              <ChainIcon size={24} ipfsSrc={data.icon} sizes={data.iconSizes} />
              <Text size="label.md">{data.chainName}</Text>
              {data.isTestnet !== "unknown" && data.isTestnet && (
                <Badge colorScheme="gray" textTransform="capitalize">
                  Testnet
                </Badge>
              )}
            </Flex>
          );
        },
      },
      {
        Header: "Contract Address",
        accessor: (row) => row.address,
        Cell: (cell: any) => {
          return <AddressCopyButton address={cell.row.original.address} />;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configuredChains],
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: "",
    }),
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: combinedList,
      defaultColumn,
    });

  return (
    <Box
      borderTopRadius="lg"
      p={0}
      overflowX="auto"
      position="relative"
      overflowY="hidden"
    >
      {isFetching && (
        <Spinner
          color="primary"
          size="xs"
          position="absolute"
          top={2}
          right={4}
        />
      )}
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Th {...column.getHeaderProps()} border="none">
                  <Text as="label" size="label.sm" color="faded">
                    {column.render("Header")}
                  </Text>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <ContractTableRow
                row={row}
                key={row.original.address + row.original.chainId}
              />
            );
          })}
        </Tbody>
      </Table>
      {children}
    </Box>
  );
};

const ContractTableRow: React.FC<{ row: Row<ContractWithMetadata> }> = ({
  row,
}) => {
  const chainSlug = useChainSlug(row.original.chainId);
  const router = useRouter();

  return (
    <Tr
      {...row.getRowProps()}
      role="group"
      // this is a hack to get around the fact that safari does not handle position: relative on table rows
      style={{ cursor: "pointer" }}
      onClick={() => {
        router.push(`/${chainSlug}/${row.original.address}`);
      }}
      // end hack
      borderBottomWidth={1}
      _last={{ borderBottomWidth: 0 }}
    >
      {row.cells.map((cell) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Td
            borderBottomWidth="inherit"
            borderBottomColor="borderColor"
            {...cell.getCellProps()}
          >
            {cell.render("Cell")}
          </Td>
        );
      })}
    </Tr>
  );
};

interface AsyncContractTypeCellProps {
  cell: {
    address: string;
    chainId: number;
    contractType: (() => Promise<ContractType>) | undefined;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
  };
}

const AsyncContractTypeCell: React.FC<AsyncContractTypeCellProps> = ({
  cell,
}) => {
  const contractTypeQuery = useQuery({
    queryKey: ["contract-type", cell.chainId, cell.address],
    queryFn: () => (cell.contractType ? cell.contractType() : ""),
    enabled: !!cell.contractType,
    refetchOnWindowFocus: false,
    // contract type of a contract does not change - so safe to set high staleTime ( currently set to 1 hour )
    staleTime: 1000 * 60 * 60,
  });

  const contractType = contractTypeQuery.data;
  const isPrebuiltContract = contractType && contractType !== "custom";
  const publishedContractsFromDeploy = usePublishedContractsFromDeploy(
    isPrebuiltContract ? undefined : cell.address || undefined,
    cell.chainId,
  );

  const imgSrc = contractType
    ? FeatureIconMap[contractType as ContractType]
    : "";

  const contractName = contractType
    ? CONTRACT_TYPE_NAME_MAP[contractType as ContractType]
    : "";

  const Custom = CONTRACT_TYPE_NAME_MAP["custom"];

  if (isPrebuiltContract) {
    return (
      <Flex align="center" gap={2}>
        <ChakraNextImage boxSize={8} src={imgSrc} alt={contractName} />
        <Text size="label.md">{contractName} </Text>
      </Flex>
    );
  }

  const actualPublishedContract = publishedContractsFromDeploy.data
    ? publishedContractsFromDeploy.data[0]
    : null;

  if (!publishedContractsFromDeploy.isLoading && !actualPublishedContract) {
    return (
      <Flex align="center" gap={2}>
        {imgSrc ? (
          <ChakraNextImage boxSize={8} src={imgSrc} alt={Custom} />
        ) : (
          <Box boxSize={8} />
        )}
        <Text size="label.md">{Custom}</Text>
      </Flex>
    );
  }

  return (
    <Flex align="center" gap={2}>
      <Skeleton isLoaded={!publishedContractsFromDeploy.isLoading && !!imgSrc}>
        {imgSrc ? (
          <ChakraNextImage boxSize={8} src={imgSrc} alt={Custom} />
        ) : (
          <Box boxSize={8} />
        )}
      </Skeleton>
      <Skeleton isLoaded={!publishedContractsFromDeploy.isLoading}>
        <Text size="label.md">{actualPublishedContract?.name || Custom}</Text>
      </Skeleton>
    </Flex>
  );
};

interface AsyncContractNameCellProps {
  cell: {
    address: string;
    chainId: number;
    contractType: ContractType;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
  };
}

const AsyncContractNameCell: React.FC<AsyncContractNameCellProps> = ({
  cell,
}) => {
  const chainSlug = useChainSlug(cell.chainId);
  const metadataQuery = useContractMetadataWithAddress(
    cell.address,
    cell.metadata,
    cell.chainId,
  );

  return (
    <Skeleton isLoaded={!metadataQuery.isLoading}>
      <ChakraNextLink href={`/${chainSlug}/${cell.address}`} passHref>
        <Text
          color="blue.500"
          _dark={{ color: "blue.400" }}
          size="label.md"
          _groupHover={{ textDecor: "underline" }}
        >
          {metadataQuery.data?.name || shortenIfAddress(cell.address)}
        </Text>
      </ChakraNextLink>
    </Skeleton>
  );
};
