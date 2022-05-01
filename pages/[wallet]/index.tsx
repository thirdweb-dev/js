import { ConsolePage } from "../_app";
import {
  ConnectWallet,
  useContractList,
  useContractMetadataWithAddress,
  useWeb3,
} from "@3rdweb-sdk/react";
import { useProjects } from "@3rdweb-sdk/react/hooks/useProjects";
import {
  Box,
  Center,
  Container,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  CONTRACTS_MAP,
  CommonContractOutputSchema,
  ContractType,
  ValidContractClass,
} from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import {
  CONTRACT_TYPE_NAME_MAP,
  FeatureIconMap,
  UrlMap,
} from "constants/mappings";
import { isAddress } from "ethers/lib/utils";
import { useSingleQueryParam } from "hooks/useQueryParam";
import OriginalNextLink from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import {
  Cell,
  Column,
  useFilters,
  useGlobalFilter,
  useTable,
} from "react-table";
import {
  AddressCopyButton,
  Badge,
  Card,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import {
  ChainId,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  getNetworkFromChainId,
} from "utils/network";
import { shortenIfAddress } from "utils/usedapp-external";
import { z } from "zod";

const Dashboard: ConsolePage = () => {
  const router = useRouter();
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const { address } = useWeb3();
  const { data: projects } = useProjects();

  // redirect anything that is not a valid address or `/dashboard` to `/dashboard`
  useEffect(() => {
    if (!isAddress(wallet) && wallet !== "dashboard") {
      router.replace("/dashboard");
    }
  }, [router, wallet]);

  const dashboardAddress = useMemo(() => {
    return wallet === "dashboard"
      ? address
      : isAddress(wallet)
      ? wallet
      : address;
  }, [address, wallet]);

  const mainnetQuery = useContractList(ChainId.Mainnet, dashboardAddress);
  const polygonQuery = useContractList(ChainId.Polygon, dashboardAddress);
  const avalancheQuery = useContractList(ChainId.Avalanche, dashboardAddress);
  const fantomQuery = useContractList(ChainId.Fantom, dashboardAddress);
  const rinkebyQuery = useContractList(ChainId.Rinkeby, dashboardAddress);
  const goerliQuery = useContractList(ChainId.Goerli, dashboardAddress);
  const mumbaiQuery = useContractList(ChainId.Mumbai, dashboardAddress);

  const combinedList = useMemo(() => {
    return (
      mainnetQuery.data?.map((d) => ({ ...d, chainId: ChainId.Mainnet })) || []
    )
      .concat(
        polygonQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.Polygon,
        })) || [],
      )
      .concat(
        avalancheQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.Avalanche,
        })) || [],
      )
      .concat(
        fantomQuery.data?.map((d) => ({ ...d, chainId: ChainId.Fantom })) || [],
      )
      .concat(
        rinkebyQuery.data?.map((d) => ({ ...d, chainId: ChainId.Rinkeby })) ||
          [],
      )
      .concat(
        goerliQuery.data?.map((d) => ({ ...d, chainId: ChainId.Goerli })) || [],
      )
      .concat(
        mumbaiQuery.data?.map((d) => ({ ...d, chainId: ChainId.Mumbai })) || [],
      );
  }, [
    mainnetQuery.data,
    polygonQuery.data,
    avalancheQuery.data,
    fantomQuery.data,
    rinkebyQuery.data,
    goerliQuery.data,
    mumbaiQuery.data,
  ]);

  if (wallet === "dashboard" && !address) {
    return <NoWallet />;
  }

  return (
    <Flex direction="column" gap={8}>
      {!!combinedList.length && (
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
            href="/contracts"
          >
            Deploy new contract
          </LinkButton>
        </Flex>
      )}
      {projects && projects.length ? (
        <Tabs>
          <TabList>
            <Tab>V2 Contracts</Tab>
            <Tab>V1 Projects</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0} pt={8}>
              <ContractTable combinedList={combinedList} />
            </TabPanel>
            <TabPanel px={0} pt={8}>
              <OldProjects projects={projects} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <ContractTable combinedList={combinedList} />
      )}
    </Flex>
  );
};

Dashboard.Layout = AppLayout;

export default Dashboard;
interface ContractTableProps {
  combinedList: {
    chainId: ChainId;
    address: string;
    contractType: ContractType;
    metadata: () => Promise<z.output<typeof CommonContractOutputSchema>>;
  }[];
}

export const ContractTable: React.FC<ContractTableProps> = ({
  combinedList,
}) => {
  const { getNetworkMetadata } = useWeb3();

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) => row.metadata,
        Cell: (cell: Cell<typeof combinedList[number], "metadata">) => {
          return <AsyncContractCell cell={cell.row.original} />;
        },
      },
      {
        Header: "Contract Type",
        accessor: (row) => row.contractType,
        Cell: (cell: Cell<typeof combinedList[number], "contractType">) => {
          const src = FeatureIconMap[cell.row.original.contractType];
          return (
            <Flex align="center" gap={2}>
              {src ? (
                <ChakraNextImage
                  boxSize={8}
                  src={src}
                  alt={CONTRACT_TYPE_NAME_MAP[cell.row.original.contractType]}
                />
              ) : (
                <Image
                  boxSize={8}
                  src=""
                  alt={CONTRACT_TYPE_NAME_MAP[cell.row.original.contractType]}
                />
              )}
              <Text size="label.md">
                {CONTRACT_TYPE_NAME_MAP[cell.row.original.contractType]}
              </Text>
            </Flex>
          );
        },
        Filter: (props) => {
          const contractFilterOptions = Object.keys(
            CONTRACTS_MAP,
          ) as ContractType[];
          const filterVal = props.filterValue;

          return (
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                icon={<Icon as={IoFilterSharp} boxSize={4} />}
                aria-label="open contract type filter menu"
                size="sm"
                p={0}
                variant="ghost"
              />
              <MenuList zIndex={10}>
                <MenuOptionGroup
                  defaultValue={contractFilterOptions}
                  title="Contract Types"
                  fontSize={12}
                  type="checkbox"
                  value={filterVal}
                  onChange={(e) => props.setFilter(props.column.id, e)}
                >
                  {contractFilterOptions.map((contractType) => (
                    <MenuItemOption value={contractType} key={contractType}>
                      <Flex align="center" direction="row" gap={1}>
                        <ChakraNextImage
                          boxSize={4}
                          src={FeatureIconMap[contractType]}
                          alt={contractType}
                        />
                        <Text size="label.md">
                          {CONTRACT_TYPE_NAME_MAP[contractType]}
                        </Text>
                      </Flex>
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          );
        },
        filter: (rows, _columnIds, filterValue = []) => {
          return rows.filter((row) => {
            return filterValue.includes(row.original.contractType);
          });
        },
      },
      {
        Header: "Network",
        accessor: (row) => row.chainId,
        Cell: (cell: Cell<typeof combinedList[number], "chainId">) => {
          const data = getNetworkMetadata(
            cell.row.original.chainId as SUPPORTED_CHAIN_ID,
          );
          return (
            <Flex align="center" gap={2}>
              <Icon boxSize={6} as={data.icon} />
              <Text size="label.md">{data.chainName}</Text>
              <Badge
                colorScheme={data.isTestnet ? "blue" : "green"}
                textTransform="capitalize"
              >
                {data.isTestnet ? "Testnet" : "Mainnet"}
              </Badge>
            </Flex>
          );
        },
        Filter: (props) => {
          const options = SUPPORTED_CHAIN_IDS.map((chainId) =>
            chainId.toString(),
          );
          return (
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                icon={<Icon as={IoFilterSharp} boxSize={4} />}
                aria-label="open contract type filter menu"
                size="sm"
                variant="ghost"
                p={0}
              />
              <MenuList zIndex={10}>
                <MenuOptionGroup
                  defaultValue={options}
                  title="Networks"
                  fontSize={12}
                  type="checkbox"
                  value={props.filterValue}
                  onChange={(e) => props.setFilter(props.column.id, e)}
                >
                  {options.map((chainId) => (
                    <MenuItemOption value={chainId} key={chainId}>
                      <Flex align="center" direction="row" gap={1}>
                        <Icon
                          boxSize={4}
                          as={
                            getNetworkMetadata(
                              parseInt(chainId) as SUPPORTED_CHAIN_ID,
                            ).icon
                          }
                        />
                        <Text size="label.md">
                          {
                            getNetworkMetadata(
                              parseInt(chainId) as SUPPORTED_CHAIN_ID,
                            ).chainName
                          }
                        </Text>
                      </Flex>
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          );
        },
        filter: (rows, _columnIds, filterValue = []) => {
          return rows.filter((row) => {
            return filterValue.includes(row.original.chainId.toString());
          });
        },
      },
      {
        Header: "Contract Address",
        accessor: (row) => row.address,
        Cell: (cell: Cell<typeof combinedList[number], "address">) => {
          return <AddressCopyButton address={cell.row.original.address} />;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  ) as Column<typeof combinedList[number]>[];

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
    rows,
    prepareRow,
    // state,
    // visibleColumns,
    // preGlobalFilteredRows,
    // setGlobalFilter,
  } = useTable(
    {
      columns,
      data: combinedList,
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
  );

  const router = useRouter();

  const wallet = useSingleQueryParam("wallet") || "dashboard";

  if (!combinedList.length) {
    return <NoContracts />;
  }

  return (
    <Box w="100%" overflowX="auto">
      <Table
        {...getTableProps()}
        bg="backgroundHighlight"
        p={4}
        borderRadius="lg"
        overflow="hidden"
      >
        <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Th {...column.getHeaderProps()}>
                  <Flex align="center" gap={2}>
                    <Text as="label" size="label.md">
                      {column.render("Header")}
                    </Text>
                    {column.render("Filter")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <Tr
                {...row.getRowProps()}
                role="group"
                _hover={{ bg: "blackAlpha.50" }}
                _dark={{
                  _hover: {
                    bg: "whiteAlpha.50",
                  },
                }}
                // this is a hack to get around the fact that safari does not handle position: relative on table rows
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const contractTypeUrlSegment =
                    row.original.contractType === "custom"
                      ? ""
                      : `/${UrlMap[row.original.contractType]}`;

                  const href = `/${wallet}/${getNetworkFromChainId(
                    row.original.chainId as SUPPORTED_CHAIN_ID,
                  )}${contractTypeUrlSegment}/${row.original.address}`;

                  router.push(href);
                }}
                // end hack
                borderBottomWidth={1}
                _last={{ borderBottomWidth: 0 }}
              >
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Td borderBottomWidth="inherit" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

interface AsyncContractCellProps {
  cell: {
    address: string;
    chainId: ChainId;
    contractType: ContractType;
    metadata: () => Promise<z.output<ValidContractClass["schema"]["output"]>>;
  };
}

const AsyncContractCell: React.FC<AsyncContractCellProps> = ({ cell }) => {
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const metadataQuery = useContractMetadataWithAddress(
    cell.address,
    cell.metadata,
    cell.chainId,
  );

  const contractTypeUrlSegment =
    cell.contractType === "custom" ? "" : `/${UrlMap[cell.contractType]}`;

  const href = `/${wallet}/${getNetworkFromChainId(
    cell.chainId as SUPPORTED_CHAIN_ID,
  )}${contractTypeUrlSegment}/${cell.address}`;

  return (
    <Skeleton isLoaded={!metadataQuery.isLoading}>
      <OriginalNextLink href={href} passHref>
        <Link>
          <Text
            color="blue.700"
            _dark={{ color: "blue.300" }}
            size="label.md"
            _groupHover={{ textDecor: "underline" }}
          >
            {metadataQuery.data?.name || shortenIfAddress(cell.address)}
          </Text>
        </Link>
      </OriginalNextLink>
    </Skeleton>
  );
};

const NoContracts: React.FC = () => {
  return (
    <Center w="100%">
      <Container as={Card}>
        <Stack py={7} align="center" spacing={6} w="100%">
          <ChakraNextImage
            src={require("public/assets/illustrations/listing.png")}
            alt="no apps"
            boxSize={20}
            maxW="200px"
            mb={3}
          />
          <Flex direction="column" gap={0.5} align="center">
            <Heading size="title.md" textAlign="center">
              You don&apos;t have any contracts
            </Heading>
            <Text size="body.lg">Deploy a contract to get started</Text>
          </Flex>
          <LinkButton
            leftIcon={<FiPlus />}
            colorScheme="primary"
            href="/contracts"
          >
            Deploy new contract
          </LinkButton>
        </Stack>
      </Container>
    </Center>
  );
};

const NoWallet: React.FC = () => {
  return (
    <Center w="100%">
      <Container as={Card}>
        <Stack py={7} align="center" spacing={6} w="100%">
          <ChakraNextImage
            src={require("public/assets/illustrations/wallet.png")}
            alt="no apps"
            boxSize={20}
            maxW="200px"
            mb={3}
          />
          <Flex direction="column" gap={0.5} align="center">
            <Heading size="title.md">Connect your wallet</Heading>
            <Text size="body.lg">
              You need to connect your wallet to continue
            </Text>
          </Flex>
          <ConnectWallet />
        </Stack>
      </Container>
    </Center>
  );
};

interface IProjectCellProps {
  name: string;
  chainId: ChainId;
  address: string;
}

const ProjectCell: React.FC<IProjectCellProps> = ({
  name,
  chainId,
  address,
}) => {
  return (
    <Skeleton isLoaded={!!address}>
      <OriginalNextLink
        href={`https://v1.thirdweb.com/${getNetworkFromChainId(
          chainId as SUPPORTED_CHAIN_ID,
        )}/${address}`}
        passHref
      >
        <Link>
          <Text
            color="blue.700"
            _dark={{ color: "blue.300" }}
            size="label.md"
            _groupHover={{ textDecor: "underline" }}
          >
            {name || shortenIfAddress(address)}
          </Text>
        </Link>
      </OriginalNextLink>
    </Skeleton>
  );
};

interface IOldProjects {
  projects: {
    chainId: ChainId;
    address: string;
    name: string;
  }[];
}

const OldProjects: React.FC<IOldProjects> = ({ projects }) => {
  const { getNetworkMetadata } = useWeb3();

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        Cell: (cell: Cell<typeof projects[number], "metadata">) => {
          return (
            <ProjectCell
              name={cell.row.original.name}
              address={cell.row.original.address}
              chainId={cell.row.original.chainId}
            />
          );
        },
      },
      {
        Header: "Network",
        accessor: (row) => row.chainId,
        Cell: (cell: Cell<typeof projects[number], "chainId">) => {
          const data = getNetworkMetadata(
            cell.row.original.chainId as SUPPORTED_CHAIN_ID,
          );
          return (
            <Flex align="center" gap={2}>
              <Icon boxSize={6} as={data.icon} />
              <Text size="label.md">{data.chainName}</Text>
              <Badge
                colorScheme={data.isTestnet ? "blue" : "green"}
                textTransform="capitalize"
              >
                {data.isTestnet ? "Testnet" : "Mainnet"}
              </Badge>
            </Flex>
          );
        },
        Filter: (props) => {
          const options = SUPPORTED_CHAIN_IDS.map((chainId) =>
            chainId.toString(),
          );
          return (
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                icon={<Icon as={IoFilterSharp} boxSize={4} />}
                aria-label="open contract type filter menu"
                size="sm"
                variant="ghost"
                p={0}
              />
              <MenuList zIndex={10}>
                <MenuOptionGroup
                  defaultValue={options}
                  title="Networks"
                  fontSize={12}
                  type="checkbox"
                  value={props.filterValue}
                  onChange={(e) => props.setFilter(props.column.id, e)}
                >
                  {options.map((chainId) => (
                    <MenuItemOption value={chainId} key={chainId}>
                      <Flex align="center" direction="row" gap={1}>
                        <Icon
                          boxSize={4}
                          as={
                            getNetworkMetadata(
                              parseInt(chainId) as SUPPORTED_CHAIN_ID,
                            ).icon
                          }
                        />
                        <Text size="label.md">
                          {
                            getNetworkMetadata(
                              parseInt(chainId) as SUPPORTED_CHAIN_ID,
                            ).chainName
                          }
                        </Text>
                      </Flex>
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          );
        },
        filter: (rows, _columnIds, filterValue = []) => {
          return rows.filter((row) => {
            return filterValue.includes(row.original.chainId.toString());
          });
        },
      },
      {
        Header: "Project Address",
        accessor: (row) => row.address,
        Cell: (cell: Cell<typeof projects[number], "address">) => {
          return <AddressCopyButton address={cell.row.original.address} />;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  ) as Column<typeof projects[number]>[];

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
    rows,
    prepareRow,
    // state,
    // visibleColumns,
    // preGlobalFilteredRows,
    // setGlobalFilter,
  } = useTable(
    {
      columns,
      data: projects,
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
  );

  const router = useRouter();

  if (!projects.length) {
    return <NoContracts />;
  }

  return (
    <Box w="100%" overflowX="auto">
      <Table
        {...getTableProps()}
        bg="backgroundHighlight"
        p={4}
        borderRadius="lg"
        overflow="hidden"
      >
        <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Th {...column.getHeaderProps()}>
                  <Flex align="center" gap={2}>
                    <Text as="label" size="label.md" color="inherit">
                      {column.render("Header")}
                    </Text>
                    {column.render("Filter")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <Tr
                {...row.getRowProps()}
                role="group"
                _hover={{ bg: "blackAlpha.50" }}
                _dark={{
                  _hover: {
                    bg: "whiteAlpha.50",
                  },
                }}
                // this is a hack to get around the fact that safari does not handle position: relative on table rows
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push(
                    `https://v1.thirdweb.com/${getNetworkFromChainId(
                      row.original.chainId as SUPPORTED_CHAIN_ID,
                    )}/${row.original.address}`,
                  );
                }}
                // end hack
                borderBottomWidth={1}
                _last={{ borderBottomWidth: 0 }}
              >
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Td borderBottomWidth="inherit" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};
