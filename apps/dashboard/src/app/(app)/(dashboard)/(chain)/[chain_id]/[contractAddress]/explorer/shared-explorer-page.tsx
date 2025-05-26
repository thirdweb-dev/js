import { notFound } from "next/navigation";
import { resolveContractAbi } from "thirdweb/contract";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractExplorerPage } from "./ContractExplorerPage";
import { ContractExplorerPageClient } from "./ContractExplorerPage.client";

export async function SharedExplorerPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
  isLoggedIn: boolean;
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
      <ContractExplorerPageClient
        contract={clientContract}
        chainMetadata={chainMetadata}
        isLoggedIn={props.isLoggedIn}
      />
    );
  }

  const abi = await resolveContractAbi(serverContract).catch(() => undefined);

  return (
    <ContractExplorerPage
      contract={clientContract}
      abi={abi}
      chainMetadata={chainMetadata}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
