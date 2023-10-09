import {
  PrebuiltContractType,
  SchemaForPrebuiltContractType,
} from "@thirdweb-dev/sdk";

import { Skeleton } from "@chakra-ui/react";

import React, { memo } from "react";

import { ChakraNextLink, Text } from "tw-components";

import { useContractMetadataWithAddress } from "@3rdweb-sdk/react";

import { useChainSlug } from "hooks/chains/chainSlug";

import { z } from "zod";
import { shortenIfAddress } from "utils/usedapp-external";

interface AsyncContractNameCellProps {
  cell: {
    address: string;
    chainId: number;
    metadata: () => Promise<
      z.infer<SchemaForPrebuiltContractType<PrebuiltContractType>["output"]>
    >;
  };
}

export const AsyncContractNameCell = memo(
  ({ cell }: AsyncContractNameCellProps) => {
    const chainSlug = useChainSlug(cell.chainId);
    const metadataQuery = useContractMetadataWithAddress(
      cell.address,
      cell.metadata,
      cell.chainId,
    );

    return (
      <Skeleton isLoaded={!metadataQuery.isLoading}>
        <ChakraNextLink href={`/${chainSlug}/${cell.address}`} passHref>
          <Text
            color="blue.500"
            _dark={{ color: "blue.400" }}
            size="label.md"
            _groupHover={{ textDecor: "underline" }}
          >
            {metadataQuery.data?.name || shortenIfAddress(cell.address)}
          </Text>
        </ChakraNextLink>
      </Skeleton>
    );
  },
);

AsyncContractNameCell.displayName = "AsyncContractNameCell";
