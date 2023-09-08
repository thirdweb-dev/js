import styled from "@emotion/styled";
import { Theme, spacing } from "../design-system";
import { BackButton, ModalTitle } from "./modalElements";

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
`;

export const noScrollBar = `
scrollbar-width: none;
&::-webkit-scrollbar {
  width: 0px;
  display: none;
}
`;

export const FlexScrollContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${noScrollBar}
  position: relative;
`;

export function ModalHeader(props: {
  onBack?: () => void;
  title: React.ReactNode;
}) {
  const { onBack, title } = props;
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
      {typeof title === "string" ? <ModalTitle>{title}</ModalTitle> : title}
    </div>
  );
}

export const Line = styled.div<{ theme?: Theme }>`
  height: 2px;
  background: ${(p) => p.theme.bg.elevated};
`;
