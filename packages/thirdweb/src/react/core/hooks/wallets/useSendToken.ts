import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { resolveAddress } from "../../../../extensions/ens/resolve-address.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { estimateGas } from "../../../../transaction/actions/estimate-gas.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import { waitForReceipt } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { isAddress } from "../../../../utils/address.js";
import { isValidENSName } from "../../../../utils/ens/isValidENSName.js";
import { toWei } from "../../../../utils/units.js";
import { getWalletBalance } from "../../../../wallets/utils/getWalletBalance.js";
import { invalidateWalletBalance } from "../../providers/invalidateWalletBalance.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @example
 * ```tsx
 * const { mutate: sendToken } = useSendToken(client);
 *
 * // send native currency
 * sendToken({
 *    receiverAddress: "0x...",
 *    amount: "0.1",
 * });
 *
 * // send ERC20
 * sendToken({
 *   tokenAddress,
 *   receiverAddress: "0x...",
 *   amount: "0.5",
 * });
 * ```
 * @wallet
 */
export function useSendToken(client: ThirdwebClient) {
  const wallet = useActiveWallet();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(option: {
      tokenAddress?: string;
      receiverAddress: string;
      amount: string;
    }) {
      const { tokenAddress, receiverAddress, amount } = option;
      const activeChain = wallet?.getChain();
      const account = wallet?.getAccount();

      // state validation
      if (!activeChain) {
        throw new Error("No active chain");
      }
      if (!account) {
        throw new Error("No active account");
      }

      // input validation
      if (
        !receiverAddress ||
        (!isValidENSName(receiverAddress) && !isAddress(receiverAddress))
      ) {
        throw new Error("Invalid receiver address");
      }

      if (!amount || Number.isNaN(Number(amount)) || Number(amount) < 0) {
        throw new Error("Invalid amount");
      }

      let to = receiverAddress;
      // resolve ENS if needed
      try {
        to = await resolveAddress({
          client,
          name: receiverAddress,
        });
      } catch {
        throw new Error("Failed to resolve address");
      }

      // native token transfer
      if (!tokenAddress) {
        const sendNativeTokenTx = prepareTransaction({
          chain: activeChain,
          client,
          to,
          value: toWei(amount),
        });
        const gasEstimate = await estimateGas({
          account,
          transaction: sendNativeTokenTx,
        });
        const balance = await getWalletBalance({
          address: account.address,
          chain: activeChain,
          client,
        });
        if (toWei(amount) + gasEstimate > balance.value) {
          throw new Error("Insufficient balance for transfer amount and gas");
        }

        return await sendTransaction({
          account,
          transaction: sendNativeTokenTx,
        });
      }
      // erc20 token transfer
      else {
        const contract = getContract({
          address: tokenAddress,
          chain: activeChain,
          client,
        });

        const tx = transfer({
          amount,
          contract,
          to,
        });

        return await sendTransaction({
          account,
          transaction: tx,
        });
      }
    },
    onSettled: async (data, error) => {
      if (error) {
        return;
      }
      if (data?.transactionHash) {
        await waitForReceipt({
          chain: data.chain,
          client,
          maxBlocksWaitTime: 10_000,
          transactionHash: data.transactionHash,
        });
      }
      invalidateWalletBalance(queryClient);
    },
  });
}
