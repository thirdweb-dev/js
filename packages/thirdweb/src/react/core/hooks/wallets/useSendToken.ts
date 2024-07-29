import { useMutation } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { resolveAddress } from "../../../../extensions/ens/resolve-address.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { isAddress } from "../../../../utils/address.js";
import { toWei } from "../../../../utils/units.js";
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
        (!receiverAddress.endsWith(".eth") && !isAddress(receiverAddress))
      ) {
        throw new Error("Invalid address");
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
      } catch (e) {
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

        await sendTransaction({
          transaction: sendNativeTokenTx,
          account,
        });
      }

      // erc20 token transfer
      else {
        const contract = getContract({
          address: tokenAddress,
          client,
          chain: activeChain,
        });

        const tx = transfer({
          amount,
          contract,
          to,
        });

        await sendTransaction({
          transaction: tx,
          account,
        });
      }
    },
  });
}
