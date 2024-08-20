import { thirdwebClient } from "@/constants/client";
import { useDashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import { Skeleton } from "@chakra-ui/react";
import type { BasicContract } from "contract-ui/types/types";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useV5DashboardChain } from "lib/v5-adapter";
import { memo } from "react";
import { getContract } from "thirdweb";
import { ChakraNextLink, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { usePublishedContractsFromDeploy } from "../hooks";

interface AsyncContractNameCellProps {
  cell: BasicContract;
}

// The row components for the contract table, in the <Your contracts> page
// url: /dashboard/contracts/deploy

export const AsyncContractNameCell = memo(
  ({ cell }: AsyncContractNameCellProps) => {
    const chainSlug = useChainSlug(cell.chainId);
    const chain = useV5DashboardChain(cell.chainId);

    const contract = getContract({
      client: thirdwebClient,
      address: cell.address,
      chain,
    });

    const contractMetadata = useDashboardContractMetadata(contract);

    return (
      <Skeleton isLoaded={!contractMetadata.isFetching}>
        <ChakraNextLink href={`/${chainSlug}/${cell.address}`} passHref>
          <Text
            color="blue.500"
            _dark={{ color: "blue.400" }}
            size="label.md"
            _groupHover={{ textDecor: "underline" }}
          >
            {contractMetadata.data?.name || shortenIfAddress(cell.address)}
          </Text>
        </ChakraNextLink>
      </Skeleton>
    );
  },
);

AsyncContractNameCell.displayName = "AsyncContractNameCell";

interface AsyncContractTypeCellProps {
  cell: BasicContract;
}

export const AsyncContractTypeCell = memo(
  ({ cell }: AsyncContractTypeCellProps) => {
    const publishedContractsFromDeployQuery = usePublishedContractsFromDeploy(
      cell.address,
      cell.chainId,
    );

    const chain = useV5DashboardChain(cell.chainId);

    const contract = getContract({
      client: thirdwebClient,
      address: cell.address,
      chain,
    });

    const contractMetadata = useDashboardContractMetadata(contract);

    const contractType =
      publishedContractsFromDeployQuery.data?.[0]?.displayName ||
      publishedContractsFromDeployQuery.data?.[0]?.name;
    return (
      <Skeleton
        isLoaded={
          !publishedContractsFromDeployQuery.isInitialLoading ||
          publishedContractsFromDeployQuery.isLoadingError
        }
      >
        {contractType ? (
          <Text noOfLines={1} maxWidth={200} isTruncated>
            {contractType}
          </Text>
        ) : (
          <Text fontStyle="italic" opacity={0.5}>
            {contractMetadata.data?.contractType || "Custom"}
          </Text>
        )}
      </Skeleton>
    );
  },
);

AsyncContractTypeCell.displayName = "AsyncContractTypeCell";
