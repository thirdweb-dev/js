import { ReloadIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { iconSize, spacing } from "../../../core/design-system/index.js";
import { WalletLogoSpinner } from "../../ui/ConnectWallet/screens/WalletLogoSpinner.js";
import { Container, Line, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Text } from "../../ui/components/text.js";

/**
 * @internal
 */
export const ConnectingScreen: React.FC<{
  onBack?: () => void;
  walletId: WalletId;
  walletName: string;
  onGetStarted?: () => void;
  errorConnecting: boolean;
  onRetry: () => void;
  locale: {
    getStartedLink: string;
    tryAgain: string;
    instruction: string;
    failed: string;
    inProgress: string;
  };
  client: ThirdwebClient;
  size: "compact" | "wide";
}> = (props) => {
  const { locale } = props;

  return (
    <Container animate="fadein" flex="column" fullHeight>
      <Container
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader onBack={props.onBack} title={props.walletName} />
      </Container>

      <Container
        center="y"
        expand
        flex="column"
        px={props.size === "compact" ? "lg" : "xxl"}
        relative
        style={{
          paddingTop: 0,
        }}
      >
        <Container py="3xl">
          <WalletLogoSpinner
            client={props.client}
            error={props.errorConnecting}
            id={props.walletId}
          />
        </Container>

        <Container
          animate="fadein"
          style={{
            animationDuration: "200ms",
          }}
        >
          <Text center color="primaryText" size="lg" weight={600}>
            {props.errorConnecting ? locale.failed : locale.inProgress}
          </Text>

          <Spacer y="md" />

          {!props.errorConnecting ? (
            <Text balance center multiline>
              {locale.instruction}
            </Text>
          ) : (
            <Container animate="fadein" center="x" flex="row">
              <Button
                fullWidth
                onClick={props.onRetry}
                style={{
                  alignItems: "center",
                  gap: spacing.xs,
                }}
                variant="accent"
              >
                <ReloadIcon height={iconSize.sm} width={iconSize.sm} />
                {locale.tryAgain}
              </Button>
            </Container>
          )}
        </Container>
      </Container>

      {props.onGetStarted ? (
        <>
          <Spacer y="xl" />
          <Line />
          <Container center="x" flex="row" p="lg">
            <Button onClick={props.onGetStarted} variant="link">
              {locale.getStartedLink}
            </Button>
          </Container>
        </>
      ) : (
        <Spacer y={props.size === "compact" ? "lg" : "xxl"} />
      )}
    </Container>
  );
};
