"use client";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebDomains } from "../../../../../utils/domains.js";
import type { Theme } from "../../../../core/design-system/index.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";

/**
 * @internal
 */
export function PrivateKey(props: {
  onBack: () => void;
  theme: "light" | "dark" | Theme;
  client: ThirdwebClient;
}) {
  const [isLoading, setLoading] = useState(true);
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
              src={`https://${
                getThirdwebDomains().inAppWallet
              }/sdk/2022-08-12/embedded-wallet/export-private-key?clientId=${
                props.client.clientId
              }&theme=${
                typeof props.theme === "string" ? props.theme : props.theme.type
              }`}
            />
          </Container>
        </Container>
        <Spacer y="lg" />
      </Container>
    </Container>
  );
}
