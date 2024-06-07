import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { radius, spacing } from "../../design-system/index.js";
import { ThemedSpinner } from "./spinner.js";

export type ThemedInputProps = {
  theme: Theme;
  onSubmit?: (value: string) => void;
  isSubmitting?: boolean;
} & TextInputProps;

export function ThemedInputWithSubmit(props: ThemedInputProps) {
  const { theme, onSubmit } = props;
  const [val, setVal] = useState("");
  return (
    <View style={[styles.container, { borderColor: theme.colors.borderColor }]}>
      <TextInput
        placeholderTextColor={theme.colors.secondaryText}
        style={[styles.input, { color: theme.colors.primaryText }]}
        value={val}
        onChangeText={setVal}
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
            <ThemedSpinner size={32} />
          ) : (
            <Ionicons
              name="arrow-forward"
              size={32}
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
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
