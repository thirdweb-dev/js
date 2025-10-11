import { notFound, redirect } from "next/navigation";
import { getContract } from "thirdweb";
import { getDeployedEntrypointERC20 } from "thirdweb/tokens";
import { getProject } from "@/api/project/projects";
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

  const chain = info.clientContract.chain;
  const assetContractServer = info.serverContract;
  const serverClient = assetContractServer.client;
  const chainMetadata = info.chainMetadata;

  const { address: entrypointContractAddress } =
    await getDeployedEntrypointERC20({
      chain,
      client: serverClient,
    });

  // Note: must use server contract/client here
  const reward = await getValidReward({
    assetContract: assetContractServer,
    entrypointContract: getContract({
      address: entrypointContractAddress,
      chain,
      client: serverClient,
    }),
  });

  if (!reward) {
    redirect(
      `/team/${params.team_slug}/${params.project_slug}/contract/${params.chainIdOrSlug}/${params.contractAddress}`,
    );
  }

  // Note: must use server contract/client here
  const unclaimedFees = await getUnclaimedFees({
    chainMetadata,
    positionManager: getContract({
      address: reward.positionManager,
      chain,
      client: serverClient,
    }),
    reward: {
      tokenId: reward.positionId,
      recipient: reward.recipient,
    },
  });

  return (
    <ClaimRewardsPage
      assetContractClient={info.clientContract}
      entrypointContractClient={getContract({
        address: entrypointContractAddress,
        chain: chain,
        client: info.clientContract.client,
      })}
      reward={reward}
      unclaimedFees={unclaimedFees}
      chainSlug={info.chainMetadata.slug}
    />
  );
}
