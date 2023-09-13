import styled from "@emotion/styled";
import { Theme, iconSize, spacing } from "../design-system";
import { BackButton, ModalTitle } from "./modalElements";
import { fadeInAnimation } from "./FadeIn";
import { keyframes } from "@emotion/react";
import { Img } from "./Img";

export const Flex = (props: {
  flexDirection?: "row" | "column";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  wrap?: "wrap" | "nowrap";
  gap?: keyof typeof spacing;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: props.flexDirection,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flexWrap: props.wrap,
        gap: props.gap ? spacing[props.gap] : undefined,
        ...(props.style || {}),
      }}
    >
      {" "}
      {props.children}
    </div>
  );
};

export const ScreenContainer = styled.div`
  padding: ${spacing.lg};
`;

export const ScreenBottomContainer = styled.div<{ theme?: Theme }>`
  border-top: 1px solid ${(p) => p.theme.colors.separatorLine};
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
`;

export const noScrollBar = `
scrollbar-width: none;
&::-webkit-scrollbar {
  width: 0px;
  display: none;
}
`;

export function ModalHeader(props: {
  onBack?: () => void;
  title: React.ReactNode;
  imgSrc?: string;
}) {
  const { onBack, title, imgSrc } = props;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {onBack && (
        <BackButton
          onClick={onBack}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
      )}
      <Container flex="row" gap="xs" center="both">
        {imgSrc && (
          <Img src={imgSrc} width={iconSize.md} height={iconSize.md} />
        )}
        {typeof title === "string" ? <ModalTitle>{title}</ModalTitle> : title}
      </Container>
    </div>
  );
}

export const Line = styled.div<{
  theme?: Theme;
}>`
  height: 2px;
  background: ${(p) => p.theme.colors.separatorLine};
`;

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
  relative?: boolean;
  scrollY?: boolean;
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

  return (
    <Box
      data-scrolly={props.scrollY}
      data-animate={props.animate}
      style={{
        ...styles,
        ...props.style,
      }}
    >
      {props.children}
    </Box>
  );
}

const floatUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20%) scale(0.8) ;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatDownAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20%) scale(0.8) ;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Box = styled.div<{ theme?: Theme }>`
  &[data-animate="fadein"] {
    opacity: 0;
    animation: ${fadeInAnimation} 350ms ease forwards;
  }

  &[data-animate="floatup"] {
    opacity: 0;
    animation: ${floatUpAnimation} 350ms ease forwards;
  }

  &[data-animate="floatdown"] {
    opacity: 0;
    animation: ${floatDownAnimation} 350ms ease forwards;
  }

  &[data-scrolly="true"] {
    overflow-y: auto;
    ${noScrollBar}
  }
`;

export const FlexScrollContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${noScrollBar}
  position: relative;
`;
