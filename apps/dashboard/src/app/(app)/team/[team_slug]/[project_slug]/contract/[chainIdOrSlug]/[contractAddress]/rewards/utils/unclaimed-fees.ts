import type { ThirdwebContract } from "thirdweb";
import { getContract, readContract } from "thirdweb";
import { symbol } from "thirdweb/extensions/common";

const maxUint128 = 2n ** 128n - 1n;

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

  const client = params.positionManager.client;
  const chain = params.positionManager.chain;

  const token0Address = positionsResult[2];
  const token1Address = positionsResult[3];

  const [token0Symbol, token1Symbol] = await Promise.all([
    symbol({
      contract: getContract({
        address: token0Address,
        chain,
        client,
      }),
    }),
    symbol({
      contract: getContract({
        address: token1Address,
        chain,
        client,
      }),
    }),
  ]);

  return {
    token0: {
      address: token0Address,
      amount: collectResult[0],
      symbol: token0Symbol,
    },
    token1: {
      address: token1Address,
      amount: collectResult[1],
      symbol: token1Symbol,
    },
  };
}
