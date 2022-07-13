import { ContractCellContext, ContractId } from "../types";
import { ContractDeployActionCell } from "./cells/deploy-action";
import { ContractDescriptionCell } from "./cells/description";
import { ContractImageCell } from "./cells/image";
import { ContractNameCell } from "./cells/name";
import { ContractVersionCell } from "./cells/version";
import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Column, useTable } from "react-table";
import { Card, Checkbox, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface DeployableContractTableProps {
  contractIds: ContractId[];
  selectable?: {
    selected: ContractId[];
    onChange: (contractIds: ContractId[]) => void;
  };
  isFetching?: boolean;
  context?: ContractCellContext;
}

export const DeployableContractTable: ComponentWithChildren<
  DeployableContractTableProps
> = ({ contractIds, selectable, isFetching, context, children }) => {
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
    if (context === "view_release" || context === "create_release") {
      cols = [
        ...cols,
        {
          Header: "Version",
          accessor: (row) => row.contractId,
          Cell: (cell: any) => <ContractVersionCell cell={cell} />,
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

    if (selectable) {
      const selectedContractIds = selectable.selected;
      cols = [
        {
          id: "selection",
          accessor: (row) => row.contractId,
          Header: () => {
            const isChecked = selectedContractIds.length === contractIds.length;
            const isIndeterminate =
              selectedContractIds.length > 0 &&
              selectedContractIds.length !== contractIds.length;
            return (
              <Checkbox
                colorScheme="primary"
                isChecked={isChecked}
                isIndeterminate={isIndeterminate}
                onChange={() => {
                  // this makes no sense but it works
                  if (isChecked) {
                    selectable.onChange([]);
                  } else {
                    selectable.onChange(contractIds);
                  }
                }}
              />
            );
          },

          Cell: ({ value }: any) => {
            const isChecked = selectedContractIds.includes(value);
            return (
              <Checkbox
                colorScheme="primary"
                onChange={() => {
                  if (isChecked) {
                    selectable.onChange(
                      selectedContractIds.filter((id) => id !== value),
                    );
                  } else {
                    selectable.onChange([...selectedContractIds, value]);
                  }
                }}
                isChecked={isChecked}
              />
            );
          },
        },
        ...cols,
      ];

      return cols as Column<{ contractId: ContractId }>[];
    }

    return cols;
    // this is to avoid re-rendering of the table when the contractIds array changes (it will always be a string array, so we can just join it and compare the string output)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractIds.join(), context, selectable]);

  const tableInstance = useTable({
    columns: tableColumns,
    data: contractIds.map((contractId) => ({ contractId })),
  });
  return (
    <Card p={0} overflowX="auto" position="relative">
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
        <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
          {tableInstance.headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Th {...column.getHeaderProps()} py={5}>
                  <Text as="label" size="label.md">
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
              // eslint-disable-next-line react/jsx-key
              <Tr
                borderBottomWidth={1}
                _last={{ borderBottomWidth: 0 }}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <Td
                    {...cell.getCellProps()}
                    borderBottomWidth="inherit"
                    _last={{ textAlign: "end" }}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {children}
    </Card>
  );
};
