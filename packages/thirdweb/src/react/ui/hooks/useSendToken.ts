import { useMutation } from "@tanstack/react-query";
import { transfer } from "../../../extensions/erc20.js";
import { prepareTransaction, waitForReceipt } from "../../../index.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import { parseEther, getContract } from "../../../index.js";
import { useActiveWalletChainId } from "../../providers/wallet-provider.js";

// Q: Should we expose this hook?

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @internal
 */
export function useSendToken() {
  const sendTransaction = useSendTransaction();
  const chainId = useActiveWalletChainId();
  const { client } = useThirdwebProviderProps();

  return useMutation({
    async mutationFn(option: {
      tokenAddress?: string;
      receiverAddress: string;
      amount: string;
    }) {
      const { tokenAddress, receiverAddress, amount } = option;
      if (!chainId) {
        throw new Error("No active wallet");
      }

      // native token transfer
      if (!tokenAddress) {
        const sendNativeTokenTx = prepareTransaction({
          chain: chainId,
          client,
          to: receiverAddress,
          value: parseEther(amount),
        });

        const txHash = await sendTransaction.mutateAsync(sendNativeTokenTx);
        await waitForReceipt(txHash);
      }

      // erc20 token transfer
      else {
        const contract = getContract({
          address: tokenAddress,
          client,
          chain: chainId,
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
