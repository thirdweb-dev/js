import { AmountSchema } from "../../../core/schema/shared";
import { Amount } from "../../types/currency";
import { BigNumber, utils } from "ethers";

export function toWei(amount: Amount): BigNumber {
  return utils.parseEther(AmountSchema.parse(amount));
}
