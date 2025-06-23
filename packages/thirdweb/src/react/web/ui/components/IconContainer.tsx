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
        alignItems: "center",
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: "100%",
        display: "flex",
        flexShrink: 0,
        justifyItems: "center",
        overflow: "hidden",
        padding: props.padding ?? "6px",
        position: "relative",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};
