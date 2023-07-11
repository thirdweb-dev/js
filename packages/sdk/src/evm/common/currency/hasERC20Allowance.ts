import { ContractWrapper } from "../../core/classes/contract-wrapper";
import type { IERC20 } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { BigNumber } from "ethers";

export async function hasERC20Allowance(
  contractToApprove: ContractWrapper<any>,
  currencyAddress: string,
  value: BigNumber,
) {
  const provider = contractToApprove.getProvider();
  const erc20 = new ContractWrapper<IERC20>(
    provider,
    currencyAddress,
    ERC20Abi,
    {},
    contractToApprove.storage,
  );
  const owner = await contractToApprove.getSignerAddress();
  const spender = contractToApprove.readContract.address;
  const allowance = await erc20.readContract.allowance(owner, spender);
  return allowance.gte(value);
}
