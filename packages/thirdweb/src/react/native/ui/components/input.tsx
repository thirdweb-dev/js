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
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        placeholderTextColor={theme.colors.secondaryText}
        style={[
          styles.input,
          { color: theme.colors.primaryText },
          leftView ? { paddingLeft: 0 } : {},
        ]}
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
        onBlur={() => setIsFocused(false)}
        onChangeText={setVal}
        onFocus={() => setIsFocused(true)}
        placeholderTextColor={theme.colors.secondaryText}
        style={[
          styles.input,
          {
            color: theme.colors.primaryText,
          },
        ]}
        value={val}
        {...props}
      />
      {onSubmit && (
        <TouchableOpacity
          disabled={props.isSubmitting}
          onPress={() => onSubmit(val)}
          style={{
            paddingHorizontal: spacing.lg,
          }}
        >
          {props.isSubmitting ? (
            <ThemedSpinner color={theme.colors.secondaryIconColor} size={24} />
          ) : (
            <SvgXml
              color={theme.colors.secondaryIconColor}
              height={24}
              width={24}
              xml={RIGHT_ARROW}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
  },
  input: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    fontSize: 16,
    gap: spacing.md,
    height: 56,
    justifyContent: "center",
    paddingLeft: spacing.lg,
    paddingVertical: spacing.md,
  },
});
