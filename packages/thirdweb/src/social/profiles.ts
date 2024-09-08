import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import type { SocialProfiles } from "./types.js";

/**
 * Fetches the wallet's available social profiles.
 * @param args - The arguments to use when fetching the social profiles.
 * @param args.address - The wallet address to fetch the social profiles for.
 * @param args.client - The Thirdweb client.
 * @returns A promise resolving to the retrieved social profiles for different protocols. If a profile is not available for a protocol, the value will be `null`.
 *
 * @example
 * ```ts
 * import { getProfiles } from "thirdweb/social";
 * const profiles = await getProfiles({
 *   address: "0x...",
 *   client,
 * });
 * ```
 * @beta
 */
export async function getSocialProfiles(args: {
  address: string;
  client: ThirdwebClient;
}): Promise<SocialProfiles> {
  const { address, client } = args;

  const clientFetch = getClientFetch(client);
  const response = await clientFetch(
    `${getThirdwebBaseUrl("social")}/v1/profiles/${address}`,
  );

  if (response.status !== 200) {
    try {
      const errorBody = await response.json();
      throw new Error(`Failed to fetch profile: ${errorBody.message}`);
    } catch {
      throw new Error(
        `Failed to fetch profile: ${response.status}\n${await response.text()}`,
      );
    }
  }

  return (await response.json()).data as SocialProfiles;
}
