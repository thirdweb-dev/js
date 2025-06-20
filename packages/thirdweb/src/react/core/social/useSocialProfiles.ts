import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../client/client.js";
import { getSocialProfiles } from "../../../social/profiles.js";

/**
 * Fetches the wallet's available social profiles.
 * @param options - The options to use when fetching the social profiles.
 * @param options.client - The Thirdweb client.
 * @param options.address - The wallet address to fetch the social profiles for.
 * @returns A React Query result containing the social profiles.
 *
 * @example
 * ```tsx
 * import { useSocialProfiles } from "thirdweb/react";
 * const { data: profiles } = useSocialProfiles({
 *   client,
 *   address: "0x...",
 * });
 * ```
 *
 * @social
 * @beta
 */
export function useSocialProfiles(options: {
  client: ThirdwebClient;
  address: string | undefined;
}) {
  const { client, address } = options;
  return useQuery({
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        throw new Error(
          "Address is required, should not have reached this point.",
        );
      }
      return await getSocialProfiles({ address, client });
    },
    queryKey: ["social-profiles", address],
    retry: 3,
  });
}
