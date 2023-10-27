import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text } from "../../../components/base";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";
import { PasswordInput } from "../../../components/PasswordInput";

export type EnterPasswordProps = {
  goBack: () => void;
  close: () => void;
  email: string;
  type: "create_password" | "enter_password";
  onPassword: (password: string) => void;
  error: string;
};

export const EnterPassword = ({
  close,
  goBack,
  email,
  type,
  onPassword,
  error,
}: EnterPasswordProps) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [checkingPass, setCheckingPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const isCreatePassword = type === "create_password";

  const onNextPress = async () => {
    setCheckingPass(true);
    if (isCreatePassword) {
      // Call create password
      onPassword(password);
    } else {
      // Call enter password
      onPassword(password);
    }
  };

  const onForgotPress = () => {
    // console.log("[TODO] Implement", setErrorMessage);
  };

  const onLearnMorePress = () => {};

  return (
    <Box marginHorizontal="xl" mb="lg">
      <ConnectWalletHeader
        middleContent={
          <Text variant="header">
            {isCreatePassword ? "Create password" : "Enter password"}
          </Text>
        }
        subHeaderText={
          isCreatePassword
            ? "Set a password for your account"
            : `Enter the password for email: ${email}`
        }
        onBackPress={goBack}
        onClose={close}
      />
      <Box mt="sm" flexDirection="column" marginTop="xl" mb="md">
        <PasswordInput onChangeText={setPassword} />

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
      {error ? (
        <Text variant="error" numberOfLines={1}>
          {error}
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
