import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import type { Theme } from "../../../core/design-system/index.js";
import { radius, spacing } from "../../design-system/index.js";
import { RIGHT_ARROW } from "../icons/svgs.js";
import { ThemedSpinner } from "./spinner.js";

type ThemedInputProps = {
  theme: Theme;
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
} & TextInputProps;

export function ThemedInput(props: ThemedInputProps) {
  const { theme, leftView, rightView } = props;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? theme.colors.accentButtonBg
            : theme.colors.borderColor,
        },
      ]}
    >
      {leftView && leftView}
      <TextInput
        placeholderTextColor={theme.colors.secondaryText}
        style={[
          styles.input,
          { color: theme.colors.primaryText },
          leftView ? { paddingLeft: 0 } : {},
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {rightView && (
        <>
          <View style={{ flex: 1 }} />
          {rightView}
        </>
      )}
    </View>
  );
}

export function ThemedInputWithSubmit(
  props: ThemedInputProps & {
    onSubmit?: (value: string) => void;
    isSubmitting?: boolean;
  },
) {
  const { theme, onSubmit } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [val, setVal] = useState("");
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? theme.colors.accentButtonBg
            : theme.colors.borderColor,
        },
      ]}
    >
      <TextInput
        placeholderTextColor={theme.colors.secondaryText}
        style={[
          styles.input,
          {
            color: theme.colors.primaryText,
          },
        ]}
        value={val}
        onChangeText={setVal}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {onSubmit && (
        <TouchableOpacity
          onPress={() => onSubmit(val)}
          disabled={props.isSubmitting}
          style={{
            paddingHorizontal: spacing.lg,
          }}
        >
          {props.isSubmitting ? (
            <ThemedSpinner size={24} color={theme.colors.secondaryIconColor} />
          ) : (
            <SvgXml
              width={24}
              height={24}
              xml={RIGHT_ARROW}
              color={theme.colors.secondaryIconColor}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: "solid",
  },
  input: {
    flex: 1,
    flexDirection: "row",
    fontSize: 16,
    height: 56,
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
