import { AmountSchema } from "../../../core/schema/shared";
import { Amount } from "../../types/currency";
import { BigNumber, BigNumberish, utils } from "ethers";

export function toUnits(amount: Amount, decimals: BigNumberish): BigNumber {
  return utils.parseUnits(AmountSchema.parse(amount), decimals);
}
