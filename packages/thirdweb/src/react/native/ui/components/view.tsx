import { View, type ViewProps } from "react-native";
import type { Theme } from "../../../core/design-system/index.js";

export type ThemedViewProps = ViewProps & {
  theme: Theme;
};

export function ThemedView({ style, theme, ...otherProps }: ThemedViewProps) {
  return (
    <View
      style={[{ backgroundColor: theme.colors.modalBg }, style]}
      {...otherProps}
    />
  );
}
