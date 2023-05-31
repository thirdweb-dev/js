import { ContractWrapper } from "../../core/classes/contract-wrapper";
import type { IERC20 } from "@thirdweb-dev/contracts-js";
// @ts-expect-error
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20";
import { BigNumber } from "ethers";
import { isNativeToken } from "./isNativeToken";

export async function setErc20Allowance(
  contractToApprove: ContractWrapper<any>,
  value: BigNumber,
  currencyAddress: string,
  overrides: any,
): Promise<any> {
  if (isNativeToken(currencyAddress)) {
    overrides["value"] = value;
  } else {
    const signer = contractToApprove.getSigner();
    const provider = contractToApprove.getProvider();
    const erc20 = new ContractWrapper<IERC20>(
      signer || provider,
      currencyAddress,
      ERC20Abi,
      contractToApprove.options,
    );

    const owner = await contractToApprove.getSignerAddress();
    const spender = contractToApprove.readContract.address;
    const allowance = await erc20.readContract.allowance(owner, spender);
    if (allowance.lt(value)) {
      // approve overrides the previous allowance, set it to the minimum required for this tx
      await erc20.sendTransaction("approve", [spender, value]);
    }
    return overrides;
  }
}
