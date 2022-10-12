import { createSOLQueryKeyWithNetwork } from "../../../core/query-utils/query-key";
import { RequiredParam } from "../../../core/types/shared";
import { useSDK } from "../../providers/base";
import { useQuery } from "@tanstack/react-query";
import { UserWallet } from "@thirdweb-dev/sdk/solana";
import invariant from "tiny-invariant";

export function balanceQuery(wallet: RequiredParam<UserWallet>) {
  const address = wallet?.getAddress();
  const network = wallet?.network;

  return {
    queryKey: createSOLQueryKeyWithNetwork(
      ["wallet-balance", { address }] as const,
      network,
    ),

    queryFn: async () => {
      invariant(wallet, "wallet is required");

      return await wallet.getBalance();
    },
    enabled: !!wallet && !!address && !!network,
  };
}

/**
 * Get the currently connected wallet balance
 *
 * @returns the balace of the connected wallet
 */
export function useBalance() {
  const wallet = useSDK()?.wallet;
  return useQuery(balanceQuery(wallet));
}
