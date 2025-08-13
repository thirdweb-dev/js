import type { ThirdwebContract } from "thirdweb";
import { getRewards } from "thirdweb/tokens";

export async function getValidReward(params: {
  assetContract: ThirdwebContract;
  entrypointContract: ThirdwebContract;
}) {
  try {
    const rewards = await getRewards({
      contract: params.entrypointContract,
      asset: params.assetContract.address,
    });

    if (rewards.length === 0) {
      return null;
    }

    // It's potentially possible to have multiple rewards locked up, but it's not the default use case.
    return rewards[0];
  } catch {
    return null;
  }
}
