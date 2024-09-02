import {
  type useAllContractList,
  useRemoveContractMutation,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  Box,
  ButtonGroup,
  Center,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { GettingStartedBox } from "components/getting-started/box";
import { GettingStartedCard } from "components/getting-started/card";
import { ChainIcon } from "components/icons/ChainIcon";
import { NetworkSelectDropdown } from "components/selects/NetworkSelectDropdown";
import type { BasicContract } from "contract-ui/types/types";
import { useAllChainsData } from "hooks/chains/allChains";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { DownloadIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiMoreVertical, FiX } from "react-icons/fi";
import {
  type Column,
  type ColumnInstance,
  type Row,
  useFilters,
  usePagination,
  useTable,
} from "react-table";
import {
  Badge,
  CodeBlock,
  MenuItem,
  Text,
  TrackedIconButton,
} from "tw-components";
import { TableContainer } from "tw-components/table-container";
import type { ComponentWithChildren } from "types/component-with-children";
import { CopyAddressButton } from "../../../@/components/ui/CopyAddressButton";
import { Button } from "../../../@/components/ui/button";
import { ImportModal } from "../import-contract/modal";
import { AsyncContractNameCell, AsyncContractTypeCell } from "./cells";
import { ShowMoreButton } from "./show-more-button";

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
    // biome-ignore lint/complexity/noForEach: FIXME
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
              <h1 className="text-3xl font-semibold tracking-tight">
                Your contracts
              </h1>
              <p className="text-muted-foreground text-sm">
                The list of contract instances that you have deployed or
                imported with thirdweb across all networks
              </p>
            </Flex>
            <ButtonGroup>
              <Button
                className="gap-2"
                variant="outline"
                onClick={modalState.onOpen}
              >
                <DownloadIcon className="size-4" />
                Import contract
              </Button>
              <Button asChild className="gap-2">
                <Link href="/explore">
                  <PlusIcon className="size-4" />
                  Deploy contract
                </Link>
              </Button>
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
                    icon={require("../../../../public/assets/product-icons/contracts.png")}
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
                    icon={require("../../../../public/assets/product-icons/extensions.png")}
                    linkProps={{
                      category: "getting-started",
                      label: "custom-contracts",
                      href: "https://portal.thirdweb.com/contracts/build/overview",
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
                    icon={require("../../../../public/assets/product-icons/deploy.png")}
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
};

const RemoveFromDashboardButton: React.FC<RemoveFromDashboardButtonProps> = ({
  chainId,
  contractAddress,
}) => {
  const mutation = useRemoveContractMutation();

  return (
    <MenuItem
      onClick={(e) => {
        e.stopPropagation();
        mutation.mutate({ chainId, contractAddress });
      }}
      isDisabled={mutation.isLoading}
      closeOnSelect={false}
      className="!bg-background hover:!bg-accent"
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
  column: ColumnInstance<BasicContract>;
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
  combinedList: BasicContract[];
  isFetching?: boolean;
  limit: number;
  chainIdsWithDeployments: number[];
}

const ContractTable: ComponentWithChildren<ContractTableProps> = ({
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
        accessor: (row) => row.address,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return <AsyncContractNameCell cell={cell.row.original} />;
        },
      },
      {
        Header: "Type",
        accessor: (row) => row.address,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
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
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
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
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return (
            <CopyAddressButton
              copyIconPosition="left"
              address={cell.row.original.address}
              variant="ghost"
            />
          );
        },
      },
      {
        id: "actions",
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return (
            <Menu isLazy>
              <MenuButton
                as={TrackedIconButton}
                icon={<FiMoreVertical />}
                variant="gost"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList
                onClick={(e) => e.stopPropagation()}
                className="bg-background"
              >
                <RemoveFromDashboardButton
                  contractAddress={cell.cell.row.original.address}
                  chainId={cell.cell.row.original.chainId}
                />
              </MenuList>
            </Menu>
          );
        },
      },
    ],
    [configuredChains, chainIdsWithDeployments, chainIdToChainRecord],
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
    // these will be removed with the @tanstack/react-table v8 version
    // eslint-disable-next-line react-compiler/react-compiler
    useFilters,
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );

  // the ShowMoreButton component callback sets this state variable
  const [numRowsOnPage, setNumRowsOnPage] = useState(limit);
  // when the state variable is updated, update the page size

  // FIXME: re-work tables and pagination with @tanstack/table@latest - which (I believe) does not need this workaround anymore
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setPageSize(numRowsOnPage);
  }, [numRowsOnPage, setPageSize]);

  return (
    <TableContainer
      overflowX={{ base: "auto", md: "initial" }}
      // to avoid clipping the network selector menu on mobile
      minH={{ base: "600px", md: "initial" }}
      className="relative"
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
      <Table {...getTableProps()} className="bg-background">
        <Thead className="!bg-muted/50">
          {headerGroups.map((headerGroup, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                <Th {...column.getHeaderProps()} border="none" key={i}>
                  <Text as="label" size="label.sm" color="faded">
                    {column.render("Header")}
                    <Box>
                      {column.canFilter ? column.render("Filter") : null}
                    </Box>
                  </Text>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()} className="!bg-background">
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

const ContractTableRow = memo(({ row }: { row: Row<BasicContract> }) => {
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
      className="hover:bg-muted/50"
    >
      {row.cells.map((cell, cellIndex) => {
        return (
          <Td
            borderBottomWidth="inherit"
            borderBottomColor="borderColor"
            {...cell.getCellProps()}
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={cellIndex}
          >
            {cell.render("Cell")}
          </Td>
        );
      })}
    </Tr>
  );
});

ContractTableRow.displayName = "ContractTableRow";
