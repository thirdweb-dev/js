import { ActionsCell } from "./actions/ActionsCell";
import { Code, Image, Text } from "@chakra-ui/react";
import { EditionMetadata } from "@thirdweb-dev/sdk";
import { RenderMedia } from "components/shared/RenderMedia";
import { BigNumber } from "ethers";
import React from "react";
import { Cell, Column } from "react-table";

export function generateCollectionableColumns() {
  return [
    {
      Header: "ID",
      accessor: (row) => row.metadata.id.toString(),
    },
    {
      Header: "Image",
      accessor: (row) => row.metadata.image,
      Cell: ({ cell: { value } }: { cell: { value?: string } }) =>
        value ? (
          <Image
            flexShrink={0}
            boxSize={24}
            objectFit="contain"
            src={value}
            alt=""
          />
        ) : null,
    },
    { Header: "Name", accessor: (row) => row.metadata.name },
    {
      Header: "Description",
      accessor: (row) => row.metadata.description,
    },
    {
      Header: "Properties",
      accessor: (row) => row.metadata.properties,
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
      Header: "Media File",
      accessor: (row) => ({
        animationUrl: (row.metadata as any).animation_url,
        externalUrl: (row.metadata as any).external_url,
      }),
      Cell: ({ cell }: { cell: any }) => <RenderMedia {...cell.value} />,
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: ActionsCell || null,
    },
  ] as Column<EditionMetadata>[];
}
