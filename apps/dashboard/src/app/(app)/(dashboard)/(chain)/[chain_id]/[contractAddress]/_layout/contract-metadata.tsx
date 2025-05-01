import {
  type DashboardContractMetadata,
  fetchDashboardContractMetadata,
} from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import { fetchPublishedContractsFromDeploy } from "components/contract-components/fetchPublishedContractsFromDeploy";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
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
      data={contractMetadata}
      chain={chain}
      address={contract.address}
      externalLinks={externalLinks}
      client={contract.client}
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
      client: contract.client,
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
