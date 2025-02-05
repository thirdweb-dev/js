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
 * Incrusta otro sitio compatible con thirdweb para una conexión fluida de billeteras in-app y del ecosistema.
 *
 * Asegúrate de que el sitio incrustado incluya <AutoConnect /> y soporte los ancestros de marcos, consulta [aquí](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) para más información.
 *
 * El sitio incrustado debe soportar la billetera conectada (del ecosistema o in-app).
 *
 * @param {Object} props - Las propiedades a pasar al iframe
 * @param {String} props.src - La URL del sitio a incrustar
 * @param {ThirdwebClient} props.client - El cliente de thirdweb del sitio actual
 * @param {Ecosystem} [props.ecosystem] - El ecosistema a usar para la conexión de la billetera en el sitio incrustado
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

  const {
    data: { authProvider, authCookie } = {},
  } = useQuery({
    queryKey: ["site-embed", walletId, src, client.clientId, ecosystem],
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
      src={encodeURI(url.toString())}
      width="100%"
      height="100%"
      allowFullScreen
      {...props}
    />
  );
}
