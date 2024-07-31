"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { WalletConnectSession } from "../../../../../wallets/wallet-connect/receiver/types.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { WalletLogoSpinner } from "./WalletLogoSpinner.js";

/**
 * @internal
 */
export function WalletConnectDisconnectScreen(props: {
  onBack: () => void;
  client: ThirdwebClient;
  disconnect: () => Promise<void>;
  error: false | string;
  session: WalletConnectSession;
}) {
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
        <Container py="lg" style={{ position: "relative" }}>
          <Container py="md">
            <WalletLogoSpinner
              client={props.client}
              error={!!props.error}
              id={"walletConnect"}
              hideSpinner={true}
            />
          </Container>
          <Container
            animate="fadein"
            style={{
              animationDuration: "200ms",
            }}
          >
            {!props.error ? (
              <>
                <Text balance center multiline size="md">
                  Connected to {props.session.origin ?? "another app."}
                </Text>
                <Spacer y="xl" />
                <Button
                  variant="accent"
                  fullWidth
                  onClick={() => {
                    props.disconnect();
                  }}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <>
                <Text center balance multiline size="sm">
                  {props.error}
                </Text>
                <Spacer y="md" />
                <Container flex="row" center="x" animate="fadein">
                  <Button
                    fullWidth
                    variant="accent"
                    onClick={() => props.disconnect()}
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
    </Container>
  );
}
