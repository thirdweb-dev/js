import {
  ConnectWallet,
  useContractList,
  useContractMetadataWithAddress,
  useWeb3,
} from "@3rdweb-sdk/react";
import { useProjects } from "@3rdweb-sdk/react/hooks/useProjects";
import { useRemoveContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  Box,
  Center,
  Container,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  SimpleGrid,
  Skeleton,
  Spinner,
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
  useDisclosure,
} from "@chakra-ui/react";
import { useNetwork } from "@thirdweb-dev/react";
import {
  CONTRACTS_MAP,
  ChainId,
  CommonContractOutputSchema,
  ContractType,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  ValidContractClass,
} from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import {
  CONTRACT_TYPE_NAME_MAP,
  FeatureIconMap,
  UrlMap,
} from "constants/mappings";
import { utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import OriginalNextLink from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { ReactElement, useEffect, useMemo } from "react";
import { AiFillCode, AiFillLayout, AiOutlineWarning } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import {
  SiGo,
  SiJavascript,
  SiPython,
  SiReact,
  SiSolidity,
} from "react-icons/si";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Column, useFilters, useGlobalFilter, useTable } from "react-table";
import {
  AddressCopyButton,
  Badge,
  Button,
  Card,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import {
  SupportedChainIdToNetworkMap,
  getNetworkFromChainId,
} from "utils/network";
import { shortenIfAddress } from "utils/usedapp-external";
import { z } from "zod";

export default function Dashboard() {
  const router = useRouter();
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const { address } = useWeb3();

  const dashboardAddress = useMemo(() => {
    return wallet === "dashboard"
      ? address
      : utils.isAddress(wallet)
      ? wallet
      : address;
  }, [address, wallet]);

  const { data: projects, isFetched: projectsIsFetched } =
    useProjects(dashboardAddress);

  const mainnetQuery = useContractList(ChainId.Mainnet, dashboardAddress);
  const rinkebyQuery = useContractList(ChainId.Rinkeby, dashboardAddress);
  const goerliQuery = useContractList(ChainId.Goerli, dashboardAddress);
  const polygonQuery = useContractList(ChainId.Polygon, dashboardAddress);
  const mumbaiQuery = useContractList(ChainId.Mumbai, dashboardAddress);
  const fantomQuery = useContractList(ChainId.Fantom, dashboardAddress);
  const fantomTestnetQuery = useContractList(
    ChainId.FantomTestnet,
    dashboardAddress,
  );
  const avalancheQuery = useContractList(ChainId.Avalanche, dashboardAddress);
  const avalancheFujiTestnetQuery = useContractList(
    ChainId.AvalancheFujiTestnet,
    dashboardAddress,
  );
  const optimismQuery = useContractList(ChainId.Optimism, dashboardAddress);
  const optimismTestnetQuery = useContractList(
    ChainId.OptimismTestnet,
    dashboardAddress,
  );
  const arbitrumQuery = useContractList(ChainId.Arbitrum, dashboardAddress);
  const arbitrumTestnetQuery = useContractList(
    ChainId.ArbitrumTestnet,
    dashboardAddress,
  );

  const combinedList = useMemo(() => {
    return (
      mainnetQuery.data?.map((d) => ({ ...d, chainId: ChainId.Mainnet })) || []
    )
      .concat(
        rinkebyQuery.data?.map((d) => ({ ...d, chainId: ChainId.Rinkeby })) ||
          [],
      )
      .concat(
        goerliQuery.data?.map((d) => ({ ...d, chainId: ChainId.Goerli })) || [],
      )
      .concat(
        polygonQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.Polygon,
        })) || [],
      )
      .concat(
        mumbaiQuery.data?.map((d) => ({ ...d, chainId: ChainId.Mumbai })) || [],
      )
      .concat(
        avalancheQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.Avalanche,
        })) || [],
      )
      .concat(
        avalancheFujiTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.AvalancheFujiTestnet,
        })) || [],
      )
      .concat(
        fantomQuery.data?.map((d) => ({ ...d, chainId: ChainId.Fantom })) || [],
      )
      .concat(
        fantomTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.FantomTestnet,
        })) || [],
      )
      .concat(
        optimismQuery.data?.map((d) => ({ ...d, chainId: ChainId.Optimism })) ||
          [],
      )
      .concat(
        optimismTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.OptimismTestnet,
        })) || [],
      )
      .concat(
        arbitrumQuery.data?.map((d) => ({ ...d, chainId: ChainId.Arbitrum })) ||
          [],
      )
      .concat(
        arbitrumTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.ArbitrumTestnet,
        })) || [],
      );
  }, [
    mainnetQuery.data,
    rinkebyQuery.data,
    goerliQuery.data,
    polygonQuery.data,
    mumbaiQuery.data,
    fantomQuery.data,
    fantomTestnetQuery.data,
    avalancheQuery.data,
    avalancheFujiTestnetQuery.data,
    optimismQuery.data,
    optimismTestnetQuery.data,
    arbitrumQuery.data,
    arbitrumTestnetQuery.data,
  ]);

  const isFetched =
    mainnetQuery.isFetched &&
    rinkebyQuery.isFetched &&
    goerliQuery.isFetched &&
    polygonQuery.isFetched &&
    mumbaiQuery.isFetched &&
    fantomQuery.isFetched &&
    fantomTestnetQuery.isFetched &&
    avalancheQuery.isFetched &&
    avalancheFujiTestnetQuery.isFetched &&
    optimismQuery.isFetched &&
    optimismTestnetQuery.isFetched &&
    arbitrumQuery.isFetched &&
    arbitrumTestnetQuery.isFetched &&
    projectsIsFetched;

  useEffect(() => {
    if (isFetched && combinedList.length === 0 && projects?.length === 0) {
      router.replace("/contracts/new");
    }
  }, [isFetched, router, combinedList, projects]);

  return (
    <Flex direction="column" gap={8}>
      {wallet === "dashboard" && !address ? (
        <NoWallet />
      ) : (
        <>
          {combinedList.length === 0 && projects?.length === 0 ? (
            <Box
              position="absolute"
              left="50%"
              top="50%"
              transform="translate(-50%, -50%)"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Box>
          ) : (
            <>
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
              {projects && projects.length ? (
                <>
                  <Tabs>
                    <TabList>
                      <Tab>V2 Contracts</Tab>
                      <Tab>V1 Projects</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel px={0} pt={8}>
                        {combinedList.length === 0 ? (
                          <NoContracts />
                        ) : (
                          <ContractTable combinedList={combinedList} />
                        )}
                      </TabPanel>
                      <TabPanel px={0} pt={8}>
                        <OldProjects projects={projects} />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </>
              ) : (
                <ContractTable combinedList={combinedList} />
              )}
              <LearnMoreSection />
            </>
          )}
        </>
      )}
    </Flex>
  );
}

Dashboard.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

const LearnMoreSection: React.FC = () => {
  const { trackEvent } = useTrack();
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
      <Card
        p={6}
        as={LinkBox}
        _hover={{ borderColor: "primary.600" }}
        role="group"
      >
        <Flex flexDir="column" gap={3}>
          <Flex>
            <Flex
              borderRadius="full"
              boxSize={9}
              justifyContent="center"
              alignItems="center"
              border="1px solid"
              borderColor="borderColor"
              overflow="hidden"
              bg="yellow"
              p={1.5}
              shadow="md"
            >
              <Icon boxSize="full" as={SiJavascript} bg="black" fill="yellow" />
            </Flex>
            <Flex
              bgColor="backgroundCardHighlight"
              borderRadius="full"
              boxSize={9}
              justifyContent="center"
              alignItems="center"
              ml={-4}
              border="1px solid"
              borderColor="borderColor"
              p={1.5}
              overflow="hidden"
              shadow="md"
              _groupHover={{
                ml: -2,
              }}
              transition="all 0.2s"
            >
              <Icon as={SiPython} boxSize="full" fill="#3e7aac" />
            </Flex>
            <Flex
              bgColor="backgroundCardHighlight"
              borderRadius="full"
              boxSize={9}
              justifyContent="center"
              alignItems="center"
              ml={-4}
              border="1px solid"
              borderColor="borderColor"
              p={1.5}
              overflow="hidden"
              shadow="md"
              _groupHover={{
                ml: -2,
              }}
              transition="all 0.2s"
            >
              <Icon as={SiReact} boxSize="full" fill="#61dafb" />
            </Flex>
            <Flex
              bgColor="backgroundCardHighlight"
              borderRadius="full"
              boxSize={9}
              justifyContent="center"
              alignItems="center"
              ml={-4}
              border="1px solid"
              borderColor="borderColor"
              p={1.5}
              overflow="hidden"
              shadow="md"
              _groupHover={{
                ml: -2,
              }}
              transition="all 0.2s"
            >
              <Icon as={SiGo} boxSize="full" fill="#50b7e0" />
            </Flex>
            <Flex
              bgColor="backgroundCardHighlight"
              borderRadius="full"
              boxSize={9}
              justifyContent="center"
              alignItems="center"
              ml={-4}
              border="1px solid"
              borderColor="borderColor"
              p={1.5}
              overflow="hidden"
              shadow="md"
              _groupHover={{
                ml: -2,
              }}
              transition="all 0.2s"
            >
              <Icon
                as={SiSolidity}
                boxSize="full"
                fill="#1C1C1C"
                _dark={{ filter: "invert(1)" }}
              />
            </Flex>
          </Flex>
          <Flex flexDir="column" gap={1}>
            <LinkOverlay
              href="https://portal.thirdweb.com/"
              isExternal
              onClick={() =>
                trackEvent({
                  category: "learn-more",
                  action: "click",
                  label: "sdks",
                })
              }
            >
              <Heading size="title.sm">
                Discover our{" "}
                <Heading
                  as="span"
                  size="title.sm"
                  bgGradient="linear(to-tl, blue.300, purple.400)"
                  _light={{
                    bgGradient: "linear(to-tl, purple.500, blue.500)",
                  }}
                  bgClip="text"
                >
                  SDKs
                </Heading>
              </Heading>
            </LinkOverlay>
            <Text size="body.md">JavaScript, Python, React, Go, etc.</Text>
          </Flex>
        </Flex>
      </Card>
      <Card p={6} as={LinkBox} _hover={{ borderColor: "primary.600" }}>
        <Flex flexDir="column" gap={3}>
          <Icon as={AiFillCode} boxSize={9} />
          <Flex flexDir="column" gap={1}>
            <LinkOverlay
              href="https://portal.thirdweb.com/deploy"
              isExternal
              onClick={() =>
                trackEvent({
                  category: "learn-more",
                  action: "click",
                  label: "thirdweb-deploy",
                })
              }
            >
              <Heading size="title.sm">
                <Heading
                  as="span"
                  size="title.sm"
                  bgGradient="linear(to-tr, blue.300, purple.400)"
                  _light={{
                    bgGradient: "linear(to-tr, purple.500, blue.500)",
                  }}
                  bgClip="text"
                >
                  thirdweb deploy
                </Heading>
              </Heading>
            </LinkOverlay>
            <Text size="body.md">Your own contracts, all of our tools.</Text>
          </Flex>
        </Flex>
      </Card>
      <Card p={6} as={LinkBox} _hover={{ borderColor: "primary.600" }}>
        <Flex flexDir="column" gap={3}>
          <Icon as={AiFillLayout} boxSize={9} />
          <Flex flexDir="column" gap={1}>
            <LinkOverlay
              href="https://portal.thirdweb.com/pre-built-contracts"
              isExternal
              onClick={() =>
                trackEvent({
                  category: "learn-more",
                  action: "click",
                  label: "pre-built-contracts",
                })
              }
            >
              <Heading size="title.sm">
                Explore our{" "}
                <Heading
                  as="span"
                  size="title.sm"
                  bgGradient="linear(to-l, blue.300, purple.400)"
                  _light={{
                    bgGradient: "linear(to-l, purple.500, blue.500)",
                  }}
                  bgClip="text"
                >
                  pre-built contracts
                </Heading>
              </Heading>
            </LinkOverlay>
            <Text size="body.md">Your Solidity quick-start</Text>
          </Flex>
        </Flex>
      </Card>
    </SimpleGrid>
  );
};

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
        Cell: (cell: any) => {
          return <AsyncContractCell cell={cell.row.original} />;
        },
      },
      {
        Header: "Contract Type",
        accessor: (row) => row.contractType,
        Cell: (cell: any) => {
          const src =
            FeatureIconMap[cell.row.original.contractType as ContractType];
          return (
            <Flex align="center" gap={2}>
              {src ? (
                <ChakraNextImage
                  boxSize={8}
                  src={src}
                  alt={
                    CONTRACT_TYPE_NAME_MAP[
                      cell.row.original.contractType as ContractType
                    ]
                  }
                />
              ) : (
                <Image
                  boxSize={8}
                  src=""
                  alt={
                    CONTRACT_TYPE_NAME_MAP[
                      cell.row.original.contractType as ContractType
                    ]
                  }
                />
              )}
              <Text size="label.md">
                {
                  CONTRACT_TYPE_NAME_MAP[
                    cell.row.original.contractType as ContractType
                  ]
                }
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
        Cell: (cell: any) => {
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
        Cell: (cell: any) => {
          return <AddressCopyButton address={cell.row.original.address} />;
        },
      },
      {
        Header: "Actions",
        Cell: (cell: any) => (
          <RemoveContract
            contractType={cell.row.original.contractType}
            contractAddress={cell.row.original.address}
            targetChainId={cell.row.original.chainId}
          />
        ),
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: combinedList,
        defaultColumn,
      },
      useFilters,
      useGlobalFilter,
    );

  const router = useRouter();

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

                  const href = `/${getNetworkFromChainId(
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
  const metadataQuery = useContractMetadataWithAddress(
    cell.address,
    cell.metadata,
    cell.chainId,
  );

  const contractTypeUrlSegment =
    cell.contractType === "custom" ? "" : `/${UrlMap[cell.contractType]}`;

  const href = `/${getNetworkFromChainId(
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
          <Flex direction="column" gap={2} align="center">
            <Heading size="title.md" textAlign="center">
              You don&apos;t have any contracts
            </Heading>
            <Text size="body.lg" textAlign="center">
              We found projects on thirdweb v1, but you don&apos;t have any
              contracts on thirdweb v2, deploy a contract go get started or
              navigate to V1 contracts.
            </Text>
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
          <Flex direction="column" gap={2} align="center">
            <Heading size="title.md">Connect your wallet</Heading>
            <Text size="body.lg" textAlign="center">
              You need to connect your wallet to deploy and interact with your
              contracts.
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
        Cell: (cell: any) => {
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
        Cell: (cell: any) => {
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
        Cell: (cell: any) => {
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

interface IRemoveContract {
  contractAddress: string;
  contractType: string;
  targetChainId: number;
}

const RemoveContract: React.FC<IRemoveContract> = ({
  contractAddress,
  contractType,
  targetChainId,
}) => {
  const { chainId, getNetworkMetadata } = useWeb3();
  const { mutate, isLoading } = useRemoveContractMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const signerChainId = chainId as SUPPORTED_CHAIN_ID;
  const [network, switchNetwork] = useNetwork();
  const initialFocusRef = React.useRef<HTMLButtonElement>(null);

  const actuallyCanAttemptSwitch = !!switchNetwork;

  const signerNetworkIsSupported =
    signerChainId in SupportedChainIdToNetworkMap;

  const walletNetwork = (
    signerNetworkIsSupported
      ? getNetworkFromChainId(signerChainId)
      : getNetworkMetadata(signerChainId as unknown as number).chainName
  )
    .split("")
    .map((s, idx) => (idx === 0 ? s.toUpperCase() : s))
    .join("");

  const twNetwork = getNetworkFromChainId(targetChainId)
    .split("")
    .map((s, idx) => (idx === 0 ? s.toUpperCase() : s))
    .join("");

  const onSwitchWallet = React.useCallback(async () => {
    if (actuallyCanAttemptSwitch && targetChainId) {
      await switchNetwork(targetChainId);
    }
    onClose();
  }, [targetChainId, actuallyCanAttemptSwitch, onClose, switchNetwork]);

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopoverAnchor>
        <Button
          padding={0}
          ml="16px"
          borderRadius="md"
          variant="outline"
          size="sm"
          isLoading={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!isOpen) {
              onOpen();
            }
          }}
        >
          <Icon as={FaTrash} boxSize={3} />
        </Button>
      </PopoverAnchor>

      <Card
        maxW="sm"
        w="auto"
        as={PopoverContent}
        bg="backgroundCardHighlight"
        mx={6}
        boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
      >
        <PopoverArrow bg="backgroundCardHighlight" />
        {chainId === targetChainId ? (
          <PopoverBody>
            <Flex direction="column" gap={4}>
              <Text>
                Removing this contract will permanently remove it from the
                dashboard. Your contract will{" "}
                <strong>still exist on the blockchain</strong>.
              </Text>

              <Button
                ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
                leftIcon={<Icon as={VscDebugDisconnect} />}
                size="sm"
                borderRadius="md"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  mutate({
                    contractAddress,
                    contractType,
                    chainId: targetChainId,
                  });
                  onClose();
                }}
                isLoading={isLoading}
                isDisabled={!actuallyCanAttemptSwitch}
                colorScheme="red"
              >
                Remove Contract
              </Button>

              {!actuallyCanAttemptSwitch && (
                <Text size="body.sm" fontStyle="italic">
                  Your connected wallet does not support programatic switching.
                  <br />
                  Please manually switch the network in your wallet.
                </Text>
              )}
            </Flex>
          </PopoverBody>
        ) : (
          <PopoverBody>
            <Flex direction="column" gap={4}>
              <Heading size="label.lg">
                <Flex gap={2} align="center">
                  <Icon boxSize={6} as={AiOutlineWarning} />
                  <span>Network Mismatch</span>
                </Flex>
              </Heading>

              <Text>
                Your wallet is connected to the <strong>{walletNetwork}</strong>{" "}
                network but this action requires you to connect to the{" "}
                <strong>{twNetwork}</strong> network.
              </Text>

              <Button
                ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
                leftIcon={<Icon as={VscDebugDisconnect} />}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSwitchWallet();
                }}
                isLoading={network.loading}
                isDisabled={!actuallyCanAttemptSwitch}
                colorScheme="orange"
              >
                Switch wallet to {twNetwork}
              </Button>

              {!actuallyCanAttemptSwitch && (
                <Text size="body.sm" fontStyle="italic">
                  Your connected wallet does not support programatic switching.
                  <br />
                  Please manually switch the network in your wallet.
                </Text>
              )}
            </Flex>
          </PopoverBody>
        )}
      </Card>
    </Popover>
  );
};
