import type { IERC20 } from "@thirdweb-dev/contracts-js";
import { BigNumber, utils, type BigNumberish } from "ethers";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";

/**
 * @internal
 */
export async function approveErc20Allowance(
  contractToApprove: ContractWrapper<any>,
  currencyAddress: string,
  price: BigNumber,
  quantity: BigNumberish,
  tokenDecimals: number,
) {
  const signer = contractToApprove.getSigner();
  const provider = contractToApprove.getProvider();
  const ERC20Abi = (
    await import("@thirdweb-dev/contracts-js/dist/abis/IERC20.json")
  ).default;
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
  const totalPrice = BigNumber.from(price)
    .mul(BigNumber.from(quantity))
    .div(utils.parseUnits("1", tokenDecimals));
  if (allowance.lt(totalPrice)) {
    await erc20.sendTransaction("approve", [
      spender,
      allowance.add(totalPrice),
    ]);
  }
}
