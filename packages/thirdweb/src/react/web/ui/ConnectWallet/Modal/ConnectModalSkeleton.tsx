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
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "100%",
      }}
    >
      <LeftContainer> {props.left} </LeftContainer>
      <Container flex="column" relative scrollY>
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
      relative
      scrollY
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
    borderRight: `1px solid ${theme.colors.separatorLine}`,
    position: "relative",
  };
});
