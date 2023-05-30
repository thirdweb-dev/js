import { BigNumberish, utils } from "ethers";

export function toDisplayValue(
  amount: BigNumberish,
  decimals: BigNumberish,
): string {
  return utils.formatUnits(amount, decimals);
}
