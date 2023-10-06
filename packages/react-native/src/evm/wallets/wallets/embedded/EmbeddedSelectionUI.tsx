import React, { useEffect, useState } from "react";
import { EmbeddedWallet } from "./EmbeddedWallet";
import { ActivityIndicator } from "react-native";
import { useAppTheme } from "../../../styles/hooks";
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

/**
 * UI for selecting wallet - this UI is rendered in the wallet selection screen
 */
export const EmailSelectionUI: React.FC<
  SelectUIProps<EmbeddedWallet> & { oauthOptions?: OauthOptions }
> = ({ onSelect, walletConfig, oauthOptions }) => {
  const theme = useAppTheme();
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const createWalletInstance = useCreateWalletInstance();
  const [emailWallet, setEmailWallet] = useState<EmbeddedWallet | null>(null);

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
    if (validateEmail(email)) {
      setErrorMessage("");
      setIsFetching(true);

      emailWallet
        ?.sendEmailOTP(email)
        .then((response) => {
          onSelect({
            ...response,
            email,
            emailWallet,
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
      email,
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
            borderColor="backgroundHighlight"
            backgroundColor="backgroundHighlight"
            justifyContent="center"
            name="Sign in with Google"
            walletIconUrl={GOOGLE_ICON}
            onPress={onGoogleSignInPress}
          />
          <Box
            mb="md"
            mt="md"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Box height={1} flex={1} backgroundColor="border" />
            <Text variant="subHeader" textAlign="center" marginHorizontal="xxs">
              OR
            </Text>
            <Box height={1} flex={1} backgroundColor="border" />
          </Box>
        </Box>
      ) : null}
      <TextInput
        textInputProps={{
          placeholder: "Enter your email address",
          placeholderTextColor: theme.colors.textSecondary,
          onChangeText: setEmail,
          style: {
            fontSize: 14,
            color: theme.colors.textPrimary,
            lineHeight: 16,
            padding: 0,
            flex: 1,
          },
          value: email,
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
          <Text
            variant="bodySmall"
            color="accentButtonTextColor"
            fontWeight="700"
          >
            Continue
          </Text>
        )}
      </BaseButton>
      {errorMessage ? (
        <Text variant="error" mt="xxs">
          {errorMessage}
        </Text>
      ) : null}
    </Box>
  );
};
