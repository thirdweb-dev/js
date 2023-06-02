import { Quantity } from "../../../core/schema/shared";
import { ethers } from "ethers";

/**
 * @internal
 * @param quantity
 * @param tokenDecimals
 */
export function convertQuantityToBigNumber(
  quantity: Quantity,
  tokenDecimals: number,
) {
  if (quantity === "unlimited") {
    return ethers.constants.MaxUint256;
  } else {
    return ethers.utils.parseUnits(quantity, tokenDecimals);
  }
}
