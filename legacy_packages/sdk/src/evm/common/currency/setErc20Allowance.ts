import type { IERC20 } from "@thirdweb-dev/contracts-js";
import { BigNumber } from "ethers";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { isNativeToken } from "./isNativeToken";

/**
 * @internal
 */
export async function setErc20Allowance(
  contractToApprove: ContractWrapper<any>,
  value: BigNumber,
  currencyAddress: string,
  overrides: any,
): Promise<any> {
  if (isNativeToken(currencyAddress)) {
    overrides["value"] = value;
  } else {
    const ERC20Abi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC20.json")
    ).default;
    const signer = contractToApprove.getSigner();
    const provider = contractToApprove.getProvider();
    const erc20 = new ContractWrapper<IERC20>(
      signer || provider,
      currencyAddress,
      ERC20Abi,
      contractToApprove.options,
      contractToApprove.storage,
    );

    const owner = await contractToApprove.getSignerAddress();
    const spender = contractToApprove.address;
    const allowance = await erc20.read("allowance", [owner, spender]);
    if (allowance.lt(value)) {
      // approve overrides the previous allowance, set it to the minimum required for this tx
      await erc20.sendTransaction("approve", [spender, value]);
    }
    return overrides;
  }
}
