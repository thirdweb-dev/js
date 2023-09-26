import { StyleSheet, TextInput as TextInputRN } from "react-native";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";

type TextInputProps = {
  containerProps?: (typeof Box)["arguments"];
  textInputProps?: TextInputRN["props"];
};

export const TextInput = ({
  containerProps,
  textInputProps,
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
      <TextInputRN
        style={{ ...styles.textInput, color: theme.colors.textPrimary }}
        returnKeyType={"done"}
        clearTextOnFocus={false}
        autoCapitalize="none"
        autoCorrect={false}
        {...textInputProps}
      />
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
