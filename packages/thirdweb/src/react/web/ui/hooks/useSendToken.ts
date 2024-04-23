import { useMutation } from "@tanstack/react-query";
import { getContract } from "../../../../contract/contract.js";
import { transfer } from "../../../../extensions/erc20/write/transfer.js";
import { waitForReceipt } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import { prepareTransaction } from "../../../../transaction/prepare-transaction.js";
import { toWei } from "../../../../utils/units.js";
import { useSendTransactionCore } from "../../../core/hooks/contract/useSendTransaction.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/wallet-hooks.js";

// Q: Should we expose this hook?

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @internal
 */
export function useSendToken() {
  const sendTransaction = useSendTransactionCore();
  const activeChain = useActiveWalletChain();
  const { client } = useConnectUI();

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
