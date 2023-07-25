import { spacing } from "../design-system";

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
