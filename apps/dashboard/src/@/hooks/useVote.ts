import { useMutation } from "@tanstack/react-query";
import {
  type BaseTransactionOptions,
  getAddress,
  getContract,
  type ThirdwebContract,
  toTokens,
} from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as VoteExt from "thirdweb/extensions/vote";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import invariant from "tiny-invariant";

export async function tokensDelegated(
  options: BaseTransactionOptions<{ account: Account | undefined }>,
) {
  if (!options.account) {
    throw new Error("Expected an account to be passed in options");
  }
  const tokenAddress = await VoteExt.token(options);
  if (!tokenAddress) {
    throw new Error("Expected a delegated token address");
  }
  const tokenContract = getContract({
    ...options.contract,
    address: tokenAddress,
  });
  const delegatedAddress = await ERC20Ext.delegates({
    account: options.account.address,
    contract: tokenContract,
  });
  return getAddress(delegatedAddress) === getAddress(options.account.address);
}

export async function voteTokenBalances(
  options: BaseTransactionOptions<{ addresses: string[] }>,
) {
  invariant(options.addresses.length, "addresses are required");
  const tokenAddress = await VoteExt.token({ contract: options.contract });
  if (!tokenAddress) {
    throw new Error("Expected a delegated token address");
  }
  const tokenContract = getContract({
    ...options.contract,
    address: tokenAddress,
  });
  const [decimals, balanceData] = await Promise.all([
    ERC20Ext.decimals({ contract: tokenContract }),
    Promise.all(
      options.addresses.map((address) =>
        ERC20Ext.balanceOf({ address, contract: tokenContract }),
      ),
    ),
  ]);
  return options.addresses.map((address, index) => {
    const balance = balanceData[index] || 0n;
    return {
      address,
      balance: toTokens(balance, decimals),
      decimals: decimals,
    };
  });
}

/**
 * Get the decimals of the voting erc20 token
 *
 * TODO: move this into SDK extensions?
 */
export async function votingTokenDecimals(options: BaseTransactionOptions) {
  const tokenAddress = await VoteExt.token(options);
  if (!tokenAddress) {
    throw new Error("Expected a delegated token address");
  }
  const tokenContract = getContract({
    ...options.contract,
    address: tokenAddress,
  });
  return await ERC20Ext.decimals({ contract: tokenContract });
}

export function useDelegateMutation() {
  const { mutateAsync } = useSendAndConfirmTransaction();

  return useMutation({
    mutationFn: async (contract: ThirdwebContract) => {
      const tokenAddress = await VoteExt.token({ contract });
      if (!tokenAddress) {
        throw new Error("Expected a delegated token address");
      }
      const tokenContract = getContract({
        ...contract,
        address: tokenAddress,
      });
      const transaction = ERC20Ext.delegate({
        contract: tokenContract,
        delegatee: contract.address,
      });
      return await mutateAsync(transaction);
    },
  });
}
