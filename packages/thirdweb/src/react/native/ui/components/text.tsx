import { StyleSheet, Text, type TextProps } from "react-native";
import type { Theme } from "../../../core/design-system/index.js";

type ThemedTextProps = TextProps & {
  theme: Theme;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "subtext";
};

export function ThemedText({
  style,
  theme,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: theme.colors.primaryText },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "subtext"
          ? { ...styles.subtext, color: theme.colors.secondaryText }
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    fontSize: 16,
  },
  subtext: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
});
