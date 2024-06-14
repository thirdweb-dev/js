import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type GetCapabilitiesResult,
  getCapabilities,
} from "../../../../wallets/eip5792/get-capabilities.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";

export function useCapabilitiesCore(
  options?: {
    queryOptions?: Pick<UseQueryOptions, "enabled" | "retry">;
  },
  wallet?: Wallet,
): UseQueryResult<GetCapabilitiesResult> {
  return useQuery({
    queryKey: [
      "getCapabilities",
      wallet?.getChain()?.id || -1,
      wallet?.id,
    ] as const,
    queryFn: async () => {
      if (!wallet) {
        return {
          message: "Can't get capabilities, no wallet connected",
        } as const;
      }
      return getCapabilities({ wallet });
    },
    retry: false,
    ...options?.queryOptions,
  });
}
