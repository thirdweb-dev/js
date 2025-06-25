import { createAccount } from "@thirdweb-dev/engine";
import { stringify } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { getThirdwebBaseUrl } from "../utils/domains.js";
import { getClientFetch } from "../utils/fetch.js";

export type CreateServerWalletArgs = {
  client: ThirdwebClient;
  label: string;
};

/**
 * Create a server wallet.
 * @param params - The parameters for the server wallet.
 * @param params.client - The thirdweb client to use.
 * @param params.label - The label for the server wallet.
 * @returns The server wallet signer address and the predicted smart account address.
 * @engine
 * @example
 * ```ts
 * import { Engine } from "thirdweb";
 *
 * const serverWallet = await Engine.createServerWallet({
 *   client,
 *   label: "My Server Wallet",
 * });
 * console.log(serverWallet.address);
 * console.log(serverWallet.smartAccountAddress);
 * ```
 */
export async function createServerWallet(params: CreateServerWalletArgs) {
  const { client, label } = params;
  const result = await createAccount({
    baseUrl: getThirdwebBaseUrl("engineCloud"),
    body: {
      label,
    },
    bodySerializer: stringify,
    fetch: getClientFetch(client),
  });

  if (result.error) {
    throw new Error(
      `Error creating server wallet with label ${label}: ${stringify(
        result.error,
      )}`,
    );
  }

  const data = result.data?.result;

  if (!data) {
    throw new Error(`No server wallet created with label ${label}`);
  }

  return data;
}
