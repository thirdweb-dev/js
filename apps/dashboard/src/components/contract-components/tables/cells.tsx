"use client";

import { Badge } from "@/components/ui/badge";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useV5DashboardChain } from "lib/v5-adapter";
import Link from "next/link";
import { memo } from "react";
import { type ThirdwebClient, getContract } from "thirdweb";
import { shortenIfAddress } from "utils/usedapp-external";
import { THIRDWEB_DEPLOYER_ADDRESS } from "../../../constants/addresses";
import { usePublishedContractsFromDeploy } from "../hooks";

export const ContractNameCell = memo(function ContractNameCell(props: {
  chainId: string;
  contractAddress: string;
  linkOverlay?: boolean;
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
}) {
  const chainSlug = useChainSlug(Number(props.chainId));
  const chain = useV5DashboardChain(Number(props.chainId));

  const contract = getContract({
    client: props.client,
    address: props.contractAddress,
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
            href={`/team/${props.teamSlug}/${props.projectSlug}/contract/${chainSlug}/${props.contractAddress}`}
            passHref
            className={cn(
              "text-foreground",
              props.linkOverlay && "before:absolute before:inset-0",
            )}
          >
            {v || shortenIfAddress(props.contractAddress)}
          </Link>
        );
      }}
    />
  );
});

export const ContractTypeCell = memo(function ContractTypeCell(props: {
  chainId: string;
  contractAddress: string;
  client: ThirdwebClient;
}) {
  const chain = useV5DashboardChain(Number(props.chainId));
  const contract = getContract({
    client: props.client,
    address: props.contractAddress,
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
});
