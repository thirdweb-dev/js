import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { fetchPublishedContractsFromDeploy } from "@/api/contract/fetchPublishedContractsFromDeploy";
import {
  type DashboardContractMetadata,
  fetchDashboardContractMetadata,
} from "@/hooks/useDashboardContractMetadata";
import { MetadataHeader } from "./metadata-header";

interface ContractMetadataProps {
  contract: ThirdwebContract;
  chain: ChainMetadata;
  contractMetadata: DashboardContractMetadata | undefined;
  externalLinks:
    | {
        name: string;
        url: string;
      }[]
    | undefined;
}

export function ContractMetadata({
  contract,
  chain,
  contractMetadata,
  externalLinks,
}: ContractMetadataProps) {
  return (
    <MetadataHeader
      address={contract.address}
      chain={chain}
      client={contract.client}
      data={contractMetadata}
      externalLinks={externalLinks}
    />
  );
}

export async function getContractMetadataHeaderData(
  contract: ThirdwebContract,
) {
  const settledResults = await Promise.allSettled([
    fetchDashboardContractMetadata(contract),
    fetchPublishedContractsFromDeploy({
      contract,
    }),
  ]);

  const contractMetadata =
    settledResults[0].status === "fulfilled"
      ? settledResults[0].value
      : undefined;

  const publishedContractsFromDeploy =
    settledResults[1].status === "fulfilled"
      ? settledResults[1].value
      : undefined;

  const latestPublished = publishedContractsFromDeploy?.slice(-1)[0];

  return {
    contractMetadata,
    externalLinks: latestPublished?.externalLinks,
  };
}
