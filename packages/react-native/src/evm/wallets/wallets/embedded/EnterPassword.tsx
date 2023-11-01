import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text } from "../../../components/base";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";
import { PasswordInput } from "../../../components/PasswordInput";
import Checkbox from "../../../components/base/CheckBox";

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
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  const isCreatePassword = type === "create_password";

  useEffect(() => {
    if (error) {
      setCheckingPass(false);
    }
  }, [error]);

  const onNextPress = async () => {
    if (!toggleCheckBox) {
      return;
    }

    setCheckingPass(true);
    onPassword(password);
  };

  const onForgotPress = () => {
    // console.log("[TODO] Implement", setErrorMessage);
  };

  return (
    <Box marginHorizontal="xl" mb="sm">
      <ConnectWalletHeader
        middleContent={
          <Text variant="header">
            {isCreatePassword
              ? l.embedded_wallet.create_password
              : l.embedded_wallet.enter_password}
          </Text>
        }
        subHeaderText={
          isCreatePassword
            ? l.embedded_wallet.set_password_message
            : `${l.embedded_wallet.enter_password_for_email}: ${email}`
        }
        onBackPress={goBack}
        onClose={close}
      />
      <Text variant="bodySmallBold" mt="xs">
        {l.embedded_wallet.make_sure_you_save_it}
      </Text>
      <Box mt="sm" flexDirection="column" marginTop="xl">
        <PasswordInput onChangeText={setPassword} />

        <BaseButton mt="md">
          <Checkbox
            label="I have saved my password"
            color={theme.colors.linkPrimary}
            onToggle={setToggleCheckBox}
          />
        </BaseButton>

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
        <Text variant="error" numberOfLines={1} mt="md">
          {error}
        </Text>
      ) : null}
      {/* {isCreatePassword ? (
          <BaseButton onPress={onLearnMorePress}>
            <Text variant="bodySmallSecondary" color="linkPrimary">
              {l.common.learn_more}
            </Text>
          </BaseButton>
        ) : null} */}
      <BaseButton
        mt="md"
        paddingVertical="md"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
        backgroundColor="accentButtonColor"
        onPress={onNextPress}
      >
        {checkingPass ? (
          <ActivityIndicator
            size={"small"}
            color={theme.colors.accentButtonTextColor}
          />
        ) : (
          <Text variant="bodySmallBold" color="accentButtonTextColor">
            {l.common.next}
          </Text>
        )}
      </BaseButton>
    </Box>
  );
};
