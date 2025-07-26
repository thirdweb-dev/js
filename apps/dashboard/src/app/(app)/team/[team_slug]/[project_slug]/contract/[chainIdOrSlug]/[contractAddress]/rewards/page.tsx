import { notFound, redirect } from "next/navigation";
import { getContract } from "thirdweb";
import {
  getDeployedEntrypointERC20,
} from "thirdweb/tokens";
import { getProject } from "@/api/projects";
import { getContractPageParamsInfo } from "../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/_utils/getContractFromParams";
import type { ProjectContractPageParams } from "../types";
import { ClaimRewardsPage } from "./components/claim-rewards-page";
import { getValidReward } from "./utils/rewards";
import { getUnclaimedFees } from "./utils/unclaimed-fees";

export default async function Page(props: {
  params: Promise<ProjectContractPageParams>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    notFound();
  }

  const info = await getContractPageParamsInfo({
    chainIdOrSlug: params.chainIdOrSlug,
    contractAddress: params.contractAddress,
    teamId: project.teamId,
  });

  if (!info) {
    notFound();
  }

  const assetContractClient = info.clientContract;

  const entrypointContractClient = await getDeployedEntrypointERC20({
    chain: assetContractClient.chain,
    client: assetContractClient.client,
  });

  const reward = await getValidReward({
    assetContract: assetContractClient,
    entrypointContract: entrypointContractClient,
  });

  if (!reward) {
    redirect(
      `/team/${params.team_slug}/${params.project_slug}/contract/${params.chainIdOrSlug}/${params.contractAddress}`,
    );
  }

  const v3PositionManagerContract = getContract({
    address: reward.positionManager,
    chain: assetContractClient.chain,
    client: assetContractClient.client,
  });

  const unclaimedFees = await getUnclaimedFees({
    positionManager: v3PositionManagerContract,
    reward: {
      tokenId: reward.positionId,
      recipient: reward.recipient,
    },
  });

  return (
    <ClaimRewardsPage
      assetContractClient={assetContractClient}
      entrypointContractClient={entrypointContractClient}
      reward={reward}
      unclaimedFees={unclaimedFees}
      chainSlug={info.chainMetadata.slug}
    />
  );
}
