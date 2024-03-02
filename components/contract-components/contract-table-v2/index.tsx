import { PublishedContractDetails } from "../hooks";
import {
  Flex,
  Icon,
  Image,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { ContractType } from "@thirdweb-dev/sdk";
import { ChakraNextImage } from "components/Image";
import { replaceDeployerAddress } from "components/explore/publisher";
import { BuiltinContractDetails } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { Column, Row, useTable } from "react-table";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedIconButton,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { ComponentWithChildren } from "types/component-with-children";

interface PublishedContractTableProps {
  contractDetails: ContractDataInput[];
  isFetching?: boolean;
  hidePublisher?: true;
}

type ContractDataInput = BuiltinContractDetails | PublishedContractDetails;
type ContractDataRow = ContractDataInput["metadata"] & {
  id: string;
  contractType: ContractType;
};

function convertContractDataToRowData(
  input: ContractDataInput,
): ContractDataRow {
  return {
    id: input.id,
    ...input.metadata,
    contractType: (input as BuiltinContractDetails)?.contractType || "custom",
  };
}

export const PublishedContractTable: ComponentWithChildren<
  PublishedContractTableProps
> = ({ contractDetails, isFetching, children, hidePublisher }) => {
  const rows = useMemo(
    () => contractDetails.map(convertContractDataToRowData),
    [contractDetails],
  );

  const trackEvent = useTrack();

  const tableColumns: Column<ContractDataRow>[] = useMemo(() => {
    const cols: Column<ContractDataRow>[] = [
      {
        Header: "Logo",
        accessor: (row) => row.logo,
        Cell: (cell: any) =>
          cell.value ? (
            typeof cell.value === "string" ? (
              <Image alt="" src={replaceIpfsUrl(cell.value)} boxSize={8} />
            ) : (
              <ChakraNextImage alt="" src={cell.value} boxSize={8} />
            )
          ) : null,
      },
      {
        Header: "Name",
        accessor: (row) => row.name,
        Cell: (cell: any) => (
          <Heading size="label.md" whiteSpace="nowrap">
            {cell.value}
          </Heading>
        ),
      },
      {
        Header: "Description",
        accessor: (row) => row.description,
        Cell: (cell: any) => (
          <Text noOfLines={2} size="body.md">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Version",
        accessor: (row) => row.version,
        Cell: (cell: any) => <Text>{cell.value}</Text>,
      },
      {
        Header: "Published By",
        accessor: (row) => row.publisher,
        Cell: (cell: any) => <AddressCopyButton address={cell.value} />,
      },
      {
        id: "audit-badge",
        accessor: (row) => ({ audit: row.audit }),
        Cell: (cell: any) => (
          <Flex align="center" as="span" gap="2">
            {cell.value.audit ? (
              <Tooltip
                p={0}
                bg="transparent"
                boxShadow="none"
                label={
                  <Card py={2} px={4} bgColor="backgroundHighlight">
                    <Text size="label.sm">Audited Contract</Text>
                  </Card>
                }
                borderRadius="lg"
                placement="top"
              >
                <TrackedIconButton
                  size="sm"
                  as={LinkButton}
                  noIcon
                  isExternal
                  href={replaceIpfsUrl(cell.value.audit)}
                  category="deploy"
                  label="audited"
                  aria-label="Audited contract"
                  colorScheme="green"
                  variant="ghost"
                  icon={<Icon as={BsShieldFillCheck} boxSize={4} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    trackEvent({
                      category: "visit-audit",
                      action: "click",
                      label: cell.value.audit,
                    });
                  }}
                />
              </Tooltip>
            ) : null}
          </Flex>
        ),
      },
    ];

    return cols.filter(
      (col) => !hidePublisher || col.Header !== "Published By",
    );
    // this is to avoid re-rendering of the table when the contractIds array changes (it will always be a string array, so we can just join it and compare the string output)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((row) => row.name).join(), hidePublisher]);

  const tableInstance = useTable({
    columns: tableColumns,
    data: rows,
  });
  return (
    <TableContainer>
      {isFetching && (
        <Spinner
          color="primary"
          size="xs"
          position="absolute"
          top={2}
          right={4}
        />
      )}
      <Table {...tableInstance.getTableProps()}>
        <Thead>
          {tableInstance.headerGroups.map((headerGroup, headerGroupIndex) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
              {headerGroup.headers.map((column, columnIndex) => (
                <Th
                  {...column.getHeaderProps()}
                  border="none"
                  key={columnIndex}
                >
                  <Text as="label" size="label.sm" color="faded">
                    {column.render("Header")}
                  </Text>
                </Th>
              ))}
              {/* Need to add an empty header for the icon button */}
              <Th border="none" />
            </Tr>
          ))}
        </Thead>
        <Tbody {...tableInstance.getTableBodyProps()} position="relative">
          {tableInstance.rows.map((row) => {
            tableInstance.prepareRow(row);
            return <ContractTableRow row={row} key={row.getRowProps().key} />;
          })}
        </Tbody>
      </Table>
      {children}
    </TableContainer>
  );
};

interface ContractTableRowProps {
  row: Row<ContractDataRow>;
}

const ContractTableRow: React.FC<ContractTableRowProps> = ({ row }) => {
  const router = useRouter();

  return (
    <>
      <Tr
        borderBottomWidth={1}
        cursor="pointer"
        _last={{ borderBottomWidth: 0 }}
        _hover={{ bg: "blackAlpha.50", "--rowIconColor": "#a855f7" }}
        _dark={{
          _hover: {
            bg: "whiteAlpha.50",
          },
        }}
        onClick={() => {
          router.push(
            replaceDeployerAddress(
              `/${row.original.publisher}/${row.original.id}`,
            ),
            undefined,
            {
              scroll: true,
            },
          );
        }}
        {...row.getRowProps()}
      >
        {row.cells.map((cell) => (
          <Td
            {...cell.getCellProps()}
            key={cell.getCellProps().key}
            borderBottomWidth="inherit"
            borderBottomColor="borderColor"
            _last={{ textAlign: "end" }}
          >
            {cell.render("Cell")}
          </Td>
        ))}
        <Td borderBottomColor="borderColor" borderBottomWidth="inherit">
          <Icon color="var(--rowIconColor)" as={FiArrowRight} />
        </Td>
      </Tr>
    </>
  );
};
