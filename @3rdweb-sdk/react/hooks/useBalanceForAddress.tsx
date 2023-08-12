import { useQuery } from "@tanstack/react-query";
import { useSDK } from "@thirdweb-dev/react";
import invariant from "tiny-invariant";
import { walletKeys } from "../cache-keys";

export function useBalanceForAddress(address: string | undefined) {
  const sdk = useSDK();
  invariant(address, "Address is not provided");
  return useQuery(walletKeys.balances(address), async () => {
    invariant(sdk, "SDK is not initialized");
    return await sdk.getBalance(address);
  });
}
