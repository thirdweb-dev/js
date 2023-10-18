import { useAddress } from "@thirdweb-dev/react-core";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text, TextInput } from "../../../components/base";
import { shortenWalletAddress } from "../../../utils/addresses";
import { useGlobalTheme } from "../../../providers/ui-context-provider";
import { PasswordInput } from "../../../components/PasswordInput";

export type EnterPasswordProps = {
  goBack: () => void;
  close: () => void;
  email: string;
};

export const AccountRecovery = ({
  close,
  goBack,
  email,
}: EnterPasswordProps) => {
  const theme = useGlobalTheme();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [checkingPass, setCheckingPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const onNextPress = async () => {};

  const onForgotPress = () => {};

  return (
    <Box marginHorizontal="xl">
      <ConnectWalletHeader
        middleContent={
          <Text variant="header">Enter account recovery code</Text>
        }
        subHeaderText={
          "You should have a copy of this in the email address associated with your account"
        }
        onBackPress={goBack}
        onClose={close}
      />
      <TextInput
        textInputProps={{
          placeholder: "Enter your email address",
          placeholderTextColor: theme.colors.textSecondary,
          onChangeText: setEmailInput,
          style: {
            fontSize: 14,
            color: theme.colors.textPrimary,
            lineHeight: 16,
            padding: 0,
            flex: 1,
          },
          value: emailInput,
          keyboardType: "email-address",
          returnKeyType: "done",
          autoCapitalize: "none",
          autoCorrect: false,
          autoComplete: "off",
          clearTextOnFocus: false,
        }}
        containerProps={{
          paddingHorizontal: "sm",
          paddingVertical: "sm",
          justifyContent: "flex-start",
        }}
      />
      {errorMessage ? (
        <Text variant="error" numberOfLines={1}>
          {errorMessage}
        </Text>
      ) : (
        <Box height={20} />
      )}
      <BaseButton
        mt="sm"
        alignItems="center"
        height={theme.textVariants.bodySmallSecondary.fontSize}
        onPress={onNextPress}
      >
        {checkingPass ? (
          <ActivityIndicator size={"small"} color={theme.colors.linkPrimary} />
        ) : (
          <Text variant="bodySmallSecondary" color="linkPrimary">
            Next
          </Text>
        )}
      </BaseButton>
    </Box>
  );
};
