import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Box from "./base/Box";
import { useState } from "react";
import EyeClosed from "../assets/eye-closed";
import EyeOpened from "../assets/eye-opened";
import { useGlobalTheme } from "../providers/ui-context-provider";

export const PasswordInput = ({
  onChangeText,
}: {
  onChangeText: TextInput["props"]["onChangeText"];
}) => {
  const theme = useGlobalTheme();
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
      pl="xxs"
    >
      <TextInput
        style={{
          ...styles.textInput,
          color: theme.colors.textPrimary,
          fontFamily: theme.textVariants.defaults.fontFamily,
        }}
        secureTextEntry={!showPassword}
        textContentType="none"
        returnKeyType={"done"}
        placeholder="Password"
        placeholderTextColor={theme.colors.textSecondary}
        clearTextOnFocus={false}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onPressEyeIcon}>
        {showPassword ? (
          <EyeClosed
            width={18}
            height={18}
            color={theme.colors.iconSecondary}
          />
        ) : (
          <EyeOpened
            width={18}
            height={18}
            color={theme.colors.iconSecondary}
          />
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
  },
});
