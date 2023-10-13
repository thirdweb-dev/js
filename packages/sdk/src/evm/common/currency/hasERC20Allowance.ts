import type { IERC20 } from "@thirdweb-dev/contracts-js";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import { BigNumber } from "ethers";
import { ContractWrapper } from "../../core/classes/contract-wrapper";

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
  const spender = contractToApprove.address;
  const allowance = await erc20.read("allowance", [owner, spender]);
  return allowance.gte(value);
}
