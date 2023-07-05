import { BigNumberish, utils } from "ethers";

export function toEther(amount: BigNumberish): string {
  return utils.formatEther(amount);
}
