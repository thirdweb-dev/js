import React, { useState } from "react";
import { ActivityIndicator, TextInput } from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text } from "../../../components/base";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";

export type EnterPasscodeProps = {
  goBack: () => void;
  close: () => void;
  email: string;
  type: "create_password" | "enter_password";
};

export const EnterPasscode = ({
  close,
  goBack,
  email,
  type,
}: EnterPasscodeProps) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [checkingPass, setCheckingPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const isCreatePassword = type === "create_password";

  const onNextPress = async () => {
    setCheckingPass(true);
    if (isCreatePassword) {
      // Call create password
      console.log("[TODO] Implement", password);
    } else {
      // Call enter password
      setErrorMessage("test");
    }
  };

  const onForgotPress = () => {};

  const onLearnMorePress = () => {};

  // const onChangeText = () => {};

  return (
    <Box marginHorizontal="xl">
      <ConnectWalletHeader
        middleContent={<Text variant="header">{"Enter passcode"}</Text>}
        subHeaderText={`Enter the passcode for email: ${email}`}
        onBackPress={goBack}
        onClose={close}
      />
      <Box mt="sm" flexDirection="column" marginTop="xl" mb="md">
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
              color: theme.colors.textPrimary,
              fontFamily: theme.textVariants.defaults.fontFamily,
            }}
            textContentType="none"
            returnKeyType={"done"}
            placeholder="Passcode"
            placeholderTextColor={theme.colors.textSecondary}
            clearTextOnFocus={false}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
          />
        </Box>

        {isCreatePassword ? null : (
          <BaseButton
            mt="sm"
            borderWidth={1}
            borderBottomColor="linkPrimary"
            onPress={onForgotPress}
          >
            <Text variant="bodySmallSecondary" color="linkPrimary">
              {l.embedded_wallet.forgot_password}
            </Text>
          </BaseButton>
        )}
      </Box>
      {errorMessage ? (
        <Text variant="error" numberOfLines={1}>
          {errorMessage}
        </Text>
      ) : (
        <Box height={20} />
      )}
      <Box flex={1} flexDirection="row" justifyContent="flex-end">
        {isCreatePassword ? (
          <BaseButton onPress={onLearnMorePress}>
            <Text variant="bodySmallSecondary" color="linkPrimary">
              {l.common.learn_more}
            </Text>
          </BaseButton>
        ) : null}
        <BaseButton
          mt="sm"
          flexDirection="row"
          alignItems="center"
          height={theme.textVariants.bodySmallSecondary.fontSize}
          onPress={onNextPress}
        >
          {checkingPass ? (
            <ActivityIndicator
              size={"small"}
              color={theme.colors.linkPrimary}
            />
          ) : (
            <Text variant="bodySmallSecondary" color="linkPrimary">
              {l.common.next}
            </Text>
          )}
        </BaseButton>
      </Box>
    </Box>
  );
};
