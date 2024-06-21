"use client";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebDomains } from "../../../../../utils/domains.js";
import { isEcosystemWallet } from "../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../../core/design-system/index.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";

/**
 * @internal
 */
export function PrivateKey(props: {
  onBack: () => void;
  wallet?: Wallet;
  theme: "light" | "dark" | Theme;
  client: ThirdwebClient;
}) {
  const [isLoading, setLoading] = useState(true);
  if (!props.wallet) {
    throw new Error("[PrivateKey] No wallet found");
  }

  const baseDomain = getThirdwebDomains().inAppWallet;
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
        <ModalHeader title="Export Private Key" onBack={props.onBack} />
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
        <Container style={{ position: "relative", height: "250px" }}>
          {isLoading ? (
            <Container
              center="both"
              flex="column"
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <Spinner size="lg" color="primaryButtonBg" />
            </Container>
          ) : (
            <></>
          )}

          <Container
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              zIndex: 11,
            }}
          >
            <iframe
              title="Export In-App Wallet"
              style={{
                width: "100%",
                height: "250px",
                visibility: isLoading ? "hidden" : "unset",
              }}
              onLoad={() => {
                setLoading(false);
              }}
              allow="clipboard-read; clipboard-write"
              src={`${
                baseDomain.includes("localhost") ? "http" : "https"
              }://${baseDomain}/sdk/2022-08-12/embedded-wallet/export-private-key?clientId=${
                props.client.clientId
              }&theme=${
                typeof props.theme === "string" ? props.theme : props.theme.type
              }${ecosystem ? `&ecosystemId=${ecosystem.id}` : ""}${
                ecosystem?.partnerId ? `&partnerId=${ecosystem.partnerId}` : ""
              }`}
            />
          </Container>
        </Container>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
