import { BigNumber, utils } from "ethers";
import { AmountSchema } from "../../../core/schema/shared";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { Amount } from "../../types/currency";
import { BaseERC20 } from "../../types/eips";

export async function normalizeAmount(
  contractWrapper: ContractWrapper<BaseERC20>,
  amount: Amount,
): Promise<BigNumber> {
  const decimals = await contractWrapper.read("decimals", []);
  return utils.parseUnits(AmountSchema.parse(amount), decimals);
}
