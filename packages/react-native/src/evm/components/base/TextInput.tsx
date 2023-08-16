import { StyleSheet, TextInput as TextInputRN } from "react-native";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { ReactNode } from "react";

type TextInputProps = (typeof Box)["arguments"] &
  TextInputRN["props"] & {
    rightElement?: ReactNode;
    leftElement?: ReactNode;
  };

export const TextInput = ({
  onChangeText,
  placeholder,
  rightElement,
  leftElement,
  ...props
}: TextInputProps) => {
  const theme = useTheme();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderColor="border"
      justifyContent="center"
      borderWidth={1}
      borderRadius="md"
      pr="xs"
      {...props}
    >
      {leftElement ? leftElement : null}
      <TextInputRN
        style={{ ...styles.textInput, color: theme.colors.textPrimary }}
        returnKeyType={"done"}
        clearTextOnFocus={false}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        {...props}
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
    paddingLeft: 5,
  },
});
