import { DEFAULT_FEE_RECIPIENT } from "constants/addresses";
import { notFound } from "next/navigation";
import type { ThirdwebContract } from "thirdweb";
import { getPlatformFeeInfo } from "thirdweb/extensions/common";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../_utils/newPublicPage";
import { ContractSettingsPage } from "./ContractSettingsPage";
import { ContractSettingsPageClient } from "./ContractSettingsPage.client";

export async function SharedContractSettingsPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
  isLoggedIn: boolean;
}) {
  const info = await getContractPageParamsInfo({
    chainIdOrSlug: props.chainIdOrSlug,
    contractAddress: props.contractAddress,
    teamId: props.projectMeta?.teamId,
  });

  if (!info) {
    notFound();
  }

  // new public page can't show /settings page
  if (!props.projectMeta) {
    const shouldHide = await shouldRenderNewPublicPage(info.serverContract);
    if (shouldHide) {
      redirectToContractLandingPage({
        chainIdOrSlug: props.chainIdOrSlug,
        contractAddress: props.contractAddress,
        projectMeta: props.projectMeta,
      });
    }
  }

  const { clientContract, serverContract, isLocalhostChain } = info;

  if (isLocalhostChain) {
    return (
      <ContractSettingsPageClient
        contract={clientContract}
        isLoggedIn={props.isLoggedIn}
      />
    );
  }

  const [metadata, hasDefaultFeeConfig] = await Promise.all([
    getContractPageMetadata(serverContract),
    checkDefaultFeeConfig(serverContract),
  ]);

  return (
    <ContractSettingsPage
      contract={clientContract}
      functionSelectors={metadata.functionSelectors}
      hasDefaultFeeConfig={hasDefaultFeeConfig}
      isLoggedIn={props.isLoggedIn}
    />
  );
}

async function checkDefaultFeeConfig(contract: ThirdwebContract) {
  let hasDefaultFeeConfig = true;
  try {
    const feeInfo = await getPlatformFeeInfo({ contract });
    hasDefaultFeeConfig =
      feeInfo[0].toLowerCase() === DEFAULT_FEE_RECIPIENT.toLowerCase();
  } catch {}

  return hasDefaultFeeConfig;
}
