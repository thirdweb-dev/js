import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { GetCapabilitiesResult } from "../../../../wallets/eip5792/get-capabilities.js";
import { useCapabilitiesCore } from "../../../core/hooks/wallets/useCapabilities.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * A hook to get the current wallet's capabilities according to [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792).
 *
 * @note This function is dependent on the wallet's support for EIP-5792, but will not throw.
 * **The returned object contains a `message` field detailing any issues with the wallet's support for EIP-5792.**
 *
 * @returns a React Query object.
 * @beta
 * @example
 * ```tsx
 * import { useCapabilities } from "thirdweb/react";
 * const { data: capabilities, isLoading } = useCapabilities();
 * ```
 * @extension EIP5792
 */
export function useCapabilities(options?: {
  queryOptions?: Pick<UseQueryOptions, "enabled" | "retry">;
}): UseQueryResult<GetCapabilitiesResult> {
  const wallet = useActiveWallet();
  return useCapabilitiesCore(options, wallet);
}
