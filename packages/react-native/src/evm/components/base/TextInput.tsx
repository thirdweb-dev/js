import { StyleSheet, TextInput as TextInputRN } from "react-native";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { ReactNode } from "react";

type TextInputProps = {
  containerProps?: (typeof Box)["arguments"];
  textInputProps?: TextInputRN["props"];
} & {
  rightElement?: ReactNode;
  leftElement?: ReactNode;
};

export const TextInput = ({
  containerProps,
  textInputProps,
  rightElement,
  leftElement,
}: TextInputProps) => {
  const theme = useTheme();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderColor="border"
      borderWidth={1}
      borderRadius="md"
      pr="xs"
      {...containerProps}
    >
      {leftElement ? leftElement : null}
      <TextInputRN
        style={{ ...styles.textInput, color: theme.colors.textPrimary }}
        returnKeyType={"done"}
        clearTextOnFocus={false}
        autoCapitalize="none"
        autoCorrect={false}
        {...textInputProps}
      />
      {rightElement ? rightElement : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  textInput: {
    textAlign: "left",
    flex: 1,
    height: 40,
  },
});
