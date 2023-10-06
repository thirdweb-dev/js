import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Img } from "../../../components/Img";
import { radius, Theme } from "../../../design-system";

export function WalletLogoSpinner(props: { error: boolean; iconUrl: string }) {
  return (
    <LogoContainer data-error={props.error}>
      <div
        data-container
        style={{
          position: "relative",
        }}
      >
        <div data-gradient data-error={props.error}>
          <div data-blocker>
            <Img src={props.iconUrl} width={"80"} height={"80"} />
          </div>
        </div>
      </div>
    </LogoContainer>
  );
}

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

const floatingAnimation = keyframes`
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
    padding: 3px; /* width of ring */
    position: relative;
    overflow: hidden;
    border-radius: 18px;
  }

  [data-gradient]:not([data-error="true"]) {
    animation: ${floatingAnimation} 1.2s ease infinite alternate;
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
    padding: 4px;
    background: ${(p) => p.theme.colors.modalBg};
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 14px;
  }
`;
