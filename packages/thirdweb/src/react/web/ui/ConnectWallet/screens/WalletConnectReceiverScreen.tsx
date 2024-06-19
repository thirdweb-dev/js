"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  createWalletConnectClient,
  createWalletConnectSession,
} from "../../../../../wallets/wallet-connect/receiver/index.js";
import type { WalletConnectClient } from "../../../../../wallets/wallet-connect/receiver/types.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { useActiveWallet } from "../../../hooks/wallets/useActiveWallet.js";
import { InputSelectionUI } from "../../../wallets/in-app/InputSelectionUI.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { WalletLogoSpinner } from "./WalletLogoSpinner.js";

/**
 * @internal
 */
export function WalletConnectReceiverScreen(props: {
  onBack: () => void;
  closeModal: () => void;
  client: ThirdwebClient;
}) {
  const [walletConnectClient, setWalletConnectClient] = useState<
    WalletConnectClient | undefined
  >();
  const activeWallet = useActiveWallet();
  const [loading, setLoading] = useState(false);
  const [errorConnecting, setErrorConnecting] = useState<false | string>(false);

  useEffect(() => {
    if (!activeWallet || !!errorConnecting) return;
    createWalletConnectClient({
      wallet: activeWallet,
      client: props.client,
      onConnect: () => {
        props.closeModal();
        setLoading(false);
      },
    })
      .then((wcClient) => {
        setWalletConnectClient(wcClient);
      })
      .catch(() => {
        console.log("Failed to establish WalletConnect connection");
        setErrorConnecting("Failed to establish WalletConnect connection");
      });
  }, [activeWallet, props.client, props.closeModal, errorConnecting]);

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader title="Connect an App" onBack={props.onBack} />
      </Container>
      <Line />
      <Container
        px="lg"
        scrollY
        style={{
          maxHeight: "500px",
        }}
      >
        <Container py="sm" style={{ position: "relative" }}>
          <Container py="md">
            <WalletLogoSpinner
              client={props.client}
              error={false}
              id={"walletConnect"}
              hideSpinner={!loading}
            />
          </Container>
          <Container
            animate="fadein"
            style={{
              animationDuration: "200ms",
            }}
          >
            {!errorConnecting ? (
              <>
                <Text balance center multiline size="sm">
                  Copy your connection URI from the external app.
                </Text>
                <Spacer y="xl" />
                <InputSelectionUI
                  type="text"
                  disabled={
                    loading || !!errorConnecting || !walletConnectClient
                  }
                  onSelect={async (value) => {
                    setLoading(true);
                    if (!walletConnectClient) {
                      setErrorConnecting("No WalletConnect client found");
                    } else {
                      try {
                        createWalletConnectSession({
                          uri: value,
                          walletConnectClient,
                        });
                      } catch (e) {
                        setErrorConnecting(
                          "Error creating WalletConnect session",
                        );
                      }
                    }
                  }}
                  placeholder="WalletConnect URI"
                  name="wcUri"
                  emptyErrorMessage="Please enter a valid URI"
                  submitButtonText="Connect"
                />
              </>
            ) : (
              <>
                <Text center balance multiline size="sm">
                  {errorConnecting}
                </Text>
                <Spacer y="md" />
                <Container flex="row" center="x" animate="fadein">
                  <Button
                    fullWidth
                    variant="accent"
                    onClick={() => setErrorConnecting(false)}
                    style={{
                      gap: spacing.xs,
                      alignItems: "center",
                    }}
                  >
                    <ReloadIcon width={iconSize.sm} height={iconSize.sm} />{" "}
                    Retry
                  </Button>
                </Container>
              </>
            )}
          </Container>
        </Container>
      </Container>
      <Container>
        <Spacer y="lg" />
        <Line />
        <Container flex="row" center="x" p="lg">
          <a href="https://google.com">
            <Button variant="link" onClick={() => {}}>
              Where do I find the URI?
            </Button>
          </a>
        </Container>
      </Container>
    </Container>
  );
}
