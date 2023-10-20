import React, { useEffect, useState } from "react";
import { EmbeddedWallet } from "./EmbeddedWallet";
import { ActivityIndicator } from "react-native";
import {
  SelectUIProps,
  useCreateWalletInstance,
} from "@thirdweb-dev/react-core";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";
import BaseButton from "../../../components/base/BaseButton";
import { TextInput } from "../../../components/base/TextInput";
import { GOOGLE_ICON } from "../../../assets/svgs";
import { WalletButton } from "../../../components/base/WalletButton";
import { AuthProvider } from "@paperxyz/embedded-wallet-service-sdk";
import { OauthOptions } from "../../connectors/embedded-wallet/types";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";

/**
 * UI for selecting wallet - this UI is rendered in the wallet selection screen
 */
export const EmailSelectionUI: React.FC<
  SelectUIProps<EmbeddedWallet> & {
    oauthOptions?: OauthOptions;
    email?: boolean;
    custom_auth?: boolean;
  }
> = ({ onSelect, walletConfig, oauthOptions, email, custom_auth }) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [emailInput, setEmailInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const createWalletInstance = useCreateWalletInstance();
  const [emailWallet, setEmailWallet] = useState<EmbeddedWallet | null>(null);

  const isEmailEnabled = email === false ? false : true;

  useEffect(() => {
    const emailWalletInstance = createWalletInstance(
      walletConfig,
    ) as EmbeddedWallet;

    setEmailWallet(emailWalletInstance);
  }, [createWalletInstance, walletConfig]);

  if (custom_auth) {
    // No UI for custom auth
    return null;
  }

  const validateEmail = (emailToValidate: string) => {
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return pattern.test(emailToValidate);
  };

  const handleNetworkCall = () => {
    if (validateEmail(emailInput)) {
      setErrorMessage("");
      setIsFetching(true);

      emailWallet
        ?.sendEmailOTP(emailInput)
        .then((response) => {
          onSelect({
            ...response,
            email: emailInput,
            emailWallet,
            oauthOptions: undefined,
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
        provider: oauthOptions?.providers[0],
        redirectUrl: oauthOptions?.redirectUrl,
      },
    });
  };

  return (
    <Box paddingHorizontal="xl" mt="lg">
      {oauthOptions?.providers.includes(AuthProvider.GOOGLE) ? (
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
          {isEmailEnabled ? (
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
                OR
              </Text>
              <Box height={1} flex={1} backgroundColor="border" />
            </Box>
          ) : null}
        </Box>
      ) : null}
      {isEmailEnabled ? (
        <>
          <TextInput
            textInputProps={{
              placeholder: "Enter your email address",
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
