import { keyframes } from "@emotion/react";
import { Img } from "../../../components/Img";
import { radius } from "../../../design-system";
import { fadeInAnimation } from "../../../design-system/animations";
import { StyledDiv } from "../../../design-system/elements";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";

export function WalletLogoSpinner(props: { error: boolean; iconUrl: string }) {
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
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div data-img-container>
          <svg
            viewBox="0 0 110 110"
            style={{
              display: props.error ? "none" : "block",
            }}
          >
            <rect
              x="2"
              y="2"
              width="106"
              height="106"
              rx={loaderRadius}
              strokeDasharray={`${dashArrayStart} ${dashArrayEnd}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
              strokeWidth={4}
            />
          </svg>

          <Img src={props.iconUrl} width={"80"} height={"80"} />
        </div>
      </div>
    </LogoContainer>
  );
}

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

const plusAnimation = keyframes`
0% {
  transform: scale(0.95);
}
100% {
  opacity: 0;
  transform: scale(1.4);
}
`;

const LogoContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    borderRadius: radius.xl,

    "[data-img-container]": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },

    "&[data-error='true'] [data-container]": {
      animation: `${shakeErrorAnimation} 0.25s linear`,
    },

    "&[data-error='true'] [data-img-container]::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: theme.colors.danger,
      animation: `${plusAnimation} 1.5s ease infinite`,
      borderRadius: "20px",
      zIndex: -1,
    },

    svg: {
      position: "absolute",
      /* can't use inset because safari doesn't like it */
      left: "-8px",
      top: "-8px",
      width: "calc(100% + 16px)",
      height: "calc(100% + 16px)",
      animation: `${fadeInAnimation} 400ms ease`,
    },

    img: {
      zIndex: 100,
    },

    rect: {
      animation: `${dashRotateAnimation} 1.2s linear infinite`,
      stroke: theme.colors.accentText,
    },
  };
});
