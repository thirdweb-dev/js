"use client";
import type { CSSObject } from "@emotion/react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { spacing, type Theme } from "../../../core/design-system/index.js";
import {
  fadeInAnimation,
  floatDownAnimation,
  floatUpAnimation,
} from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";
import { BackButton, ModalTitle } from "./modalElements.js";

export const ScreenBottomContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    borderTop: `1px solid ${theme.colors.separatorLine}`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.lg,
    padding: spacing.lg,
  };
});

export const noScrollBar = /* @__PURE__ */ {
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
  },
  scrollbarWidth: "none",
} satisfies CSSObject;

/**
 * @internal
 */
export function ModalHeader(props: {
  onBack?: () => void;
  title: React.ReactNode;
  leftAligned?: boolean;
}) {
  const { onBack, title } = props;
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: props.leftAligned ? "flex-start" : "center",
        position: "relative",
      }}
    >
      {onBack && (
        <BackButton
          onClick={onBack}
          style={{
            left: 0,
            position: "absolute",
            top: 0,
          }}
        />
      )}
      <Container center="both" flex="row" gap="xs">
        {typeof title === "string" ? <ModalTitle>{title}</ModalTitle> : title}
      </Container>
    </div>
  );
}

export const Line = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.separatorLine,
    height: "1px",
  };
});

/**
 * @internal
 */
export function Container(props: {
  animate?: "fadein" | "floatup" | "floatdown";
  fullHeight?: boolean;
  flex?: "row" | "column";
  expand?: boolean;
  center?: "x" | "y" | "both";
  gap?: keyof typeof spacing;
  children: React.ReactNode;
  style?: React.CSSProperties;
  p?: keyof typeof spacing;
  px?: keyof typeof spacing;
  py?: keyof typeof spacing;
  relative?: boolean;
  scrollY?: boolean;
  color?: keyof Theme["colors"];
  debug?: boolean;
  bg?: keyof Theme["colors"];
  borderColor?: keyof Theme["colors"];
}) {
  const styles: React.CSSProperties = {};

  if (props.relative) {
    styles.position = "relative";
  }

  if (props.fullHeight) {
    styles.height = "100%";
  }

  if (props.expand) {
    styles.flex = "1 1 0%";
  }

  if (props.flex) {
    styles.display = "flex";
    styles.flexDirection = props.flex;

    if (props.flex === "row") {
      styles.flexWrap = "wrap";
    }

    if (props.gap) {
      styles.gap = spacing[props.gap];
    }

    if (props.center) {
      if (props.center === "both") {
        styles.justifyContent = "center";
        styles.alignItems = "center";
      }

      if (
        (props.center === "x" && props.flex === "row") ||
        (props.center === "y" && props.flex === "column")
      ) {
        styles.justifyContent = "center";
      }

      if (
        (props.center === "x" && props.flex === "column") ||
        (props.center === "y" && props.flex === "row")
      ) {
        styles.alignItems = "center";
      }
    }
  }

  if (props.p) {
    styles.padding = spacing[props.p];
  }

  if (props.px) {
    styles.paddingLeft = spacing[props.px];
    styles.paddingRight = spacing[props.px];
  }

  if (props.py) {
    styles.paddingTop = spacing[props.py];
    styles.paddingBottom = spacing[props.py];
  }

  if (props.debug) {
    styles.outline = "1px solid red";
    styles.outlineOffset = "-1px";
  }

  return (
    <Box
      bg={props.bg}
      borderColor={props.borderColor}
      color={props.color}
      data-animate={props.animate}
      data-scrolly={props.scrollY}
      style={{
        ...styles,
        ...props.style,
      }}
    >
      {props.children}
    </Box>
  );
}

type BoxProps = {
  color?: keyof Theme["colors"] | undefined;
  bg?: keyof Theme["colors"] | undefined;
  borderColor?: keyof Theme["colors"] | undefined;
};

const Box = /* @__PURE__ */ StyledDiv<BoxProps>((props) => {
  const theme = useCustomTheme();
  return {
    "&[data-animate='fadein']": {
      animation: `${fadeInAnimation} 350ms ease forwards`,
      opacity: 0,
    },
    "&[data-animate='floatdown']": {
      animation: `${floatDownAnimation} 350ms ease forwards`,
      opacity: 0,
    },
    "&[data-animate='floatup']": {
      animation: `${floatUpAnimation} 350ms ease forwards`,
      opacity: 0,
    },
    "&[data-scrolly='true']": {
      overflowY: "auto",
      ...noScrollBar,
    },
    background: props.bg ? theme.colors[props.bg] : undefined,
    borderColor: props.borderColor
      ? theme.colors[props.borderColor]
      : undefined,
    color: props.color ? theme.colors[props.color] : "inherit",
  };
});
