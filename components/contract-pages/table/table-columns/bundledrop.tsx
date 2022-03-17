import { AdminMintConditionCell } from "./actions/AdminMintConditionCell";
import { Code, Image, Text } from "@chakra-ui/react";
import { EditionMetadata } from "@thirdweb-dev/sdk";
import { RenderMedia } from "components/shared/RenderMedia";
import { BigNumber } from "ethers";
import React from "react";
import { Cell, Column } from "react-table";

export function generateBundleDropTableColumns() {
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
      Header: "Media File",
      accessor: (row) => ({
        animationUrl: (row.metadata as any).animation_url,
        externalUrl: (row.metadata as any).external_url,
      }),
      Cell: ({ cell }: { cell: any }) => <RenderMedia {...cell.value} />,
    },
    {
      Header: "Claimed Supply",
      accessor: (row) => row.supply,
      Cell: ({ cell }: { cell: Cell<EditionMetadata, BigNumber> }) => (
        <Text size="label.sm">
          {BigNumber.from(cell.value || 0).toString()}
        </Text>
      ),
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: AdminMintConditionCell || null,
    },
  ] as Column<EditionMetadata>[];
}
