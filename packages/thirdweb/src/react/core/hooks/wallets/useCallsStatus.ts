import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getCallsStatus } from "../../../../wallets/eip5792/get-calls-status.js";
import type { GetCallsStatusResponse } from "../../../../wallets/eip5792/types.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * A hook to get a call bundle's current status according to [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792).
 *
 * This function is dependent on the wallet's support for EIP-5792 and could throw an error if it's not supported.
 *
 * @returns a React Query object.
 * @beta
 * @example
 * ```tsx
 * import { useCallsStatus } from "thirdweb/react";
 * const { data: status, isLoading } = useCallsStatus({ bundleId, client });
 * ```
 * @extension EIP5792
 */
export function useCallsStatus(options: {
  bundleId: string;
  client: ThirdwebClient;
  queryOptions?: {
    enabled?: boolean;
    retry?: number;
  };
}): UseQueryResult<GetCallsStatusResponse> {
  const { client, bundleId } = options;
  const wallet = useActiveWallet();

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
