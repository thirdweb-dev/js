import { ContractCellContext, ContractId } from "../types";
import { ContractDeployActionCell } from "./cells/deploy-action";
import { ContractDescriptionCell } from "./cells/description";
import { ContractImageCell } from "./cells/image";
import { ContractNameCell } from "./cells/name";
import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Column, Row, useTable } from "react-table";
import { Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface DeployableContractTableProps {
  contractIds: ContractId[];
  isFetching?: boolean;
  context?: ContractCellContext;
}

export const DeployableContractTable: ComponentWithChildren<
  DeployableContractTableProps
> = ({ contractIds, isFetching, context, children }) => {
  const tableColumns: Column<{ contractId: ContractId }>[] = useMemo(() => {
    let cols: Column<{ contractId: ContractId }>[] = [
      {
        Header: "Icon",
        accessor: (row) => row.contractId,
        Cell: (cell: any) => <ContractImageCell cell={cell} />,
      },
      {
        Header: "Name",
        accessor: (row) => row.contractId,
        Cell: (cell: any) => <ContractNameCell cell={cell} />,
      },
    ];

    if (context !== "deploy") {
      cols = [
        ...cols,
        {
          Header: "Description",
          accessor: (row) => row.contractId,
          Cell: (cell: any) => <ContractDescriptionCell cell={cell} />,
        },
      ];
    }

    cols = [
      ...cols,
      {
        id: "deploy-action",
        accessor: (row) => row.contractId,
        Cell: (cell: any) => (
          <ContractDeployActionCell cell={cell} context={context} />
        ),
      },
    ];

    return cols;
    // this is to avoid re-rendering of the table when the contractIds array changes (it will always be a string array, so we can just join it and compare the string output)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractIds.join(), context]);

  const tableInstance = useTable({
    columns: tableColumns,
    data: contractIds.map((contractId) => ({ contractId })),
  });
  return (
    <Box borderTopRadius="lg" p={0} overflowX="auto" position="relative">
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
          {tableInstance.headerGroups.map((headerGroup) => (
            <Tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps()}
                  key={column.getHeaderProps().key}
                  border="none"
                >
                  <Text as="label" size="label.md" color="faded">
                    {column.render("Header")}
                  </Text>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...tableInstance.getTableBodyProps()} position="relative">
          {tableInstance.rows.map((row) => {
            tableInstance.prepareRow(row);
            return (
              <TableRow
                row={row}
                key={row.original.contractId}
                context={context}
              />
            );
          })}
        </Tbody>
      </Table>
      {children}
    </Box>
  );
};

interface TableRowProps {
  row: Row<{ contractId: ContractId }>;
  context?: ContractCellContext;
}

const TableRow: React.FC<TableRowProps> = ({ row, context }) => {
  const router = useRouter();

  return (
    <Tr
      borderBottomWidth={1}
      role="group"
      cursor="pointer"
      _last={{ borderBottomWidth: 0 }}
      _hover={{ bg: "blackAlpha.50" }}
      _dark={{
        _hover: {
          bg: "whiteAlpha.50",
        },
      }}
      pointerEvents={row?.original?.contractId ? "auto" : "none"}
      onClick={() => {
        router.push(
          actionUrlPath(context, row.original.contractId),
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
    </Tr>
  );
};

function actionUrlPath(context: ContractCellContext | undefined, hash: string) {
  switch (context) {
    case "publish":
      return `/contracts/publish/${encodeURIComponent(hash)}`;
    case "deploy":
      return `/contracts/deploy/${encodeURIComponent(hash)}`;
    default:
      // should never happen
      return `/contracts/deploy/${encodeURIComponent(hash)}`;
  }
}
