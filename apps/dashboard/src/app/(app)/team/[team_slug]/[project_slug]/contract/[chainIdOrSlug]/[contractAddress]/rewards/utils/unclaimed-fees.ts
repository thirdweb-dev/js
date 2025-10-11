import type { ThirdwebContract } from "thirdweb";
import { getAddress, getContract, readContract, ZERO_ADDRESS } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { symbol } from "thirdweb/extensions/common";
import { decimals } from "thirdweb/extensions/erc20";

const maxUint128 = 2n ** 128n - 1n;

export async function getUnclaimedFees(params: {
  positionManager: ThirdwebContract;
  chainMetadata: ChainMetadata;
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

  const token0Contract = getContract({
    address: token0Address,
    chain,
    client,
  });

  const token1Contract = getContract({
    address: token1Address,
    chain,
    client,
  });

  const isToken0Native = getAddress(token0Address) === getAddress(ZERO_ADDRESS);
  const isToken1Native = getAddress(token1Address) === getAddress(ZERO_ADDRESS);

  const nativeSymbol = params.chainMetadata.nativeCurrency.symbol;
  const nativeDecimals = params.chainMetadata.nativeCurrency.decimals;

  const [token0Symbol, token1Symbol, token0Decimals, token1Decimals] =
    await Promise.all([
      isToken0Native
        ? nativeSymbol
        : symbol({
            contract: token0Contract,
          }),
      isToken1Native
        ? nativeSymbol
        : symbol({
            contract: token1Contract,
          }),
      isToken0Native
        ? nativeDecimals
        : decimals({
            contract: token0Contract,
          }),
      isToken1Native
        ? nativeDecimals
        : decimals({
            contract: token1Contract,
          }),
    ]);

  return {
    token0: {
      address: token0Address,
      amount: collectResult[0],
      symbol: token0Symbol,
      decimals: token0Decimals,
    },
    token1: {
      address: token1Address,
      amount: collectResult[1],
      symbol: token1Symbol,
      decimals: token1Decimals,
    },
  };
}
