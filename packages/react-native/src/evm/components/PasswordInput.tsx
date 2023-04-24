import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Box from "./base/Box";
import { useState } from "react";
import EyeClosed from "../assets/eye-closed";
import { useTheme } from "@shopify/restyle";
import EyeOpened from "../assets/eye-opened";

export const PasswordInput = ({
  onChangeText,
}: {
  onChangeText: TextInput["props"]["onChangeText"];
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const onPressEyeIcon = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderColor="border"
      borderWidth={1}
      borderRadius="md"
      pr="xs"
    >
      <TextInput
        style={{ ...styles.textInput, color: theme.colors.textPrimary }}
        secureTextEntry={!showPassword}
        textContentType="none"
        returnKeyType={"done"}
        clearTextOnFocus={false}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onPressEyeIcon}>
        {showPassword ? (
          <EyeClosed size={18} color={theme.colors.iconSecondary} />
        ) : (
          <EyeOpened size={18} color={theme.colors.iconSecondary} />
        )}
      </TouchableOpacity>
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
