import { type BigNumberish, constants, utils } from "ethers";

/**
 * @internal
 * @param bn
 * @param tokenDecimals
 */
export function convertToReadableQuantity(
  bn: BigNumberish,
  tokenDecimals: number,
) {
  if (bn.toString() === constants.MaxUint256.toString()) {
    return "unlimited";
  } else {
    return utils.formatUnits(bn, tokenDecimals);
  }
}
