import { BigNumberish, ethers } from "ethers";

/**
 * @internal
 * @param bn
 * @param tokenDecimals
 */
export function convertToReadableQuantity(
  bn: BigNumberish,
  tokenDecimals: number,
) {
  if (bn.toString() === ethers.constants.MaxUint256.toString()) {
    return "unlimited";
  } else {
    return ethers.utils.formatUnits(bn, tokenDecimals);
  }
}
