import { StyleSheet, TextInput as TextInputRN } from "react-native";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { ReactNode } from "react";

type TextInputProps = (typeof Box)["arguments"] &
  TextInputRN["props"] & {
    icon: ReactNode;
    position: "left" | "right";
  };

export const TextInput = ({
  onChangeText,
  placeholder,
  position,
  icon,
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
      {position === "left" && icon}
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
      {position === "right" && icon}
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
