import { defineChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { generateWallet } from "../../wallets/in-app/core/actions/generate-wallet.enclave.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../wallets/in-app/core/authentication/types.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
import type { UserWallet } from "./types.js";

export async function createUserWallet(args: {
  client: ThirdwebClient;
  ecosystem: Ecosystem | undefined;
  authResult: AuthStoredTokenWithCookieReturnType;
}): Promise<UserWallet> {
  let address = args.authResult.storedToken.authDetails.walletAddress;
  const authToken = args.authResult.storedToken.cookieString;

  if (!authToken) {
    throw new Error("Failed to login");
  }

  // TODO: this will be done in the gateway API
  if (!address) {
    const wallet = await generateWallet({
      client: args.client,
      ecosystem: args.ecosystem,
      authToken,
    });
    address = wallet.address;
  }

  return {
    client: args.client,
    address,
    authToken,
    getBalance: async (options: { chainId: number }) => {
      const { getWalletBalance } = await import(
        "../../wallets/utils/getWalletBalance.js"
      );
      return getWalletBalance({
        client: args.client,
        address,
        chain: defineChain(options.chainId),
      });
    },
    getProfiles: async () => {
      const { fetchUserProfiles } = await import(
        "../../wallets/in-app/core/authentication/linkAccount.js"
      );
      return fetchUserProfiles({
        client: args.client,
        ecosystem: args.ecosystem,
        authToken,
      });
    },
  };
}
