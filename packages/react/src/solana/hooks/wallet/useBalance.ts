import { createSOLQueryKeyWithNetwork } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useSDK } from "../../providers/base";
import { useQuery } from "@tanstack/react-query";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function balanceQuery(sdk: RequiredParam<ThirdwebSDK>) {
  const address = sdk?.wallet?.getAddress();
  const network = sdk?.network;

  return {
    queryKey: createSOLQueryKeyWithNetwork(
      ["wallet-balance", { address }] as const,
      network,
    ),

    queryFn: () => {
      invariant(sdk, "sdk is required");

      return sdk.wallet.getBalance();
    },
    enabled: !!sdk && !!address && !!network,
  };
}

/**
 * Get the currently connected wallet balance
 *
 * @returns the balace of the connected wallet
 */
export function useBalance() {
  const sdk = useSDK();
  return useQuery(balanceQuery(sdk));
}
