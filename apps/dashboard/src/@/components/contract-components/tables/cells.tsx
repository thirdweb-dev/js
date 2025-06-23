"use client";

import Link from "next/link";
import { memo } from "react";
import { getContract, type ThirdwebClient } from "thirdweb";
import { Badge } from "@/components/ui/badge";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { THIRDWEB_DEPLOYER_ADDRESS } from "@/constants/addresses";
import { useChainSlug } from "@/hooks/chains/chainSlug";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { usePublishedContractsFromDeploy } from "@/hooks/contract-hooks";
import { useDashboardContractMetadata } from "@/hooks/useDashboardContractMetadata";
import { cn } from "@/lib/utils";
import { shortenIfAddress } from "@/utils/usedapp-external";

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
    address: props.contractAddress,
    chain,
    client: props.client,
  });

  const contractMetadata = useDashboardContractMetadata(contract);

  return (
    <SkeletonContainer
      loadedData={
        contractMetadata.isFetching ? undefined : contractMetadata.data?.name
      }
      render={(v) => {
        return (
          <Link
            className={cn(
              "text-foreground",
              props.linkOverlay && "before:absolute before:inset-0",
            )}
            href={`/team/${props.teamSlug}/${props.projectSlug}/contract/${chainSlug}/${props.contractAddress}`}
            passHref
          >
            {v || shortenIfAddress(props.contractAddress)}
          </Link>
        );
      }}
      skeletonData="Custom Contract"
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
    address: props.contractAddress,
    chain,
    client: props.client,
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
      render={(v) => {
        return <ContractTypeCellUI name={v} />;
      }}
      skeletonData="Custom Contract"
    />
  );
});

export function ContractTypeCellUI(props: { name: string | undefined }) {
  return (
    <Badge
      className="line-clamp-1 inline-block max-w-[200px] truncate py-1"
      variant="outline"
    >
      {props.name || "Custom"}
    </Badge>
  );
}
