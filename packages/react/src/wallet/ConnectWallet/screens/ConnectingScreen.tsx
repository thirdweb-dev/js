import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader, Line } from "../../../components/basic";
import { iconSize, spacing } from "../../../design-system";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { WalletLogoSpinner } from "./WalletLogoSpinner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { isMobile } from "../../../evm/utils/isMobile";

export const ConnectingScreen: React.FC<{
  onBack: () => void;
  walletIconURL: string;
  walletName: string;
  onGetStarted: () => void;
  hideBackButton: boolean;
  errorConnecting: boolean;
  onRetry: () => void;
  locale: {
    getStartedLink: string;
    tryAgain: string;
    instruction: {
      desktop: string;
      mobile: string;
    };
    failed: string;
    inProgress: string;
  };
}> = (props) => {
  const { locale } = props;
  const modalConfig = useContext(ModalConfigCtx);
  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader
          title={props.walletName}
          onBack={props.hideBackButton ? undefined : props.onBack}
        />
      </Container>

      <Container
        flex="column"
        center="y"
        expand
        px={modalConfig.modalSize === "compact" ? "lg" : "xxl"}
        relative
        style={{
          paddingTop: 0,
        }}
      >
        <Container py="3xl">
          <WalletLogoSpinner
            error={props.errorConnecting}
            iconUrl={props.walletIconURL}
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
              {isMobile()
                ? locale.instruction.mobile
                : locale.instruction.desktop}
            </Text>
          ) : (
            <Container flex="row" center="x" animate="fadein">
              <Button
                fullWidth
                variant="accent"
                onClick={props.onRetry}
                style={{
                  gap: spacing.sm,
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

      <Spacer y="xl" />
      <Line />

      <Container flex="row" center="x" p="lg">
        <Button variant="link" onClick={props.onGetStarted}>
          {locale.getStartedLink}
        </Button>
      </Container>
    </Container>
  );
};
