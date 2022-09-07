import { useWeb3 } from "@3rdweb-sdk/react";
import { Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ChainId,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
} from "@thirdweb-dev/sdk";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { Column, useFilters, useGlobalFilter, useTable } from "react-table";
import { AddressCopyButton, Badge, Text } from "tw-components";
import { getNetworkFromChainId } from "utils/network";
import { shortenIfAddress } from "utils/usedapp-external";

interface OldProjectsProps {
  projects: {
    chainId: ChainId;
    address: string;
    name: string;
  }[];
}

export const OldProjects: React.FC<OldProjectsProps> = ({ projects }) => {
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
      <NextLink
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
      </NextLink>
    </Skeleton>
  );
};
