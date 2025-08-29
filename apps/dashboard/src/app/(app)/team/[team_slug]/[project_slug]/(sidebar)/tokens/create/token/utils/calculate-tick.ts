import type { Chain, ThirdwebClient } from "thirdweb";
import { getContract, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import { getAddress } from "thirdweb/utils";

const MIN_TICK = -887200;
const MAX_TICK = 887200;
const TICK_SPACING = 200;

export async function getInitialTickValue(params: {
  startingPricePerToken: number;
  tokenAddress: string;
  chain: Chain;
  client: ThirdwebClient;
}) {
  const isNativeToken =
    getAddress(params.tokenAddress) === getAddress(NATIVE_TOKEN_ADDRESS);

  const pairTokenDecimals = isNativeToken
    ? 18
    : await decimals({
        contract: getContract({
          address: params.tokenAddress,
          chain: params.chain,
          client: params.client,
        }),
      });

  const decimalAdjustedPrice =
    params.startingPricePerToken * 10 ** (pairTokenDecimals - 18);

  const calculatedTick = Math.log(decimalAdjustedPrice) / Math.log(1.0001);

  // Round to nearest tick spacing
  const tick = Math.round(calculatedTick / TICK_SPACING) * TICK_SPACING;

  return tick;
}

export function isValidTickValue(tick: number) {
  return tick >= MIN_TICK && tick <= MAX_TICK;
}
