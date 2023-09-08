import React, { useEffect, useState } from "react";
import { EmailWallet } from "./EmailWallet";
import { ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { useAppTheme } from "../../../styles/hooks";
import {
  SelectUIProps,
  useCreateWalletInstance,
} from "@thirdweb-dev/react-core";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";

/**
 * UI for selecting wallet - this UI is rendered in the wallet selection screen
 */
export const EmailSelectionUI: React.FC<
  SelectUIProps<EmailWallet> & {
    clientId: string;
  }
> = ({ onSelect, clientId, walletConfig }) => {
  const theme = useAppTheme();
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const createWalletInstance = useCreateWalletInstance();
  const [emailWallet, setEmailWallet] = useState<EmailWallet | null>(null);

  useEffect(() => {
    const emailWalletInstance = createWalletInstance(
      walletConfig,
    ) as EmailWallet;

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
            clientId,
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

  return (
    <Box flex={1}>
      <Box flex={1} alignItems="flex-start">
        <Box
          flexDirection="row"
          alignItems="center"
          borderColor="border"
          justifyContent="center"
          borderWidth={1}
          borderRadius="md"
          pr="xs"
        >
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email} // "jorge@thirdweb.com"
            onChangeText={setEmail}
            returnKeyType="done"
            onSubmitEditing={handleNetworkCall}
            autoCorrect={false}
            autoComplete="off"
            clearTextOnFocus={false}
            style={{ ...styles.textInput, color: theme.colors.textPrimary }}
          />
          {isFetching ? <ActivityIndicator size={"small"} /> : null}
        </Box>
        {errorMessage ? <Text variant="error">{errorMessage}</Text> : null}
      </Box>
      <Text marginVertical="sm" variant="bodySmallSecondary" textAlign="center">
        ---- OR ----
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  textInput: {
    textAlign: "left",
    flex: 1,
    height: 40,
    paddingLeft: 5,
  },
});
