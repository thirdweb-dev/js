import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSDK } from "@thirdweb-dev/react";
import invariant from "tiny-invariant";
import { walletKeys } from "../cache-keys";

type TransferInput = {
  address: string;
  amount: string;
};

export function useTransferNativeToken() {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TransferInput) => {
      invariant(sdk, "SDK is not initialized");
      await sdk.wallet.transfer(input.address, input.amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(walletKeys.balances(variables.address));
    },
  });
}
