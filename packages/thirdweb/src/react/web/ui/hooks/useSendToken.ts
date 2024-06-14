import { useMutation } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getContract } from "../../../../contract/contract.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { waitForReceipt } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { toWei } from "../../../../utils/units.js";
import { useSendTransaction } from "../../hooks/transaction/useSendTransaction.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";

// Q: Should we expose this hook?

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @internal
 */
export function useSendToken(client: ThirdwebClient) {
  const sendTransaction = useSendTransaction({
    payModal: false,
  });
  const activeChain = useActiveWalletChain();

  return useMutation({
    async mutationFn(option: {
      tokenAddress?: string;
      receiverAddress: string;
      amount: string;
    }) {
      const { tokenAddress, receiverAddress, amount } = option;
      if (!activeChain) {
        throw new Error("No active chain");
      }

      // native token transfer
      if (!tokenAddress) {
        const sendNativeTokenTx = prepareTransaction({
          chain: activeChain,
          client,
          to: receiverAddress,
          value: toWei(amount),
        });

        const txHash = await sendTransaction.mutateAsync(sendNativeTokenTx);
        await waitForReceipt(txHash);
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
          to: receiverAddress,
        });

        const txHash = await sendTransaction.mutateAsync(tx);
        await waitForReceipt(txHash);
      }
    },
  });
}
