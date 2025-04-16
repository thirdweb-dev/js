import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";
import type { SocialProfile } from "./types.js";

/**
 * Fetches the wallet's available social profiles.
 * @param args - The arguments to use when fetching the social profiles.
 * @param args.address - The wallet address to fetch the social profiles for.
 * @param args.client - The Thirdweb client.
 * @returns A promise resolving to the array of social profiles for the given address.
 *
 * @example
 * ```ts
 * import { getSocialProfiles } from "thirdweb/social";
 * const profiles = await getSocialProfiles({
 *   address: "0x...",
 *   client,
 * });
 * ```
 * @social
 * @beta
 */
export async function getSocialProfiles(args: {
  address: string;
  client: ThirdwebClient;
}): Promise<SocialProfile[]> {
  const { address, client } = args;

  const clientFetch = getClientFetch(client);
  const response = await clientFetch(
    `${getThirdwebBaseUrl("social")}/v1/profiles/${address}`,
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Failed to fetch profile: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  return (await response.json()).data as SocialProfile[];
}
