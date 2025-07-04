/** biome-ignore-all lint/nursery/useUniqueElementIds: "id" is not a html attribute here - TODO: stop using 'id' as a prop on JSX elements */

"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  createWalletConnectClient,
  createWalletConnectSession,
  disconnectWalletConnectSession,
  getActiveWalletConnectSessions,
} from "../../../../../wallets/wallet-connect/receiver/index.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { InputSelectionUI } from "../../../wallets/in-app/InputSelectionUI.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { WalletConnectDisconnectScreen } from "./WalletConnectDisconnectScreen.js";
import { WalletLogoSpinner } from "./WalletLogoSpinner.js";

/**
 * @internal
 */
export function WalletConnectReceiverScreen(props: {
  onBack: () => void;
  client: ThirdwebClient;
  chains?: Chain[];
}) {
  const activeWallet = useActiveWallet();
  const [loading, setLoading] = useState(false);
  const [errorConnecting, setErrorConnecting] = useState<false | string>(false);
  const queryClient = useQueryClient();

  const { data: walletConnectClient } = useQuery({
    enabled: !!activeWallet,
    queryFn: async () => {
      if (!activeWallet) return;
      try {
        const client = await createWalletConnectClient({
          chains: props.chains,
          client: props.client,
          onConnect: () => {
            setLoading(false);
            queryClient.invalidateQueries({
              queryKey: ["walletConnectSession"],
            });
          },
          onDisconnect: () => {
            setLoading(false);
            queryClient.invalidateQueries({
              queryKey: ["walletConnectSession"],
            });
          },
          onError: (error) => {
            setErrorConnecting(error.message);
            setLoading(false);
          },
          wallet: activeWallet,
        });
        return client;
      } catch {
        setErrorConnecting("Failed to establish WalletConnect connection");
        return;
      }
    },
    queryKey: ["walletConnectClient"],
    retry: false,
  });

  const { data: session, refetch: refetchSession } = useQuery({
    enabled: !!walletConnectClient,
    queryFn: async () => {
      if (!walletConnectClient) return null;
      const sessions = await getActiveWalletConnectSessions();
      return sessions[0] || null;
    },
    queryKey: ["walletConnectSession"],
  });

  const { mutateAsync: disconnect } = useMutation({
    mutationFn: async () => {
      if (!walletConnectClient || !session) throw new Error("No session");
      await disconnectWalletConnectSession({
        session: session,
        walletConnectClient: walletConnectClient,
      });
    },
    onError: (error) => {
      console.error(error);
      setErrorConnecting(error.message);
    },
    onSuccess: () => {
      setErrorConnecting(false);
      queryClient.invalidateQueries({
        queryKey: ["walletConnectSession"],
      });
      refetchSession();
    },
  });

  if (session) {
    return (
      <WalletConnectDisconnectScreen
        disconnect={disconnect}
        error={errorConnecting}
        {...props}
        session={session}
      />
    );
  }

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title="Connect an App" />
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
              error={!!errorConnecting}
              hideSpinner={!loading}
              id="walletConnect"
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
                  disabled={
                    loading || !!errorConnecting || !walletConnectClient
                  }
                  emptyErrorMessage="Please enter a valid URI"
                  name="wcUri"
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
                      } catch {
                        setErrorConnecting(
                          "Error creating WalletConnect session",
                        );
                      }
                    }
                  }}
                  placeholder="WalletConnect URI"
                  submitButtonText="Connect"
                  type="text"
                />
              </>
            ) : (
              <>
                <Text balance center multiline size="sm">
                  {errorConnecting}
                </Text>
                <Spacer y="md" />
                <Container animate="fadein" center="x" flex="row">
                  <Button
                    fullWidth
                    onClick={() => setErrorConnecting(false)}
                    style={{
                      alignItems: "center",
                      gap: spacing.xs,
                    }}
                    variant="accent"
                  >
                    <ReloadIcon height={iconSize.sm} width={iconSize.sm} />
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
        <Container center="x" flex="row" p="lg">
          <a href="https://blog.thirdweb.com/p/a62c0ef4-1d8f-424d-95b9-a006e5239849/">
            <Button onClick={() => {}} variant="link">
              Where do I find the URI?
            </Button>
          </a>
        </Container>
      </Container>
    </Container>
  );
}
