import type { Meta } from "@storybook/react-vite";
import {
  darkThemeObj,
  lightThemeObj,
  type Theme,
} from "../react/core/design-system/index.js";
import { StyledDiv } from "../react/web/ui/design-system/elements.js";

const meta: Meta = {
  title: "theme",
};
export default meta;

export function Dark() {
  return <Variant theme={darkThemeObj} />;
}

export function Light() {
  return <Variant theme={lightThemeObj} />;
}

function Variant(props: { theme: Theme }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "700px",
        margin: "0 auto",
        backgroundColor: props.theme.colors.modalBg,
        padding: "14px",
        lineHeight: "1.5",
        borderRadius: "8px",
      }}
    >
      <ColorPairTest theme={props.theme} text="primaryText" />
      <ColorPairTest theme={props.theme} text="secondaryText" />
      <ColorPairTest theme={props.theme} text="accentText" />
      <ColorPairTest theme={props.theme} text="danger" />
      <ColorPairTest theme={props.theme} text="success" />

      <ColorPairTest theme={props.theme} bg="tooltipBg" text="tooltipText" />

      <ColorPairTest
        theme={props.theme}
        bg="accentButtonBg"
        text="accentButtonText"
      />

      <ColorPairTest
        theme={props.theme}
        bg="primaryButtonBg"
        text="primaryButtonText"
      />

      <ColorPairTest
        theme={props.theme}
        bg="selectedTextBg"
        text="selectedTextColor"
      />

      <ColorPairTest theme={props.theme} bg="skeletonBg" text="primaryText" />

      <ColorPairTest theme={props.theme} bg="scrollbarBg" text="primaryText" />

      <ColorPairTest
        theme={props.theme}
        bg="inputAutofillBg"
        text="primaryText"
      />

      <ColorPairTest
        theme={props.theme}
        bg="tertiaryBg"
        hoverBg="secondaryButtonHoverBg"
        text="primaryText"
      />

      <ColorPairTest
        theme={props.theme}
        bg="secondaryButtonBg"
        hoverBg="secondaryButtonHoverBg"
        text="secondaryButtonText"
      />

      <ColorPairTest
        theme={props.theme}
        hoverBg="secondaryIconHoverBg"
        text="secondaryIconColor"
        hoverText="secondaryIconHoverColor"
      />

      <ColorPairTest
        theme={props.theme}
        bg="connectedButtonBg"
        text="primaryText"
        hoverBg="connectedButtonBgHover"
      />

      <div
        style={{
          border: `1px solid ${props.theme.colors.borderColor}`,
          padding: "20px",
          borderRadius: "8px",
          color: props.theme.colors.primaryText,
        }}
      >
        border
      </div>

      <div
        style={{
          border: `1px solid ${props.theme.colors.separatorLine}`,
          padding: "20px",
          borderRadius: "8px",
          color: props.theme.colors.primaryText,
        }}
      >
        separatorLine
      </div>
    </div>
  );
}

function ColorPairTest(props: {
  theme: Theme;
  bg?: keyof Theme["colors"];
  text: keyof Theme["colors"];
  hoverBg?: keyof Theme["colors"];
  hoverText?: keyof Theme["colors"];
}) {
  return (
    <HoverBg
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      bg={props.bg ? props.theme.colors[props.bg] : undefined}
      hoverBg={props.hoverBg ? props.theme.colors[props.hoverBg] : undefined}
      text={props.theme.colors[props.text]}
    >
      {[props.bg, props.hoverBg, props.text].filter(Boolean).join(", ")}
    </HoverBg>
  );
}
const HoverBg = StyledDiv(
  (props: {
    bg?: string;
    hoverBg?: string;
    text: string;
    hoverText?: string;
  }) => {
    return {
      backgroundColor: props.bg ?? "transparent",
      padding: "20px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: 400,
      color: props.text,
      "&:hover": props.hoverBg
        ? {
            backgroundColor: props.hoverBg,
          }
        : undefined,
    };
  },
);
