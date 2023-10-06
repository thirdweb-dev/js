import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader, Line } from "../../../components/basic";
import { fontSize, iconSize, spacing } from "../../../design-system";
import { isMobile } from "../../../evm/utils/isMobile";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { WalletLogoSpinner } from "./WalletLogoSpinner";
import { ReloadIcon } from "@radix-ui/react-icons";

export const ConnectingScreen: React.FC<{
  onBack: () => void;
  walletIconURL: string;
  walletName: string;
  onGetStarted: () => void;
  hideBackButton: boolean;
  errorConnecting: boolean;
  onRetry: () => void;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container p="lg">
        <ModalHeader
          title={props.walletName}
          onBack={props.hideBackButton ? undefined : props.onBack}
        />
      </Container>

      <Container flex="column" center="both" expand p="lg" relative>
        <Spacer y="sm" />
        <WalletLogoSpinner
          error={props.errorConnecting}
          iconUrl={props.walletIconURL}
        />
        <Spacer y="xxl" />
        <Spacer y="sm" />

        <Container
          animate="fadein"
          style={{
            animationDuration: "200ms",
          }}
        >
          <Text center color="primaryText" size="lg" weight={600}>
            {props.errorConnecting
              ? "Connection Failed"
              : "Awaiting Confirmation"}
          </Text>

          <Spacer y="md" />

          {!props.errorConnecting ? (
            <Text
              multiline
              style={{
                textAlign: "center",
              }}
            >
              Login and connect your wallet
              <br /> through the {props.walletName}{" "}
              {isMobile() ? "application" : "pop-up"}
            </Text>
          ) : (
            <Container flex="row" center="x" animate="fadein">
              <Button
                variant="outline"
                onClick={props.onRetry}
                style={{
                  gap: spacing.sm,
                  alignItems: "center",
                }}
              >
                <ReloadIcon width={iconSize.sm} height={iconSize.sm} /> Retry{" "}
              </Button>
            </Container>
          )}
        </Container>
      </Container>

      {modalConfig.modalSize === "compact" && <Line />}

      <Container flex="row" center="x" p="lg">
        <Button
          variant="link"
          onClick={props.onGetStarted}
          style={{
            textAlign: "center",
            fontSize: fontSize.sm,
          }}
        >
          Don{`'`}t have {props.walletName}?
        </Button>
      </Container>
    </Container>
  );
};
