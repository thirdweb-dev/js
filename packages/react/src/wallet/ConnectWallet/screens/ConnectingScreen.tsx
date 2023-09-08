import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Flex, ModalHeader, ScreenContainer } from "../../../components/basic";
import {
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
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
    <ScreenContainer
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ModalHeader
        title={props.walletName}
        onBack={props.hideBackButton ? undefined : props.onBack}
      />

      {modalConfig.modalSize === "compact" && <Spacer y="xxl" />}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <div>
          <SpinningGradientContainer data-error={props.errorConnecting}>
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
          </SpinningGradientContainer>
          <Spacer y="xxl" />
          <ModalTitle
            style={{
              textAlign: "center",
            }}
          >
            {props.errorConnecting
              ? "Request Cancelled"
              : "Connecting your wallet"}
          </ModalTitle>
          <Spacer y="md" />
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
              {" "}
              You cancelled the request <br /> click on button above to try
              again
            </Desc>
          )}
          <Spacer y="xl" />
          <Flex justifyContent="center">
            <Button
              variant="link"
              onClick={props.onGetStarted}
              // target="_blank"
              // href={props.supportLink}
              style={{
                textAlign: "center",
              }}
            >
              Don{`'`}t have {props.walletName}?
            </Button>
          </Flex>
        </div>
      </div>
    </ScreenContainer>
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
  background: ${(p) => p.theme.bg.danger};
  color: ${(p) => p.theme.text.neutral};
  bottom: 5px;
  right: 5px;
  transform: translate(50%, 50%);
  z-index: 100;
  padding: ${spacing.xs};
  border-radius: 50%;
  transition: transform 200ms ease;

  &:hover {
    background: ${(p) => p.theme.bg.danger};
    color: ${(p) => p.theme.text.neutral};
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

const SpinningGradientContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  justify-content: center;

  &[data-error="true"] [data-container] {
    animation: ${shakeErrorAnimation} 0.25s linear;
  }

  [data-gradient] {
    padding: 3px; /* width of ring */
    position: relative;
    overflow: hidden;
    border-radius: ${radius.xl};
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
      ${(p) => p.theme.bg.accent}
    );

    animation: ${rotateAnimation} 1.2s linear infinite;
  }

  [data-gradient][data-error="true"]::before {
    animation: none;
    background: ${(p) => p.theme.bg.danger};
  }

  [data-blocker] {
    padding: ${spacing.xs};
    background: ${(p) => p.theme.bg.base};
    position: relative;
    z-index: 1;
    border-radius: ${radius.xl};
  }
`;
