import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  type GetCapabilitiesResult,
  getCapabilities,
} from "../../../../wallets/eip5792/get-capabilities.js";
import { useActiveWallet } from "./useActiveWallet.js";

/**
 * A hook to get the current wallet's capabilities according to [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792).
 *
 *  This function is dependent on the wallet's support for EIP-5792, but will not throw.
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
  chainId?: number;
  queryOptions?: {
    enabled?: boolean;
    retry?: number;
  };
}): UseQueryResult<GetCapabilitiesResult> {
  const wallet = useActiveWallet();
  return useQuery({
    queryFn: async () => {
      if (!wallet) {
        return {
          message: "Can't get capabilities, no wallet connected",
        } as const;
      }
      return getCapabilities({
        chainId: options?.chainId,
        wallet,
      });
    },
    queryKey: ["getCapabilities", wallet?.id, options?.chainId] as const,
    retry: false,
    ...options?.queryOptions,
  });
}
