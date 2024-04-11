import { ReloadIcon } from "@radix-ui/react-icons";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { WalletLogoSpinner } from "../../ui/ConnectWallet/screens/WalletLogoSpinner.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Container, Line, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import { iconSize, spacing } from "../../ui/design-system/index.js";

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
}> = (props) => {
  const { locale } = props;
  const { connectModal } = useConnectUI();
  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader title={props.walletName} onBack={props.onBack} />
      </Container>

      <Container
        flex="column"
        center="y"
        expand
        px={connectModal.size === "compact" ? "lg" : "xxl"}
        relative
        style={{
          paddingTop: 0,
        }}
      >
        <Container py="3xl">
          <WalletLogoSpinner
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
            <Container flex="row" center="x" animate="fadein">
              <Button
                fullWidth
                variant="accent"
                onClick={props.onRetry}
                style={{
                  gap: spacing.xs,
                  alignItems: "center",
                }}
              >
                <ReloadIcon width={iconSize.sm} height={iconSize.sm} />{" "}
                {locale.tryAgain}
              </Button>
            </Container>
          )}
        </Container>
      </Container>

      {props.onGetStarted && (
        <>
          <Spacer y="xl" />
          <Line />
          <Container flex="row" center="x" p="lg">
            <Button variant="link" onClick={props.onGetStarted}>
              {locale.getStartedLink}
            </Button>
          </Container>
        </>
      )}
    </Container>
  );
};
