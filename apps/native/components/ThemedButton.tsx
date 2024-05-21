import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  ActivityIndicator,
  type PressableProps,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = {
  lightColor?: string;
  darkColor?: string;
  onPress?: PressableProps["onPress"];
  title: string;
  loading?: boolean;
  loadingTitle?: string;
};

export function ThemedButton(props: ThemedButtonProps) {
  const bg = useThemeColor(
    { light: props.lightColor, dark: props.darkColor },
    "tint",
  );
  const text = useThemeColor(
    { light: props.lightColor, dark: props.darkColor },
    "textInverted",
  );
  return (
    <TouchableOpacity
      disabled={props.loading}
      activeOpacity={0.5}
      style={[styles.button, { backgroundColor: bg }]}
      onPress={(e) => {
        props.onPress?.(e);
      }}
    >
      {props.loading && (
        <ActivityIndicator animating={props.loading} color={text} />
      )}
      <ThemedText type="defaultSemiBold" style={{ color: text }}>
        {props.loading ? props.loadingTitle : props.title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    padding: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
