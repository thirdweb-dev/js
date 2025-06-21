"use client";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../client/client.js";
import { getLastAuthProvider } from "../../../react/core/utils/storage.js";
import { webLocalStorage } from "../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { ClientScopedStorage } from "../../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../../../wallets/in-app/core/wallet/types.js";
import { useActiveWallet } from "../../core/hooks/wallets/useActiveWallet.js";

/**
 * Embeds another thirdweb-supported site for seamless in-app and ecosystem wallet connection.
 *
 *  Make sure the embedded site includes <AutoConnect /> and supports frame ancestors, see [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) for more information.
 *
 *  The embedded site must support the connected wallet (ecosystem or in-app).
 *
 * @param {Object} props - The props to pass to the iframe
 * @param {String} props.src - The URL of the site to embed
 * @param {ThirdwebClient} props.client - The current site's thirdweb client
 * @param {Ecosystem} [props.ecosystem] - The ecosystem to use for the wallet connection in the embedded site
 *
 * @example
 * ```tsx
 * import { SiteEmbed } from "thirdweb/react";
 *
 * <SiteEmbed src="https://thirdweb.com" client={thirdwebClient} ecosystem={{ id: "ecosystem.thirdweb" }} />
 * ```
 * @walletConnection
 */
export function SiteEmbed({
  src,
  client,
  ecosystem,
  ...props
}: {
  src: string;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
} & React.DetailedHTMLProps<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
>) {
  if (!client.clientId) {
    throw new Error("The SiteEmbed client must have a clientId");
  }

  const activeWallet = useActiveWallet();
  const walletId = activeWallet?.id;

  const { data: { authProvider, authCookie } = {} } = useQuery({
    enabled:
      activeWallet &&
      (isEcosystemWallet(activeWallet) ||
        walletId === "inApp" ||
        walletId === "smart"),
    queryFn: async () => {
      const storage = new ClientScopedStorage({
        clientId: client.clientId,
        ecosystem,
        storage: webLocalStorage,
      });

      const authProvider = await getLastAuthProvider(webLocalStorage);
      const authCookie = await storage.getAuthCookie();

      return { authCookie, authProvider };
    },
    queryKey: ["site-embed", walletId, src, client.clientId, ecosystem],
  });

  const url = new URL(src);
  if (walletId) {
    url.searchParams.set("walletId", walletId === "smart" ? "inApp" : walletId);
  }
  if (authProvider) {
    url.searchParams.set("authProvider", authProvider);
  }
  if (authCookie) {
    url.searchParams.set("authCookie", authCookie);
  }

  return (
    <iframe
      allowFullScreen
      height="100%"
      src={encodeURI(url.toString())}
      width="100%"
      {...props}
    />
  );
}
