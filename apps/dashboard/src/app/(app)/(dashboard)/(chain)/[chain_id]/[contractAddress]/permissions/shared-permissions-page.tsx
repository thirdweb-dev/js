import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../_utils/newPublicPage";
import { ContractPermissionsPage } from "./ContractPermissionsPage";
import { ContractPermissionsPageClient } from "./ContractPermissionsPage.client";

export async function SharedPermissionsPage(props: {
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

  // new public page can't show /permissions page
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
      <ContractPermissionsPageClient
        contract={clientContract}
        chainMetadata={info.chainMetadata}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const { isPermissionsEnumerableSupported } =
    await getContractPageMetadata(serverContract);

  return (
    <ContractPermissionsPage
      projectMeta={props.projectMeta}
      contract={clientContract}
      chainSlug={info.chainMetadata.slug}
      detectedPermissionEnumerable={isPermissionsEnumerableSupported}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
