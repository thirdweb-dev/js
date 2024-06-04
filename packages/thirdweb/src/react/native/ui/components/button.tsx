import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import type { Theme } from "../../../core/design-system/index.js";

export type ThemedButtonProps = TouchableOpacityProps & {
  theme: Theme;
  variant?: "primary" | "secondary";
};

export function ThemedButton(props: ThemedButtonProps) {
  const variant = props.variant ?? "primary";
  const bg = props.theme.colors.primaryButtonBg;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.button,
        {
          borderColor: variant === "secondary" ? bg : "transparent",
          borderWidth: variant === "secondary" ? 1 : 0,
          backgroundColor: variant === "secondary" ? "transparent" : bg,
        },
      ]}
      {...props}
    >
      {props.children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
