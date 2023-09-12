import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader, Separator } from "../../../components/basic";
import { ModalDescription } from "../../../components/modalElements";
import {
  Theme,
  fontSize,
  iconSize,
  media,
  radius,
  spacing,
} from "../../../design-system";
import { isMobile } from "../../../evm/utils/isMobile";
import styled from "@emotion/styled";
import { Button, IconButton } from "../../../components/buttons";
import { keyframes } from "@emotion/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Text } from "../../../components/text";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";

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
        <LogoContainer data-error={props.errorConnecting}>
          <div
            data-container
            style={{
              position: "relative",
            }}
          >
            <div data-gradient data-error={props.errorConnecting}>
              <div data-blocker>
                <Img src={props.walletIconURL} width={"80"} height={"80"} />
              </div>
            </div>

            {props.errorConnecting && (
              <RetryButton
                variant="secondary"
                onClick={props.onRetry}
                aria-label="retry"
              >
                <ReloadIcon width={iconSize.md} height={iconSize.md} />
              </RetryButton>
            )}
          </div>
        </LogoContainer>

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
      {modalConfig.modalSize === "compact" && <Separator />}

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

const retryFadeIn = keyframes`
  from {
    transform: translate(50%, 50%) scale(0.5) rotate(-180deg);
    opacity: 0;
  }
`;

const RetryButton = /* @__PURE__ */ styled(IconButton)<{ theme?: Theme }>`
  animation: ${retryFadeIn} 0.3s ease;
  position: absolute;
  background: ${(p) => p.theme.colors.base3};
  color: ${(p) => p.theme.colors.primaryText};
  bottom: 5px;
  right: 5px;
  transform: translate(50%, 50%);
  z-index: 100;
  padding: ${spacing.xs};
  border-radius: 50%;
  transition: all 200ms ease;

  &:hover {
    background: ${(p) => p.theme.colors.danger};
    color: ${(p) => p.theme.colors.primaryText};
    transform: translate(50%, 50%) scale(1.2) rotate(35deg);
  }
`;

const Desc = /* @__PURE__ */ styled(ModalDescription)`
  font-size: ${fontSize.md};
  ${media.mobile} {
    padding: 0 ${spacing.lg};
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: scale(1.5) rotate(0deg);
  }
  100% {
    transform: scale(1.5) rotate(360deg);
  }
`;

const shakeErrorAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
`;

const scaleFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(80px) scale(0.2) ;
  }
`;

const pulseAnimation = keyframes`
  from {
    transform: translateY(5px);
  }
  to {
    transform: translateY(-5px);
  }
`;

const LogoContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  justify-content: center;
  animation: ${scaleFadeIn} 400ms cubic-bezier(0.15, 1.15, 0.6, 1);
  position: relative;
  border-radius: ${radius.xl};

  &[data-error="true"] [data-container] {
    animation: ${shakeErrorAnimation} 0.25s linear;
  }

  [data-gradient] {
    padding: 2px; /* width of ring */
    position: relative;
    overflow: hidden;
    border-radius: ${radius.xl};
  }

  [data-gradient]:not([data-error="true"]) {
    animation: ${pulseAnimation} 1.2s ease infinite alternate;
  }

  [data-gradient]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    background: linear-gradient(
      to right,
      transparent 60%,
      ${(p) => p.theme.colors.accentText}
    );

    animation: ${rotateAnimation} 1.2s linear infinite;
  }

  [data-gradient][data-error="true"]::before {
    animation: none;
    background: ${(p) => p.theme.colors.danger};
    box-shadow: 0 0 10px ${(p) => p.theme.colors.danger};
  }

  [data-blocker] {
    padding: ${spacing.xs};
    background: ${(p) => p.theme.colors.base1};
    position: relative;
    z-index: 1;
    border-radius: ${radius.xl};
  }
`;
