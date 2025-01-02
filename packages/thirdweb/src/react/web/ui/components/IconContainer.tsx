import type { ReactNode } from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";

/**
 * @internal
 */
export const IconContainer: React.FC<{
  children: ReactNode | ReactNode[];
  padding?: string;
  style?: React.CSSProperties;
}> = (props) => {
  const theme = useCustomTheme();
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyItems: "center",
        flexShrink: 0,
        alignItems: "center",
        padding: props.padding ?? "6px",
        borderRadius: "100%",
        border: `1px solid ${theme.colors.borderColor}`,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};
