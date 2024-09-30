import { getThirdwebClient } from "@/constants/thirdweb.server";
import { fetchDashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import { fetchPublishedContractsFromDeploy } from "components/contract-components/fetchPublishedContractsFromDeploy";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { MetadataHeader } from "./metadata-header";

interface ContractMetadataProps {
  contract: ThirdwebContract;
  chain: ChainMetadata;
}

export async function ContractMetadata({
  contract,
  chain,
}: ContractMetadataProps) {
  const settledResults = await Promise.allSettled([
    fetchDashboardContractMetadata(contract),
    fetchPublishedContractsFromDeploy({
      contract,
      client: getThirdwebClient(),
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

  return (
    <MetadataHeader
      data={contractMetadata}
      chain={chain}
      address={contract.address}
      externalLinks={latestPublished?.externalLinks}
    />
  );
}
