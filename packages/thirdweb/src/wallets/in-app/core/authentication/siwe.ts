import { signLoginPayload } from "../../../../auth/core/sign-login-payload.js";
import type { LoginPayload } from "../../../../auth/core/types.js";
import type { Chain } from "../../../../chains/types.js";
import { getCachedChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { Wallet } from "../../../interfaces/wallet.js";
import type { Ecosystem } from "../wallet/types.js";
import { getLoginCallbackUrl, getLoginUrl } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

// wallets that cannot sign with ethereum mainnet, require a specific chain always
const NON_ETHEREUM_WALLETS = ["xyz.abs"];

/**
 * @internal
 */
export async function siweAuthenticate(args: {
  wallet: Wallet;
  client: ThirdwebClient;
  chain?: Chain;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const { wallet, client, ecosystem, chain } = args;
  const siweChain = NON_ETHEREUM_WALLETS.includes(wallet.id)
    ? chain || getCachedChain(1)
    : getCachedChain(1); // fallback to mainnet for SIWE for wide wallet compatibility
  // only connect if the wallet doesn't alnready have an account
  const account =
    wallet.getAccount() || (await wallet.connect({ chain: siweChain, client }));
  const clientFetch = getClientFetch(client, ecosystem);

  const payload = await (async () => {
    const path = getLoginUrl({
      authOption: "wallet",
      client: args.client,
      ecosystem: args.ecosystem,
    });
    const res = await clientFetch(
      `${path}&address=${account.address}&chainId=${siweChain.id}`,
    );

    if (!res.ok) throw new Error("Failed to generate SIWE login payload");

    return (await res.json()) satisfies LoginPayload;
  })();
  const { signature } = await signLoginPayload({ account, payload });

  const authResult = await (async () => {
    const path = getLoginCallbackUrl({
      authOption: "wallet",
      client: args.client,
      ecosystem: args.ecosystem,
    });
    const res = await clientFetch(
      `${path}&signature=${signature}&payload=${encodeURIComponent(payload)}`,
      {
        body: stringify({
          payload,
          signature,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );

    if (!res.ok) throw new Error("Failed to verify SIWE signature");

    return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
  })();
  return authResult;
}
