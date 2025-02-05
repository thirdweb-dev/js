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
 * Crea un enlace a otro sitio compatible con thirdweb con parámetros de conexión de billetera.
 *
 * El sitio de destino debe soportar la billetera conectada (del ecosistema o in-app).
 *
 * @param {Object} props - Las propiedades a pasar a la etiqueta de ancla
 * @param {String} props.href - La URL del sitio al que enlazar
 * @param {ThirdwebClient} props.client - El cliente de thirdweb del sitio actual
 * @param {Ecosystem} [props.ecosystem] - El ecosistema a usar para la conexión de la billetera en el sitio de destino
 * @param {React.ReactNode} props.children - El contenido que se renderizará dentro del enlace
 *
 * @example
 * ```tsx
 * import { SiteLink } from "thirdweb/react";
 *
 * <SiteLink href="https://thirdweb.com" client={thirdwebClient} ecosystem={{ id: "ecosystem.thirdweb" }}>
 *   Visitar el sitio
 * </SiteLink>
 * ```
 * @walletConnection
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
      activeWallet &&
      (isEcosystemWallet(activeWallet) ||
        walletId === "inApp" ||
        walletId === "smart"),
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
    url.searchParams.set("walletId", walletId === "smart" ? "inApp" : walletId);
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
