import React, { useEffect, useState } from "react";
import { EmbeddedWallet } from "./EmbeddedWallet";
import { ActivityIndicator, Keyboard } from "react-native";
import {
  SelectUIProps,
  useCreateWalletInstance,
  useWallets,
} from "@thirdweb-dev/react-core";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";
import BaseButton from "../../../components/base/BaseButton";
import { TextInput } from "../../../components/base/TextInput";
import { GOOGLE_ICON } from "../../../assets/svgs";
import { WalletButton } from "../../../components/base/WalletButton";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";
import { EmbeddedWalletConfig } from "./embedded-wallet";
import { AuthProvider } from "@thirdweb-dev/wallets";

/**
 * UI for selecting wallet - this UI is rendered in the wallet selection screen
 */
export const EmailSelectionUI: React.FC<
  SelectUIProps<EmbeddedWallet> & {
    auth?: EmbeddedWalletConfig["auth"];
  }
> = ({ onSelect, walletConfig, auth }) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [emailInput, setEmailInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const createWalletInstance = useCreateWalletInstance();
  const [emailWallet, setEmailWallet] = useState<EmbeddedWallet | null>(null);
  const supportedWallets = useWallets();

  const isEmailEnabled = auth?.options.includes("email");
  const isGoogleEnabled = auth?.options.includes("google");

  useEffect(() => {
    const emailWalletInstance = createWalletInstance(
      walletConfig,
    ) as EmbeddedWallet;

    setEmailWallet(emailWalletInstance);
  }, [createWalletInstance, walletConfig]);

  const validateEmail = (emailToValidate: string) => {
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return pattern.test(emailToValidate);
  };

  const handleNetworkCall = () => {
    if (validateEmail(emailInput)) {
      setErrorMessage("");
      setIsFetching(true);
      Keyboard.dismiss();

      emailWallet
        ?.sendVerificationEmail(emailInput)
        .then((response) => {
          onSelect({
            ...response,
            email: emailInput,
            emailWallet,
            oauthOptions: undefined, // TODO (ews) clean up types
          });
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage(`Error processing email: ${error.message}`);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
      setErrorMessage("Please enter a valid email address.");
    }
  };

  const onGoogleSignInPress = () => {
    onSelect({
      email: emailInput,
      emailWallet,
      oauthOptions: {
        provider: AuthProvider.GOOGLE,
        redirectUrl: auth?.redirectUrl,
      },
    });
  };

  return (
    <Box paddingHorizontal="xl" mt="lg">
      {isGoogleEnabled ? (
        <Box justifyContent="center">
          <WalletButton
            iconHeight={28}
            iconWidth={28}
            borderRadius="lg"
            borderWidth={1}
            borderColor="buttonBackgroundColor"
            backgroundColor="buttonBackgroundColor"
            nameColor="buttonTextColor"
            justifyContent="center"
            name={l.embedded_wallet.sign_in_google}
            walletIconUrl={GOOGLE_ICON}
            onPress={onGoogleSignInPress}
          />
          {isEmailEnabled && supportedWallets.length === 1 ? (
            <Box
              mb="md"
              mt="md"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box height={1} flex={1} backgroundColor="border" />
              <Text
                variant="subHeader"
                textAlign="center"
                marginHorizontal="xxs"
              >
                {l.common.or}
              </Text>
              <Box height={1} flex={1} backgroundColor="border" />
            </Box>
          ) : (
            <Box mt="md" />
          )}
        </Box>
      ) : null}
      {isEmailEnabled ? (
        <>
          <TextInput
            textInputProps={{
              placeholder: l.embedded_wallet.enter_your_email,
              placeholderTextColor: theme.colors.textSecondary,
              onChangeText: setEmailInput,
              style: {
                fontSize: 14,
                color: theme.colors.textPrimary,
                fontFamily: theme.textVariants.defaults.fontFamily,
                lineHeight: 16,
                padding: 0,
                flex: 1,
              },
              onSubmitEditing: handleNetworkCall,
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
          <BaseButton
            mt="md"
            paddingVertical="md"
            borderRadius="lg"
            borderWidth={1}
            borderColor="border"
            backgroundColor="accentButtonColor"
            onPress={handleNetworkCall}
          >
            {isFetching ? (
              <ActivityIndicator
                size={"small"}
                color={theme.colors.accentButtonTextColor}
              />
            ) : (
              <Text variant="bodySmallBold" color="accentButtonTextColor">
                {l.common.continue}
              </Text>
            )}
          </BaseButton>
        </>
      ) : null}
      {errorMessage ? (
        <Text variant="error" mt="xxs">
          {errorMessage}
        </Text>
      ) : null}
    </Box>
  );
};
