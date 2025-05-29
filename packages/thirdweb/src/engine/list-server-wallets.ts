import { listAccounts } from "@thirdweb-dev/engine";
import { stringify } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";

export type GetServerWalletsArgs = {
  client: ThirdwebClient;
};

/**
 * List all server wallets.
 * @param params - The parameters for the server wallet.
 * @param params.client - The thirdweb client to use.
 * @returns an array of server wallets with their signer address and predicted smart account address.
 * @engine
 * @example
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const serverWallets = await Engine.getServerWallets({
 *   client,
 * });
 * console.log(serverWallets);
 * ```
 */
export async function getServerWallets(params: GetServerWalletsArgs) {
  const { client } = params;
  const result = await listAccounts({
    baseUrl: getThirdwebBaseUrl("engineCloud"),
    bodySerializer: stringify,
    fetch: getClientFetch(client),
  });

  if (result.error) {
    throw new Error(`Error listing server wallets: ${stringify(result.error)}`);
  }

  const data = result.data?.result;

  if (!data) {
    throw new Error("No server wallets found");
  }

  return data;
}
