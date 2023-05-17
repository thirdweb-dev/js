import { BigNumber, BigNumberish, ethers } from "ethers";
import { Amount } from "../../types";
import { BaseERC1155, BaseERC20, BaseERC721 } from "../../types/eips";
import { ContractWrapper } from "./contract-wrapper";
import { AmountSchema } from "../../../core/schema/shared";
import { AddressOrEns } from "../../schema";
import { resolveAddress } from "../../common";

export class Staking {
  protected async normalizeAmount(
    amount: Amount,
    tokenContractWrapper: ContractWrapper<BaseERC20>,
  ): Promise<BigNumber> {
    const decimals = await tokenContractWrapper.readContract.decimals();
    return ethers.utils.parseUnits(AmountSchema.parse(amount), decimals);
  }

  protected async handleTokenApproval(
    amount: BigNumberish,
    owner: AddressOrEns,
    spender: AddressOrEns,
    tokenContractWrapper: ContractWrapper<BaseERC20>,
  ) {
    // Check if already approved
    const allowance = await tokenContractWrapper.readContract.allowance(
      await resolveAddress(owner),
      await resolveAddress(spender),
    );
    if (allowance.gte(amount)) {
      return;
    }
    // Approve token spending
    await tokenContractWrapper.writeContract.approve(
      await resolveAddress(spender),
      amount,
    );
  }

  protected async handleNftApproval(
    owner: AddressOrEns,
    operator: AddressOrEns,
    tokenContractWrapper: ContractWrapper<BaseERC721 | BaseERC1155>,
  ) {
    const isApproved = await tokenContractWrapper.readContract.isApprovedForAll(
      await resolveAddress(owner),
      await resolveAddress(operator),
    );
    if (isApproved) {
      return;
    }
    // Approve NFT operator
    await tokenContractWrapper.writeContract.setApprovalForAll(
      await resolveAddress(operator),
      true,
    );
  }
}
