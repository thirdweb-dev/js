/** biome-ignore-all lint/nursery/useUniqueElementIds: "id" is not a html attribute here - TODO: stop using 'id' as a prop on JSX elements */

"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { WalletConnectSession } from "../../../../../wallets/wallet-connect/receiver/types.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Spacer } from "../../components/Spacer.js";
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
        <Container py="lg" style={{ position: "relative" }}>
          <Container py="md">
            <WalletLogoSpinner
              client={props.client}
              error={!!props.error}
              hideSpinner={true}
              id="walletConnect"
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
                  fullWidth
                  onClick={() => {
                    props.disconnect();
                  }}
                  variant="accent"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <>
                <Text balance center multiline size="sm">
                  {props.error}
                </Text>
                <Spacer y="md" />
                <Container animate="fadein" center="x" flex="row">
                  <Button
                    fullWidth
                    onClick={() => props.disconnect()}
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
    </Container>
  );
}
