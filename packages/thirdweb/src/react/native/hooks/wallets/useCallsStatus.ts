import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { GetCallsStatusResponse } from "../../../../wallets/eip5792/types.js";
import { useCallsStatusCore } from "../../../core/hooks/wallets/useCallsStatus.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * A hook to get a call bundle's current status according to [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792).
 *
 * @note This function is dependent on the wallet's support for EIP-5792 and could throw an error if it's not supported.
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
  queryOptions?: Pick<UseQueryOptions, "enabled" | "retry">;
}): UseQueryResult<GetCallsStatusResponse> {
  const wallet = useActiveWallet();

  return useCallsStatusCore(options, wallet);
}
