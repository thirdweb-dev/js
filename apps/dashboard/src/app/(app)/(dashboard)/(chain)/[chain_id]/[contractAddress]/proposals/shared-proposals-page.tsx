import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractProposalsPage } from "./ContractProposalsPage";
import { ContractProposalsPageClient } from "./ContractProposalsPage.client";

export async function SharedContractProposalsPage(props: {
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

  const { clientContract, serverContract, isLocalhostChain } = info;
  if (isLocalhostChain) {
    return (
      <ContractProposalsPageClient
        contract={clientContract}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const { isVoteContract } = await getContractPageMetadata(serverContract);

  if (!isVoteContract) {
    redirectToContractLandingPage({
      projectMeta: props.projectMeta,
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
    });
  }

  return (
    <ContractProposalsPage
      contract={clientContract}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
