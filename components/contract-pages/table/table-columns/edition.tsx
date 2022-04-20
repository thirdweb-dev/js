import { EditionActionsCell } from "./actions/ActionsCell";
import { MediaCell } from "./cells/media-cell";
import { Code, Text } from "@chakra-ui/react";
import { EditionMetadata } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import React from "react";
import { Cell, Column } from "react-table";

export function generateEditionTableColumns() {
  return [
    {
      Header: "ID",
      accessor: (row) => row.metadata.id.toString(),
    },
    {
      Header: "Media",
      accessor: (row) => row.metadata,
      Cell: MediaCell,
    },
    { Header: "Name", accessor: (row) => row.metadata.name },
    {
      Header: "Description",
      accessor: (row) => row.metadata.description,
    },
    {
      Header: "Properties",
      accessor: (row) => row.metadata.attributes || row.metadata.properties,
      Cell: ({ cell }: { cell: any }) => (
        <Code whiteSpace="pre">{JSON.stringify(cell.value, null, 2)}</Code>
      ),
    },
    {
      Header: "Supply",
      accessor: (row) => row.supply.toString(),
      Cell: ({ cell }: { cell: Cell<EditionMetadata, BigNumber> }) => {
        return (
          <Text size="label.sm">{BigNumber.from(cell.value).toString()}</Text>
        );
      },
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: EditionActionsCell || null,
    },
  ] as Column<EditionMetadata>[];
}
