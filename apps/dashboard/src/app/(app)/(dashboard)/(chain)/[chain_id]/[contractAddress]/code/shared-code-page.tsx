import { notFound } from "next/navigation";
import { resolveContractAbi } from "thirdweb/contract";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractCodePage } from "./contract-code-page";
import { ContractCodePageClient } from "./contract-code-page.client";

export async function SharedCodePage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const info = await getContractPageParamsInfo({
    contractAddress: props.contractAddress,
    chainIdOrSlug: props.chainIdOrSlug,
    teamId: props.projectMeta?.teamId,
  });

  if (!info) {
    notFound();
  }

  const { clientContract, serverContract, chainMetadata, isLocalhostChain } =
    info;

  if (isLocalhostChain) {
    return (
      <ContractCodePageClient
        contract={clientContract}
        chainMetadata={chainMetadata}
      />
    );
  }

  const abi = await resolveContractAbi(serverContract).catch(() => undefined);

  return (
    <ContractCodePage
      abi={abi}
      contract={clientContract}
      chainMetadata={chainMetadata}
    />
  );
}
