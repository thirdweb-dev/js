import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { getReward } from "thirdweb/assets";

export async function getValidReward(params: {
  assetContract: ThirdwebContract;
  entrypointContract: ThirdwebContract;
}) {
  try {
    const reward = await getReward({
      contract: params.entrypointContract,
      asset: params.assetContract.address,
    });

    if (
      reward.positionManager === ZERO_ADDRESS ||
      reward.recipient === ZERO_ADDRESS ||
      reward.referrer === ZERO_ADDRESS ||
      reward.referrerBps === 0 ||
      reward.tokenId === BigInt(0)
    ) {
      return null;
    }

    return reward;
  } catch {
    return null;
  }
}
