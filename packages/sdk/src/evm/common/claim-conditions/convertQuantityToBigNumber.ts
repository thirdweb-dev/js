import { Quantity } from "../../../core/schema/shared";
import { utils, constants } from "ethers";

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
    return constants.MaxUint256;
  } else {
    return utils.parseUnits(quantity, tokenDecimals);
  }
}
