import { signLoginPayload } from "../../../../auth/core/sign-login-payload.js";
import type { LoginPayload } from "../../../../auth/core/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { InjectedSupportedWalletIds } from "../../../../wallets/__generated__/wallet-ids.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import type { Ecosystem } from "../../web/types.js";
import { getLoginCallbackUrl, getLoginUrl } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

/**
 * @internal
 */
export async function siweAuthenticate(args: {
  walletId: InjectedSupportedWalletIds;
  chainId: number;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const wallet = createWallet(args.walletId);
  const account = await wallet.connect({ client: args.client });
  const clientFetch = getClientFetch(args.client, args.ecosystem);

  const payload = await (async () => {
    const path = getLoginUrl({
      authOption: "siwe",
      client: args.client,
      ecosystem: args.ecosystem,
    });
    const res = await clientFetch(
      `${path}&address=${account.address}&chainId=${args.chainId}`,
    );

    if (!res.ok) throw new Error("Failed to generate SIWE login payload");

    return (await res.json()) satisfies LoginPayload;
  })();
  const { signature } = await signLoginPayload({ payload, account });

  const authResult = await (async () => {
    const path = getLoginCallbackUrl({
      authOption: "siwe",
      client: args.client,
      ecosystem: args.ecosystem,
    });
    const res = await clientFetch(
      `${path}&signature=${signature}&payload=${encodeURIComponent(payload)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
          payload,
        }),
      },
    );

    if (!res.ok) throw new Error("Failed to verify SIWE signature");

    return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
  })();
  return authResult;
}
