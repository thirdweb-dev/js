import styled from "@emotion/styled";
import { Theme, spacing } from "../design-system";

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
  border-top: 1px solid ${(p) => p.theme.bg.elevatedHover};
  padding: ${spacing.lg};
  z-index: 10;
  position: relative;
`;
