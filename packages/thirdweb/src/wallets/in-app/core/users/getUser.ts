import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { OneOf, Prettify } from "../../../../utils/type-utils.js";
import type { Profile } from "../authentication/types.js";
import type { Ecosystem } from "../wallet/types.js";

export type GetUserResult = {
  userId: string;
  walletAddress: string;
  email?: string;
  phone?: string;
  createdAt: string;
  profiles: Profile[];
};

/**
 * Gets user based on the provided query parameters.
 * @note This function is only available on the server (a secret key is required in the client).
 *
 * @param options - The options for the find users function.
 * @param options.client - The Thirdweb client with a secret key included.
 * @param [options.walletAddress] - The wallet address to query by.
 * @param [options.email] - The email to query by.
 * @param [options.phone] - The phone number to query by.
 * @param [options.id] - The user ID to query by.
 *
 * @returns An array of user objects.
 *
 * @example
 * ```ts
 * import { getUser } from "thirdweb/wallets";
 *
 * const user = await getUser({
 *   client,
 *   walletAddress: "0x123...",
 * });
 * ```
 *
 * @wallet
 */
export async function getUser({
  client,
  walletAddress,
  email,
  phone,
  id,
  ecosystem,
}: Prettify<
  {
    client: ThirdwebClient;
  } & OneOf<{
    walletAddress?: string;
    email?: string;
    phone?: string;
    id?: string;
    ecosystem?: Ecosystem;
  }>
>): Promise<GetUserResult | null> {
  if (!client.secretKey) {
    throw new Error(
      "A secret key is required to query for users. If you're making this request from the server, please add a secret key to your client.",
    );
  }

  const url = new URL(
    `${getThirdwebBaseUrl("inAppWallet")}/api/2023-11-30/embedded-wallet/user-details`,
  );

  if (walletAddress) {
    url.searchParams.set("queryBy", "walletAddress");
    url.searchParams.set("walletAddress", walletAddress);
  } else if (email) {
    url.searchParams.set("queryBy", "email");
    url.searchParams.set("email", email);
  } else if (phone) {
    url.searchParams.set("queryBy", "phone");
    url.searchParams.set("phone", phone);
  } else if (id) {
    url.searchParams.set("queryBy", "id");
    url.searchParams.set("id", id);
  } else {
    throw new Error(
      "Please provide a walletAddress, email, phone, or id to query for users.",
    );
  }

  const clientFetch = getClientFetch(client, ecosystem);

  const res = await clientFetch(url.toString());

  if (!res.ok) {
    throw new Error("Failed to get profiles");
  }

  const data = (await res.json()) as {
    userId: string;
    walletAddress: string;
    email?: string;
    phone?: string;
    createdAt: string;
    linkedAccounts: Profile[];
  }[];

  return (
    data.map((item) => ({
      userId: item.userId,
      walletAddress: item.walletAddress,
      email: item.email,
      phone: item.phone,
      createdAt: item.createdAt,
      profiles: item.linkedAccounts,
    }))[0] || null
  );
}
