import { AmountSchema } from "../../../core/schema/shared";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { Amount } from "../../types/currency";
import { BaseERC20 } from "../../types/eips";
import { BigNumber, utils } from "ethers";

export async function normalizeAmount(
  contractWrapper: ContractWrapper<BaseERC20>,
  amount: Amount,
): Promise<BigNumber> {
  const decimals = await contractWrapper.readContract.decimals();
  return utils.parseUnits(AmountSchema.parse(amount), decimals);
}
