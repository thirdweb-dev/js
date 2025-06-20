import { keyframes } from "@emotion/react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import { WalletImage } from "../../components/WalletImage.js";
import { fadeInAnimation } from "../../design-system/animations.js";
import { StyledDiv } from "../../design-system/elements.js";

/**
 *
 * @internal
 */
export function WalletLogoSpinner(props: {
  client: ThirdwebClient;
  error: boolean;
  id: WalletId;
  hideSpinner?: boolean;
}) {
  const loaderRadius = 20;
  const radiusFactor = 36 - loaderRadius;
  const dashArrayStart = 116 + radiusFactor;
  const dashArrayEnd = 245 + radiusFactor;
  const dashOffset = -1 * (360 + radiusFactor * 1.75);

  return (
    <LogoContainer data-error={props.error}>
      <div
        data-container
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div data-img-container>
          {!props.hideSpinner && (
            <svg
              role="presentation"
              style={{
                display: props.error ? "none" : "block",
              }}
              viewBox="0 0 110 110"
            >
              <rect
                fill="none"
                height="106"
                rx={loaderRadius}
                strokeDasharray={`${dashArrayStart} ${dashArrayEnd}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeWidth={4}
                width="106"
                x="2"
                y="2"
              />
            </svg>
          )}

          <WalletBg>
            <WalletImage client={props.client} id={props.id} size="68" />
          </WalletBg>
        </div>
      </div>
    </LogoContainer>
  );
}

const WalletBg = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    alignItems: "center",
    background: theme.colors.tertiaryBg,
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: "13px",
    display: "flex",
    justifyContent: "center",
    padding: spacing.xs,
  };
});

const dashRotateAnimation = keyframes`
from {
  stroke-dashoffset: 0px;
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

const pulseAnimation = keyframes`
0% {
  transform: scale(0.95);
}
100% {
  opacity: 0;
  transform: scale(1.3);
}
`;

const LogoContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    "[data-img-container]": {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      position: "relative",
    },

    "&[data-error='true'] [data-container]": {
      animation: `${shakeErrorAnimation} 0.25s linear`,
    },

    "&[data-error='true'] [data-img-container]::before": {
      animation: `${pulseAnimation} 1.5s ease infinite`,
      background: theme.colors.danger,
      borderRadius: "20px",
      content: '""',
      inset: 0,
      position: "absolute",
      zIndex: -1,
    },
    borderRadius: radius.xl,
    display: "flex",

    img: {
      zIndex: 100,
    },
    justifyContent: "center",
    position: "relative",

    rect: {
      animation: `${dashRotateAnimation} 1.2s linear infinite`,
      stroke: theme.colors.accentText,
    },

    svg: {
      animation: `${fadeInAnimation} 400ms ease`,
      height: "calc(100% + 16px)",
      /* can't use inset because safari doesn't like it */
      left: "-8px",
      position: "absolute",
      top: "-8px",
      width: "calc(100% + 16px)",
    },
  };
});
