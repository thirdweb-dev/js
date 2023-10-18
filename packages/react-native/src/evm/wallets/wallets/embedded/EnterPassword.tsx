import { useAddress } from "@thirdweb-dev/react-core";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text } from "../../../components/base";
import { shortenWalletAddress } from "../../../utils/addresses";
import { useGlobalTheme } from "../../../providers/ui-context-provider";
import { PasswordInput } from "../../../components/PasswordInput";

export type EnterPasswordProps = {
  goBack: () => void;
  close: () => void;
  email: string;
};

export const EnterPassword = ({ close, goBack, email }: EnterPasswordProps) => {
  const theme = useGlobalTheme();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [checkingPass, setCheckingPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const onNextPress = async () => {};

  const onForgotPress = () => {};

  return (
    <Box marginHorizontal="xl">
      <ConnectWalletHeader
        middleContent={<Text variant="header">Enter password</Text>}
        subHeaderText={`Enter the password for email: ${email}`}
        onBackPress={goBack}
        onClose={close}
      />
      <Box mt="sm" flexDirection="column" marginTop="xl" mb="md">
        <PasswordInput onChangeText={setPassword} />

        <BaseButton
          mt="sm"
          borderWidth={1}
          borderBottomColor="linkPrimary"
          onPress={onForgotPress}
        >
          <Text variant="bodySmallSecondary" color="linkPrimary">
            Forgot password
          </Text>
        </BaseButton>
      </Box>
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
