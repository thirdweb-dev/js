import type { ThirdwebContract } from "thirdweb";
import { readContract } from "thirdweb";

export const maxUint128 = 2n ** 128n - 1n;

export async function getUnclaimedFees(params: {
  positionManager: ThirdwebContract;
  reward: {
    tokenId: bigint;
    recipient: string;
  };
}) {
  const collectResultPromise = readContract({
    contract: params.positionManager,
    method:
      "function collect((uint256 tokenId,address recipient,uint128 amount0Max,uint128 amount1Max)) returns (uint256,uint256)",
    params: [
      {
        tokenId: params.reward.tokenId,
        recipient: params.reward.recipient,
        amount0Max: maxUint128,
        amount1Max: maxUint128,
      },
    ],
  });

  const positionsResultPromise = readContract({
    contract: params.positionManager,
    method:
      "function positions(uint256 tokenId) view returns (uint96,address,address,address,uint24,int24,int24,uint128,uint256,uint256,uint128,uint128)",
    params: [params.reward.tokenId],
  });

  const [collectResult, positionsResult] = await Promise.all([
    collectResultPromise,
    positionsResultPromise,
  ]);

  // positionsResult
  // 0- nonce
  // 1- owner
  // 2- token0
  // 3- token1
  // 4 - fee
  // 5 - tickLower
  // 6 - tickUpper
  // 7 - liquidity
  // 8 - feeGrowthInside0LastX128
  // 9 - feeGrowthInside1LastX128
  // 10 - tokensOwed0
  // 11 - tokensOwed1

  return {
    token0: {
      address: positionsResult[2], // token0
      amount: collectResult[0],
    },
    token1: {
      address: positionsResult[3], // token1
      amount: collectResult[1],
    },
  };
}
