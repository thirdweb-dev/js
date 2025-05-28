import { notFound } from "next/navigation";
import {
  isClaimToSupported,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../_utils/newPublicPage";
import { ContractTokensPage } from "./ContractTokensPage";
import { ContractTokensPageClient } from "./ContractTokensPage.client";

export async function SharedContractTokensPage(props: {
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

  // new public page can't show /tokens page
  if (!props.projectMeta) {
    const shouldHide = await shouldRenderNewPublicPage(info.serverContract);
    if (shouldHide) {
      redirectToContractLandingPage({
        contractAddress: props.contractAddress,
        chainIdOrSlug: props.chainIdOrSlug,
        projectMeta: props.projectMeta,
      });
    }
  }

  if (info.isLocalhostChain) {
    return (
      <ContractTokensPageClient
        contract={info.clientContract}
        isLoggedIn={props.isLoggedIn}
      />
    );
  }

  const { supportedERCs, functionSelectors } = await getContractPageMetadata(
    info.serverContract,
  );

  return (
    <ContractTokensPage
      contract={info.clientContract}
      isERC20={supportedERCs.isERC20}
      isMintToSupported={isMintToSupported(functionSelectors)}
      isClaimToSupported={isClaimToSupported(functionSelectors)}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
