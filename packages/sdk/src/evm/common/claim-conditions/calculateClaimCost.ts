import { NATIVE_TOKEN_ADDRESS } from "../../constants/currency";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { Address } from "../../schema/shared/Address";
import type { Price } from "../../types/currency";
import { BigNumberish, CallOverrides } from "ethers";
import { approveErc20Allowance } from "../currency/approveErc20Allowance";
import { normalizePriceValue } from "../currency/normalizePriceValue";

export async function calculateClaimCost(
  contractWrapper: ContractWrapper<any>,
  pricePerToken: Price,
  quantity: BigNumberish,
  currencyAddress?: Address,
  checkERC20Allowance?: boolean,
): Promise<Promise<CallOverrides>> {
  let overrides: CallOverrides = {};
  const currency = currencyAddress || NATIVE_TOKEN_ADDRESS;
  const normalizedPrice = await normalizePriceValue(
    contractWrapper.getProvider(),
    pricePerToken,
    currency,
  );
  const totalCost = normalizedPrice.mul(quantity);
  if (totalCost.gt(0)) {
    if (currency === NATIVE_TOKEN_ADDRESS) {
      overrides = {
        value: totalCost,
      };
    } else if (currency !== NATIVE_TOKEN_ADDRESS && checkERC20Allowance) {
      await approveErc20Allowance(
        contractWrapper,
        currency,
        totalCost,
        quantity,
        0,
      );
    }
  }
  return overrides;
}
