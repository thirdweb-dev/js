"use client";

import { Badge } from "@/components/ui/badge";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import type { BasicContract } from "contract-ui/types/types";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useV5DashboardChain } from "lib/v5-adapter";
import Link from "next/link";
import { memo } from "react";
import { getContract } from "thirdweb";
import { shortenIfAddress } from "utils/usedapp-external";
import { THIRDWEB_DEPLOYER_ADDRESS } from "../../../constants/addresses";
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
    const client = useThirdwebClient();

    const contract = getContract({
      client,
      address: cell.address,
      chain,
    });

    const contractMetadata = useDashboardContractMetadata(contract);

    return (
      <SkeletonContainer
        loadedData={
          contractMetadata.isFetching ? undefined : contractMetadata.data?.name
        }
        skeletonData="Custom Contract"
        render={(v) => {
          return (
            <Link
              href={`/${chainSlug}/${cell.address}`}
              passHref
              className="text-foreground"
            >
              {v || shortenIfAddress(cell.address)}
            </Link>
          );
        }}
      />
    );
  },
);

AsyncContractNameCell.displayName = "AsyncContractNameCell";

interface AsyncContractTypeCellProps {
  cell: BasicContract;
}

export const AsyncContractTypeCell = memo(
  ({ cell }: AsyncContractTypeCellProps) => {
    const client = useThirdwebClient();
    const chain = useV5DashboardChain(cell.chainId);
    const contract = getContract({
      client,
      address: cell.address,
      chain,
    });

    const publishedContractsFromDeployQuery =
      usePublishedContractsFromDeploy(contract);

    const publishedContractsFromDeployOriginal =
      publishedContractsFromDeployQuery.data || [];

    const publishedContractsFromDeploySorted = [
      ...publishedContractsFromDeployOriginal,
    ]
      // latest first
      .reverse()
      // prioritize showing the publisher === thirdweb
      .sort((a, b) => {
        const aIsTWPublisher = a.publisher === THIRDWEB_DEPLOYER_ADDRESS;
        const bIsTWPublisher = b.publisher === THIRDWEB_DEPLOYER_ADDRESS;
        if (aIsTWPublisher && !bIsTWPublisher) {
          return -1;
        }
        if (!aIsTWPublisher && bIsTWPublisher) {
          return 1;
        }
        return 0;
      });

    const contractMetadata = useDashboardContractMetadata(contract);

    const contractType =
      publishedContractsFromDeploySorted[0]?.displayName ||
      publishedContractsFromDeploySorted[0]?.name;

    return (
      <SkeletonContainer
        loadedData={contractType || contractMetadata.data?.contractType}
        skeletonData="Custom Contract"
        render={(v) => {
          if (v === contractType) {
            return (
              <Badge
                className="line-clamp-1 inline-block max-w-[200px] truncate py-1"
                variant="outline"
              >
                {v}
              </Badge>
            );
          }

          return (
            <Badge variant="outline" className="inline-block py-1">
              {v || "Custom"}
            </Badge>
          );
        }}
      />
    );
  },
);

AsyncContractTypeCell.displayName = "AsyncContractTypeCell";
