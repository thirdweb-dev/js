import { ImportModal } from "../import-contract/modal";
import { ShowMoreButton } from "./show-more-button";
import {
  useAllContractList,
  useContractMetadataWithAddress,
} from "@3rdweb-sdk/react";
import { useRemoveContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  ButtonGroup,
  Center,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChainId,
  CommonContractOutputSchema,
  ContractType,
  ContractWithMetadata,
  PrebuiltContractType,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk/evm";
import { MismatchButton } from "components/buttons/MismatchButton";
import { GettingStartedBox } from "components/getting-started/box";
import { GettingStartedCard } from "components/getting-started/card";
import { ChainIcon } from "components/icons/ChainIcon";
import { NetworkSelectDropdown } from "components/selects/NetworkSelectDropdown";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { useAllChainsData } from "hooks/chains/allChains";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useRouter } from "next/router";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiFilePlus,
  FiMoreVertical,
  FiPlus,
  FiX,
} from "react-icons/fi";
import {
  Column,
  ColumnInstance,
  Row,
  useFilters,
  usePagination,
  useTable,
} from "react-table";
import {
  Badge,
  Button,
  ChakraNextLink,
  CodeBlock,
  Heading,
  LinkButton,
  MenuItem,
  Text,
  TrackedIconButton,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { TableContainer } from "tw-components/table-container";
import { ComponentWithChildren } from "types/component-with-children";
import { shortenIfAddress } from "utils/usedapp-external";
import { z } from "zod";
import { usePublishedContractsFromDeploy } from "../hooks";

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
  const router = useRouter();

  const modalState = useDisclosure();

  const chainIdsWithDeployments = useMemo(() => {
    const set = new Set<number>();
    contractListQuery.data.forEach((contract) => {
      set.add(contract.chainId);
    });
    return [...set];
  }, [contractListQuery.data]);

  return (
    <>
      {!noHeader && (
        <>
          <ImportModal
            isOpen={modalState.isOpen}
            onClose={modalState.onClose}
          />
          <Flex
            justify="space-between"
            align="top"
            gap={4}
            direction={{ base: "column", lg: "row" }}
            py={{ base: 4, md: 8 }}
          >
            <Flex gap={2} direction="column">
              <Heading size="title.md">Your contracts</Heading>
              <Text fontStyle="italic" maxW="container.md">
                The list of contract instances that you have deployed or
                imported with thirdweb across all networks.
              </Text>
            </Flex>
            <ButtonGroup>
              <Button
                leftIcon={<FiFilePlus />}
                variant="outline"
                onClick={modalState.onOpen}
              >
                Import contract
              </Button>
              <LinkButton
                leftIcon={<FiPlus />}
                colorScheme="primary"
                href="/explore"
              >
                Deploy contract
              </LinkButton>
            </ButtonGroup>
          </Flex>
        </>
      )}

      <ContractTable
        combinedList={contractListQuery.data}
        limit={limit}
        chainIdsWithDeployments={chainIdsWithDeployments}
      >
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
                        Get started with the <b>Solidity SDK</b> to create
                        custom contracts specific to your use case.
                      </>
                    }
                    icon={require("public/assets/product-icons/extensions.png")}
                    linkProps={{
                      category: "getting-started",
                      label: "custom-contracts",
                      href: "https://portal.thirdweb.com/solidity",
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
      </ContractTable>
    </>
  );
};

type RemoveFromDashboardButtonProps = {
  chainId: number;
  contractAddress: string;
  registry: "old" | "new";
};

const RemoveFromDashboardButton: React.FC<RemoveFromDashboardButtonProps> = ({
  chainId,
  contractAddress,
  registry,
}) => {
  const mutation = useRemoveContractMutation();

  if (registry === "old") {
    return (
      <CustomSDKContext desiredChainId={chainId}>
        <MismatchButton
          borderWidth={0}
          onClick={(e) => {
            e.stopPropagation();
            mutation.mutate({ chainId, contractAddress, registry });
          }}
          isDisabled={mutation.isLoading}
        >
          <Flex align="center" gap={2} w="full">
            {mutation.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Icon as={FiX} color="red.500" />
            )}
            <Heading as="span" size="label.md">
              Remove from dashboard
            </Heading>
          </Flex>
        </MismatchButton>
      </CustomSDKContext>
    );
  }
  return (
    <MenuItem
      onClick={(e) => {
        e.stopPropagation();
        mutation.mutate({ chainId, contractAddress, registry });
      }}
      isDisabled={mutation.isLoading}
      closeOnSelect={false}
      icon={
        mutation.isLoading ? (
          <Spinner size="sm" />
        ) : (
          <Icon as={FiX} color="red.500" />
        )
      }
    >
      Remove from dashboard
    </MenuItem>
  );
};

type SelectNetworkFilterProps = {
  column: ColumnInstance<{
    chainId: number;
    address: string;
    contractType: () => Promise<ContractType>;
    metadata: () => Promise<z.output<typeof CommonContractOutputSchema>>;
    extensions: () => Promise<string[]>;
  }>;
  chainIdsWithDeployments: number[];
};

// This is a custom filter UI for selecting from a list of chains that the user deployed to
function SelectNetworkFilter({
  column: { setFilter },
  chainIdsWithDeployments,
}: SelectNetworkFilterProps) {
  if (chainIdsWithDeployments.length < 2) {
    return <> NETWORK </>;
  }
  return (
    <NetworkSelectDropdown
      useCleanChainName={true}
      enabledChainIds={chainIdsWithDeployments}
      onSelect={(selectedChain) => {
        setFilter(selectedChain?.chainId.toString());
      }}
    />
  );
}

interface ContractTableProps {
  combinedList: {
    chainId: ChainId;
    address: string;
    contractType: () => Promise<ContractType>;
    metadata: () => Promise<z.output<typeof CommonContractOutputSchema>>;
    extensions: () => Promise<string[]>;
  }[];
  isFetching?: boolean;
  limit: number;
  chainIdsWithDeployments: number[];
}

export const ContractTable: ComponentWithChildren<ContractTableProps> = ({
  combinedList,
  children,
  isFetching,
  limit,
  chainIdsWithDeployments,
}) => {
  const { chainIdToChainRecord } = useAllChainsData();
  const configuredChains = useSupportedChainsRecord();

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
        Header: "Type",
        accessor: (row) => row.extensions,
        Cell: (cell: any) => <AsyncContractTypeCell cell={cell.row.original} />,
      },
      {
        // No header, show filter instead
        Header: () => null,
        id: "Network",
        accessor: (row) => row.chainId,
        Filter: (props) => (
          <SelectNetworkFilter
            {...props}
            chainIdsWithDeployments={chainIdsWithDeployments}
          />
        ),
        filter: "equals",
        Cell: (cell: any) => {
          const data =
            configuredChains[cell.row.original.chainId] ||
            chainIdToChainRecord[cell.row.original.chainId];
          const cleanedChainName =
            data?.name?.replace("Mainnet", "").trim() ||
            `Unknown Network (#${cell.row.original.chainId})`;
          return (
            <Flex align="center" gap={2}>
              <ChainIcon size={24} ipfsSrc={data?.icon?.url} />
              <Text size="label.md">{cleanedChainName}</Text>
              {data?.testnet && (
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
      {
        id: "actions",
        Cell: (cell: any) => {
          return (
            <Menu isLazy>
              <MenuButton
                as={TrackedIconButton}
                icon={<FiMoreVertical />}
                variant="gost"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList onClick={(e) => e.stopPropagation()}>
                <RemoveFromDashboardButton
                  contractAddress={cell.cell.row.original.address}
                  chainId={cell.cell.row.original.chainId}
                  registry={
                    cell.cell.row.original._isMultiChain ? "new" : "old"
                  }
                />
              </MenuList>
            </Menu>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configuredChains, chainIdsWithDeployments],
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: "",
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    setPageSize,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data: combinedList,
      defaultColumn,
    },
    useFilters,
    usePagination,
  );

  // the ShowMoreButton component callback sets this state variable
  const [numRowsOnPage, setNumRowsOnPage] = useState(limit);
  // when the state variable is updated, update the page size
  useEffect(() => {
    setPageSize(numRowsOnPage);
  }, [numRowsOnPage, pageSize, setPageSize]);

  return (
    <TableContainer
      overflowX={{ base: "auto", md: "initial" }}
      // to avoid clipping the network selector menu on mobile
      minH={{ base: "600px", md: "initial" }}
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
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </Text>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {page.map((row) => {
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
      {canNextPage && (
        <ShowMoreButton
          limit={limit}
          showMoreLimit={pageSize}
          setShowMoreLimit={setNumRowsOnPage}
        />
      )}
      {children}
    </TableContainer>
  );
};

const ContractTableRow = memo(({ row }: { row: Row<ContractWithMetadata> }) => {
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
});

ContractTableRow.displayName = "ContractTableRow";

interface AsyncContractTypeCellProps {
  cell: {
    address: string;
    chainId: number;
    contractType: (() => Promise<ContractType>) | undefined;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
    extensions: () => Promise<string[]>;
  };
}

const AsyncContractTypeCell = memo(({ cell }: AsyncContractTypeCellProps) => {
  const publishedContractsFromDeployQuery = usePublishedContractsFromDeploy(
    cell.address,
    cell.chainId,
  );

  const contractType =
    publishedContractsFromDeployQuery.data?.[0]?.displayName ||
    publishedContractsFromDeployQuery.data?.[0]?.name;

  return (
    <Skeleton
      isLoaded={
        !publishedContractsFromDeployQuery.isInitialLoading ||
        publishedContractsFromDeployQuery.isLoadingError
      }
    >
      {contractType ? (
        <Text noOfLines={1} maxWidth={200} isTruncated>
          {contractType}
        </Text>
      ) : (
        <Text fontStyle="italic" opacity={0.5}>
          Custom
        </Text>
      )}
    </Skeleton>
  );
});

AsyncContractTypeCell.displayName = "AsyncContractTypeCell";

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

const AsyncContractNameCell = memo(({ cell }: AsyncContractNameCellProps) => {
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
});

AsyncContractNameCell.displayName = "AsyncContractNameCell";
