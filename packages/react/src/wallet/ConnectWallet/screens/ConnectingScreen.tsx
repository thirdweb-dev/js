import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader, Line } from "../../../components/basic";
import { fontSize, media, spacing } from "../../../design-system";
import { isMobile } from "../../../evm/utils/isMobile";
import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import styled from "@emotion/styled";
import { ModalDescription } from "../../../components/modalElements";
import { WalletLogoSpinner } from "./WalletLogoSpinner";

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

      <Spacer y="lg" />

      <Container flex="column" center="both" expand p="lg" relative>
        <WalletLogoSpinner
          onRetry={props.onRetry}
          error={props.errorConnecting}
          iconUrl={props.walletIconURL}
        />
        <Spacer y="xxl" />

        <Container
          animate="fadein"
          style={{
            animationDuration: "200ms",
          }}
        >
          <Text center color="primaryText" size="lg" weight={600}>
            {props.errorConnecting ? "Connection Failed" : "Connecting"}
          </Text>

          <Spacer y="lg" />

          {!props.errorConnecting ? (
            <Desc
              style={{
                textAlign: "center",
              }}
            >
              Login and connect your wallet
              <br /> through the {props.walletName}{" "}
              {isMobile() ? "application" : "pop-up"}
            </Desc>
          ) : (
            <Desc
              style={{
                textAlign: "center",
              }}
            >
              click on button above to try again
            </Desc>
          )}
        </Container>
      </Container>

      <Spacer y="lg" />
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

const Desc = /* @__PURE__ */ styled(ModalDescription)`
  font-size: ${fontSize.md};
  ${media.mobile} {
    padding: 0 ${spacing.lg};
  }
`;
