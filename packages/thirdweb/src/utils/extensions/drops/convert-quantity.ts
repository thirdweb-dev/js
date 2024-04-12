import { maxUint256 } from "viem";
import { toUnits } from "../../units.js";

export function convertQuantity(options: {
  quantity: string;
  tokenDecimals: number;
}) {
  const { quantity, tokenDecimals } = options;
  if (quantity === "unlimited") {
    return maxUint256;
  }
  return toUnits(quantity, tokenDecimals);
}
