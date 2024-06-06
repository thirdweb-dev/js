import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { radius, spacing } from "../../design-system/index.js";

export type ThemedButtonProps = TouchableOpacityProps & {
  theme: Theme;
  variant?: "primary" | "secondary";
};

export function ThemedButton(props: ThemedButtonProps) {
  const variant = props.variant ?? "primary";
  const { style: styleOverride, theme, ...restProps } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.button,
        {
          borderColor:
            variant === "secondary" ? theme.colors.borderColor : "transparent",
          borderWidth: variant === "secondary" ? 1 : 0,
          backgroundColor:
            variant === "secondary"
              ? "transparent"
              : props.theme.colors.primaryButtonBg,
        },
        styleOverride,
      ]}
      {...restProps}
    >
      {props.children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
});
