import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getCallsStatus } from "../../../../wallets/eip5792/get-calls-status.js";
import type { GetCallsStatusResponse } from "../../../../wallets/eip5792/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";

export function useCallsStatusCore(
  options: {
    bundleId: string;
    client: ThirdwebClient;
    queryOptions?: Pick<UseQueryOptions, "enabled" | "retry">;
  },
  wallet?: Wallet,
): UseQueryResult<GetCallsStatusResponse> {
  const { client, bundleId } = options;

  return useQuery({
    queryKey: [
      "getCapabilities",
      wallet?.getChain()?.id || -1,
      wallet?.id,
    ] as const,
    queryFn: async () => {
      if (!wallet) {
        throw new Error("Failed to get calls status, no wallet connected");
      }
      return getCallsStatus({ wallet, client, bundleId });
    },
    retry: false,
    enabled: !!bundleId && wallet !== undefined,
    ...options.queryOptions,
  });
}
