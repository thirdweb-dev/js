import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractNFTPage } from "./ContractNFTPage";
import { ContractNFTPageClient } from "./ContractNFTPage.client";

export async function SharedNFTPage(props: {
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
      <ContractNFTPageClient
        contract={clientContract}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const { supportedERCs, functionSelectors } =
    await getContractPageMetadata(serverContract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <ContractNFTPage
      contract={clientContract}
      isErc721={supportedERCs.isERC721}
      functionSelectors={functionSelectors}
      isLoggedIn={props.isLoggedIn}
      projectMeta={props.projectMeta}
    />
  );
}
