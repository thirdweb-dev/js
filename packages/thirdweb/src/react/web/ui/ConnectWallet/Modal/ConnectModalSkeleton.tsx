"use client";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { Container, noScrollBar } from "../../components/basic.js";
import { StyledDiv } from "../../design-system/elements.js";
import { compactModalMaxHeight } from "../constants.js";

/**
 * @internal
 */
export function ConnectModalWideLayout(props: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "300px 1fr",
      }}
    >
      <LeftContainer> {props.left} </LeftContainer>
      <Container flex="column" scrollY relative>
        {props.right}
      </Container>
    </div>
  );
}

/**
 * @internal
 */
export function ConnectModalCompactLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <Container
      flex="column"
      scrollY
      relative
      style={{
        maxHeight: compactModalMaxHeight,
      }}
    >
      {props.children}
    </Container>
  );
}

const LeftContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    ...noScrollBar,
    position: "relative",
    borderRight: `1px solid ${theme.colors.separatorLine}`,
  };
});
