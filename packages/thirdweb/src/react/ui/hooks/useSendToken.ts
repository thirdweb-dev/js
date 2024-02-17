import { useMutation } from "@tanstack/react-query";
import { transfer } from "../../../extensions/erc20.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { useSendTransaction } from "../../hooks/contract/useSend.js";
import { useActiveWalletChain } from "../../providers/wallet-provider.js";
import {
  prepareTransaction,
  waitForReceipt,
} from "../../../transaction/index.js";
import { parseEther } from "../../../utils/units.js";
import { getContract } from "../../../contract/index.js";

// Q: Should we expose this hook?

/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @internal
 */
export function useSendToken() {
  const sendTransaction = useSendTransaction();
  const activeChain = useActiveWalletChain();
  const { client } = useThirdwebProviderProps();

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
