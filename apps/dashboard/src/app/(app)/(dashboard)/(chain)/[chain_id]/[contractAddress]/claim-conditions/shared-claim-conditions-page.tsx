import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { ClaimConditions } from "../_components/claim-conditions/claim-conditions";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../_utils/newPublicPage";
import { ClaimConditionsClient } from "./ClaimConditions.client";

export async function SharedClaimConditionsPage(props: {
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

  // new public page can't show /claim-conditions page
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

  const { clientContract, serverContract, isLocalhostChain } = info;

  if (isLocalhostChain) {
    return (
      <ClaimConditionsClient
        contract={clientContract}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const {
    isERC20ClaimConditionsSupported,
    isERC721ClaimConditionsSupported,
    supportedERCs,
  } = await getContractPageMetadata(serverContract);

  if (!isERC20ClaimConditionsSupported && !isERC721ClaimConditionsSupported) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <ClaimConditions
      contract={clientContract}
      isERC20={supportedERCs.isERC20}
      isLoggedIn={props.isLoggedIn}
      isMultiphase={true}
    />
  );
}
