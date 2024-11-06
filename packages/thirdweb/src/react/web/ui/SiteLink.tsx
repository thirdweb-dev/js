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
 * Creates a link to another thirdweb-supported site with wallet connection parameters.
 *
 * @note The target site must support the connected wallet (ecosystem or in-app).
 *
 * @param {Object} props - The props to pass to the anchor tag
 * @param {String} props.href - The URL of the site to link to
 * @param {ThirdwebClient} props.client - The current site's thirdweb client
 * @param {Ecosystem} [props.ecosystem] - The ecosystem to use for the wallet connection in the target site
 * @param {React.ReactNode} props.children - The content to render inside the link
 *
 * @example
 * ```tsx
 * import { SiteLink } from "thirdweb/react";
 *
 * <SiteLink href="https://thirdweb.com" client={thirdwebClient} ecosystem={{ id: "ecosystem.thirdweb" }}>
 *   Visit Site
 * </SiteLink>
 * ```
 */
export function SiteLink({
  href,
  client,
  ecosystem,
  children,
  ...props
}: {
  href: string;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (!client.clientId) {
    throw new Error("The SiteLink client must have a clientId");
  }

  const activeWallet = useActiveWallet();
  const walletId = activeWallet?.id;

  const {
    data: { authProvider, authCookie } = {},
  } = useQuery({
    queryKey: ["site-link", walletId, href, client.clientId, ecosystem],
    enabled:
      activeWallet && (isEcosystemWallet(activeWallet) || walletId === "inApp"),
    queryFn: async () => {
      const storage = new ClientScopedStorage({
        storage: webLocalStorage,
        clientId: client.clientId,
        ecosystem,
      });

      const authProvider = await getLastAuthProvider(webLocalStorage);
      const authCookie = await storage.getAuthCookie();

      return { authProvider, authCookie };
    },
  });

  const url = new URL(href);
  if (walletId) {
    url.searchParams.set("walletId", walletId);
  }
  if (authProvider) {
    url.searchParams.set("authProvider", authProvider);
  }
  if (authCookie) {
    url.searchParams.set("authCookie", authCookie);
  }

  return (
    <a href={encodeURI(url.toString())} {...props}>
      {children}
    </a>
  );
}
