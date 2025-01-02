import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { radius, spacing } from "../../design-system/index.js";
import { RNImage } from "./RNImage.js";
import { ThemedText } from "./text.js";

type ThemedButtonProps = TouchableOpacityProps & {
  theme: Theme;
  variant?: "primary" | "secondary" | "accent";
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
              : variant === "accent"
                ? props.theme.colors.accentButtonBg
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

export function ThemedButtonWithIcon(
  props: ThemedButtonProps & {
    title: string;
    icon: string;
  },
) {
  const { theme, title, icon, onPress } = props;
  return (
    <ThemedButton theme={theme} variant="secondary" onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          paddingLeft: spacing.sm,
          alignContent: "center",
          width: "100%",
        }}
      >
        <RNImage
          theme={theme}
          size={24}
          data={icon}
          color={theme.colors.accentButtonBg}
        />
        <ThemedText theme={theme}>{title}</ThemedText>
      </View>
    </ThemedButton>
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
