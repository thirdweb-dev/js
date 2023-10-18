import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text, TextInput } from "../../../components/base";
import { useGlobalTheme } from "../../../providers/ui-context-provider";

export type EnterPasswordProps = {
  goBack: () => void;
  close: () => void;
};

export const AccountRecovery = ({ close, goBack }: EnterPasswordProps) => {
  const theme = useGlobalTheme();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [checkingRecoveryCode, setCheckingRecoveryCode] =
    useState<boolean>(false);
  const [recoveryCode, setRecoveryCode] = useState<string>("");

  const onNextPress = async () => {
    setCheckingRecoveryCode(true);
    // Call enter recovery code
    setErrorMessage("test");
  };

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
          placeholder: "Enter your recovery code",
          placeholderTextColor: theme.colors.textSecondary,
          onChangeText: setRecoveryCode,
          style: {
            fontSize: 14,
            color: theme.colors.textPrimary,
            lineHeight: 16,
            padding: 0,
            flex: 1,
          },
          value: recoveryCode,
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
        {checkingRecoveryCode ? (
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
