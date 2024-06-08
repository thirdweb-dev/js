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

export type ThemedInputProps = {
  theme: Theme;
} & TextInputProps;

export function ThemedInput(props: ThemedInputProps) {
  const { theme } = props;
  return (
    <TextInput
      placeholderTextColor={theme.colors.secondaryText}
      style={[styles.input, { color: theme.colors.primaryText }]}
      {...props}
    />
  );
}

export function ThemedInputWithSubmit(
  props: ThemedInputProps & {
    onSubmit?: (value: string) => void;
    isSubmitting?: boolean;
  },
) {
  const { theme, onSubmit } = props;
  const [val, setVal] = useState("");
  return (
    <View style={[styles.container, { borderColor: theme.colors.borderColor }]}>
      <ThemedInput value={val} onChangeText={setVal} {...props} />
      {onSubmit && (
        <TouchableOpacity
          onPress={() => onSubmit(val)}
          disabled={props.isSubmitting}
          style={{
            paddingHorizontal: spacing.lg,
          }}
        >
          {props.isSubmitting ? (
            <ThemedSpinner size={24} />
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
