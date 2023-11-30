import { Quantity } from "../../../core/schema/shared";
import { utils, constants } from "ethers";

/**
 * @internal
 * @param quantity - The quantity to convert
 * @param tokenDecimals - The token decimals to use
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
