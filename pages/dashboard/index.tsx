import {
  useAllContractList,
  useContractMetadataWithAddress,
  useWeb3,
} from "@3rdweb-sdk/react";
import {
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
  SimpleGrid,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AiFillCode } from "@react-icons/all-files/ai/AiFillCode";
import { AiFillLayout } from "@react-icons/all-files/ai/AiFillLayout";
import { SiGo } from "@react-icons/all-files/si/SiGo";
import { SiJavascript } from "@react-icons/all-files/si/SiJavascript";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { useAddress } from "@thirdweb-dev/react";
import {
  ChainId,
  CommonContractOutputSchema,
  ContractType,
  PrebuiltContractType,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { useReleasesFromDeploy } from "components/contract-components/hooks";
import { NoWallet } from "components/contract-components/shared/no-wallet";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { ReleasedContracts } from "components/contract-components/tables/released-contracts";
import { CONTRACT_TYPE_NAME_MAP, FeatureIconMap } from "constants/mappings";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { utils } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import OriginalNextLink from "next/link";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import * as React from "react";
import { ReactElement, useMemo } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { SiSolidity } from "react-icons/si";
import { Column, useFilters, useGlobalFilter, useTable } from "react-table";
import { AddressCopyButton, Badge, Card, Heading, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { getNetworkFromChainId } from "utils/network";
import { shortenIfAddress } from "utils/usedapp-external";
import { z } from "zod";

const Dashboard: ThirdwebNextPage = () => {
  const wallet = useSingleQueryParam("wallet") || "dashboard";
  const address = useAddress();

  const dashboardAddress = useMemo(() => {
    return wallet === "dashboard"
      ? address
      : utils.isAddress(wallet)
      ? wallet
      : address;
  }, [address, wallet]);

  const allContractList = useAllContractList(dashboardAddress);

  return (
    <Flex direction="column" gap={8}>
      {wallet === "dashboard" && !address ? (
        <NoWallet />
      ) : (
        <>
          <DeployedContracts
            address={dashboardAddress}
            contractListQuery={allContractList}
            limit={50}
          />
          {/* this section needs to be on the publishersdk context (polygon SDK) */}
          <PublisherSDKContext>
            <ReleasedContracts address={dashboardAddress} />
          </PublisherSDKContext>
          <LearnMoreSection />
        </>
      )}
    </Flex>
  );
};

Dashboard.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
Dashboard.pageId = PageId.Dashboard;

export default Dashboard;

const LearnMoreSection: React.FC = () => {
  const trackEvent = useTrack();
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
                  prebuilt contracts
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
  isFetching?: boolean;
}

export const ContractTable: ComponentWithChildren<ContractTableProps> = ({
  combinedList,
  children,
  isFetching,
}) => {
  const { getNetworkMetadata } = useWeb3();

  const columns = useMemo(
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
    <Card p={0} overflowX="auto" position="relative" overflowY="hidden">
      {isFetching && (
        <Spinner
          color="primary"
          size="xs"
          position="absolute"
          top={2}
          right={4}
        />
      )}
      <Table
        {...getTableProps()}
        bg="backgroundHighlight"
        p={4}
        borderTopRadius="lg"
        overflow="hidden"
      >
        <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Th
                  borderBottomColor="borderColor"
                  {...column.getHeaderProps()}
                >
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
                  const href = `/${getNetworkFromChainId(
                    row.original.chainId as SUPPORTED_CHAIN_ID,
                  )}/${row.original.address}`;

                  router.push(href);
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
          })}
        </Tbody>
      </Table>
      {children}
    </Card>
  );
};

interface AsyncContractTypeCellProps {
  cell: {
    address: string;
    chainId: SUPPORTED_CHAIN_ID;
    contractType: ContractType;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
  };
}

const AsyncContractTypeCell: React.FC<AsyncContractTypeCellProps> = ({
  cell,
}) => {
  const isPrebuiltContract = cell.contractType !== "custom";

  const releasesFromDeploy = useReleasesFromDeploy(
    isPrebuiltContract ? undefined : cell.address || undefined,
    cell.chainId as SUPPORTED_CHAIN_ID,
  );
  const src = FeatureIconMap[cell.contractType as ContractType];

  if (isPrebuiltContract) {
    return (
      <Flex align="center" gap={2}>
        {src ? (
          <ChakraNextImage
            boxSize={8}
            src={src}
            alt={CONTRACT_TYPE_NAME_MAP[cell.contractType as ContractType]}
          />
        ) : (
          <Image
            boxSize={8}
            src=""
            alt={CONTRACT_TYPE_NAME_MAP[cell.contractType as ContractType]}
          />
        )}
        <Text size="label.md">
          {CONTRACT_TYPE_NAME_MAP[cell.contractType as ContractType]}
        </Text>
      </Flex>
    );
  }

  const actualRelease = releasesFromDeploy.data
    ? releasesFromDeploy.data[0]
    : null;

  if (!releasesFromDeploy.isLoading && !actualRelease) {
    return (
      <Flex align="center" gap={2}>
        {src ? (
          <ChakraNextImage
            boxSize={8}
            src={src}
            alt={CONTRACT_TYPE_NAME_MAP["custom"]}
          />
        ) : (
          <Image boxSize={8} src="" alt={CONTRACT_TYPE_NAME_MAP["custom"]} />
        )}
        <Text size="label.md">{CONTRACT_TYPE_NAME_MAP["custom"]}</Text>
      </Flex>
    );
  }

  return (
    <Flex align="center" gap={2}>
      <Skeleton isLoaded={!releasesFromDeploy.isLoading}>
        <ChakraNextImage
          boxSize={8}
          src={src}
          alt={CONTRACT_TYPE_NAME_MAP["custom"]}
        />
      </Skeleton>
      <Skeleton isLoaded={!releasesFromDeploy.isLoading}>
        <Text size="label.md">
          {actualRelease?.name || CONTRACT_TYPE_NAME_MAP["custom"]}
        </Text>
      </Skeleton>
    </Flex>
  );
};

interface AsyncContractNameCellProps {
  cell: {
    address: string;
    chainId: SUPPORTED_CHAIN_ID;
    contractType: ContractType;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
  };
}

const AsyncContractNameCell: React.FC<AsyncContractNameCellProps> = ({
  cell,
}) => {
  const metadataQuery = useContractMetadataWithAddress(
    cell.address,
    cell.metadata,
    cell.chainId,
  );

  const href = `/${getNetworkFromChainId(cell.chainId as SUPPORTED_CHAIN_ID)}/${
    cell.address
  }`;

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
