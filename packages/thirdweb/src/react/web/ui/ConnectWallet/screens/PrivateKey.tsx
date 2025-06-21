"use client";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { ClientScopedStorage } from "../../../../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../../core/design-system/index.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import type { ConnectLocale } from "../locale/types.js";

/**
 * @internal
 */
export function PrivateKey(props: {
  onBack: () => void;
  wallet?: Wallet;
  theme: "light" | "dark" | Theme;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
}) {
  const [isLoading, setLoading] = useState(true);
  const baseDomain = getThirdwebBaseUrl("inAppWallet");

  useEffect(() => {
    const loginReady = async (e: MessageEvent<{ eventType: string }>) => {
      if (
        typeof e.data === "object" &&
        "eventType" in e.data &&
        e.origin === baseDomain
      ) {
        if (e.data.eventType === "exportPrivateKeyIframeLoaded") {
          const iframe = document.getElementById(
            `export-wallet-${props.wallet?.id}`,
          );

          if (!(iframe instanceof HTMLIFrameElement)) {
            return;
          }
          if (!props.wallet) {
            return;
          }

          const clientStorage = new ClientScopedStorage({
            clientId: props.client.clientId,
            ecosystem: isEcosystemWallet(props.wallet)
              ? {
                  id: props.wallet.id,
                  partnerId: props.wallet.getConfig()?.partnerId,
                }
              : undefined,
            storage: webLocalStorage,
          });
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                authToken: await clientStorage.getAuthCookie(),
                eventType: "initExportPrivateKey",
              },
              e.origin,
            );
          }
        }
      }
    };
    window.addEventListener("message", loginReady);

    return () => {
      window.removeEventListener("message", loginReady);
    };
  }, [props.wallet, props.client.clientId, baseDomain]);

  if (!props.wallet) {
    throw new Error("[PrivateKey] No wallet found");
  }

  const ecosystem = isEcosystemWallet(props.wallet)
    ? { id: props.wallet.id, partnerId: props.wallet.getConfig()?.partnerId }
    : undefined;

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.connectLocale.manageWallet.exportPrivateKey}
        />
      </Container>
      <Line />
      <Container
        px="sm"
        scrollY
        style={{
          maxHeight: "500px",
        }}
      >
        <Spacer y="md" />
        <Container style={{ height: "250px", position: "relative" }}>
          {isLoading ? (
            <Container
              center="both"
              flex="column"
              style={{ height: "100%", position: "absolute", width: "100%" }}
            >
              <Spinner color="primaryButtonBg" size="lg" />
            </Container>
          ) : null}

          <Container
            style={{
              height: "100%",
              position: "absolute",
              width: "100%",
              zIndex: 11,
            }}
          >
            <iframe
              allow="clipboard-read; clipboard-write"
              id={`export-wallet-${props.wallet.id}`}
              onLoad={() => {
                setLoading(false);
              }}
              src={`${baseDomain}/sdk/2022-08-12/embedded-wallet/export-private-key?clientId=${
                props.client.clientId
              }&theme=${
                typeof props.theme === "string" ? props.theme : props.theme.type
              }${ecosystem ? `&ecosystemId=${ecosystem.id}` : ""}${
                ecosystem?.partnerId ? `&partnerId=${ecosystem.partnerId}` : ""
              }`}
              style={{
                height: "250px",
                visibility: isLoading ? "hidden" : "unset",
                width: "100%",
              }}
              title="Export In-App Wallet"
            />
          </Container>
        </Container>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
