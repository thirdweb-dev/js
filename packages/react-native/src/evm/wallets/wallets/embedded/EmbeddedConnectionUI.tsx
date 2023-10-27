import {
  ConnectUIProps,
  useAddress,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "./EmbeddedWallet";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";
import BaseButton from "../../../components/base/BaseButton";
import * as Clipboard from "expo-clipboard";
import { StyleSheet } from "react-native";
import { EmbeddedSocialConnection } from "./EmbeddedSocialConnection";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";
import { EnterPassword } from "./EnterPassword";

const OTP_LENGTH = 6;
type ScreenToShow =
  | "base"
  | "create-password"
  | "enter-password-or-recovery-code";

export const EmbeddedConnectionUI: React.FC<ConnectUIProps<EmbeddedWallet>> = ({
  connected,
  goBack,
  selectionData,
  onLocallyConnected,
  ...props
}) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [values, setValues] = useState<string[]>(
    new Array(OTP_LENGTH).fill(""),
  );
  const [checkingOtp, setCheckingOtp] = useState(false);
  const [requestingNewOtp, setRequestingNewOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const setConnectedWallet = useSetConnectedWallet();
  const setConnectionStatus = useSetConnectionStatus();
  const [oneTimePasscode, setOneTimePasscode] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>();
  const [screen, setScreen] = useState<ScreenToShow>("base"); // TODO change

  const address = useAddress();

  console.log("oneTimePasscode", oneTimePasscode);

  const onError = useCallback((error: any) => {
    clearCode();
    console.error("Error validating otp: ", error);
    setErrorMessage("Error validating the code");
    setCheckingOtp(false);
    setFocusedIndex(undefined);
  }, []);

  const postConnect = useCallback(
    async (response: any) => {
      if (response) {
        if (onLocallyConnected) {
          onLocallyConnected(selectionData.emailWallet);
        } else {
          await setConnectedWallet(selectionData.emailWallet);
          setConnectionStatus("connected");
        }
      } else {
        clearCode();
        setErrorMessage(response || "Error validating the code");
        setCheckingOtp(false);
        setFocusedIndex(undefined);
      }
    },
    [
      onLocallyConnected,
      selectionData.emailWallet,
      setConnectedWallet,
      setConnectionStatus,
    ],
  );

  const connect = useCallback(
    async (password?: string) => {
      try {
        const emailWallet = selectionData.emailWallet as EmbeddedWallet;
        const otp = values.join("");

        const authResult = await emailWallet.authenticate({
          strategy: "email_otp",
          otp,
          email: selectionData.email,
          recoveryCode: password,
        });
        if (!authResult) {
          onError(new Error("Failed to verify OTP"));
        }
        const response = await emailWallet.connect({
          authResult,
        });
        postConnect(response);
      } catch (error) {
        onError(error);
      }
    },
    [
      onError,
      postConnect,
      selectionData.email,
      selectionData.emailWallet,
      values,
    ],
  );

  useEffect(() => {
    if (address) {
      setCheckingOtp(false);
      connected();
    }
  }, [address, connected]);

  useEffect(() => {
    if (
      values.length === OTP_LENGTH &&
      values.every((v) => v.length === 1) &&
      selectionData &&
      screen === "base"
    ) {
      setCheckingOtp(true);
      setErrorMessage("");
      setFocusedIndex(undefined);
      const otp = values.join("");

      setTimeout(async () => {
        const emailWallet = selectionData.emailWallet as EmbeddedWallet;

        const needsRecoveryCode =
          selectionData.recoveryShareManagement === "USER_MANAGED" &&
          (selectionData.isNewUser || selectionData.isNewDevice);

        if (needsRecoveryCode) {
          if (selectionData.isNewUser) {
            try {
              await emailWallet.authenticate({
                strategy: "email_otp",
                otp,
                email: selectionData.email,
              });
            } catch (e: any) {
              console.log("error validating otp new user", e);
              if (e instanceof Error && e.message.includes("encryption key")) {
                setScreen("create-password");
              } else {
                onError(e);
              }
            }
          } else {
            try {
              await emailWallet.authenticate({
                strategy: "email_otp",
                otp,
                email: selectionData.email,
              });
            } catch (e: any) {
              console.log("error validating otp existing user", e);
              if (e instanceof Error && e.message.includes("encryption key")) {
                setScreen("enter-password-or-recovery-code");
              } else {
                onError(e);
              }
            }
          }
        } else {
          // AWS_MANAGED
          connect();
        }
      }, 0);
    }
  }, [
    connect,
    onError,
    onLocallyConnected,
    postConnect,
    screen,
    selectionData,
    setConnectedWallet,
    setConnectionStatus,
    values,
  ]);

  const handleInputChange = async (value: string, index: number) => {
    if (value !== "") {
      const copiedContent = await Clipboard.getStringAsync();

      if (copiedContent.length === 6) {
        const newValues = [...copiedContent];
        for (let i = 0; i < 6; i++) {
          inputRefs.current[i]?.setNativeProps({ text: newValues[i] });
        }
        setValues(newValues);
        Clipboard.setStringAsync("");
        return;
      }
    }

    const newValues = [...values];
    newValues[index] = value;

    setValues(newValues);

    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (value.length === 1) {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearCode = () => {
    setValues([]);
    setFocusedIndex(undefined);
    for (const inputRef of inputRefs.current) {
      inputRef?.clear();
    }
  };

  const onRequestNewCodePress = () => {
    clearCode();
    setErrorMessage("");
    setFocusedIndex(undefined);
    setRequestingNewOtp(true);
    (selectionData.emailWallet as EmbeddedWallet)
      .sendEmailOTP(selectionData.email)
      .then(() => {})
      .catch((error) => {
        clearCode();
        console.error("Error requesting code: ", error);
        setErrorMessage("Error requesting a new code");
      })
      .finally(() => {
        setRequestingNewOtp(false);
      });
  };

  if (screen === "create-password") {
    return (
      <EnterPassword
        close={goBack}
        goBack={() => {
          setScreen("base");
        }}
        email={selectionData.email}
        type="create_password"
        onPassword={connect}
        error={errorMessage}
      />
    );
  }

  if (screen === "enter-password-or-recovery-code") {
    return (
      <EnterPassword
        close={goBack}
        goBack={() => {
          setScreen("base");
        }}
        email={selectionData.email}
        type="enter_password"
        onPassword={connect}
        error={errorMessage}
      />
    );
  }

  if (selectionData?.oauthOptions) {
    return (
      <EmbeddedSocialConnection
        connected={() => {}}
        goBack={goBack}
        onLocallyConnected={onLocallyConnected}
        selectionData={selectionData}
        {...props}
      />
    );
  }

  return (
    <Box marginHorizontal="xl">
      <ConnectWalletHeader
        middleContent={
          <Text variant="header">{l.embedded_wallet.sign_in}</Text>
        }
        subHeaderText={"Please enter the code sent to"}
        onBackPress={goBack}
        onClose={connected}
      />
      <Text
        variant="subHeader"
        textAlign="center"
        fontWeight="700"
        color="textPrimary"
      >
        {selectionData?.email}
      </Text>
      <Box
        mt="sm"
        flexDirection="row"
        height={50}
        width={"100%"}
        marginTop="xl"
        mb="md"
        justifyContent="space-evenly"
      >
        {Array.from({ length: OTP_LENGTH }, (_, index) => (
          <Box
            key={index.toString()}
            flex={1}
            borderColor={
              focusedIndex === index ? "accentButtonColor" : "iconPrimary"
            }
            marginHorizontal="xxs"
            borderWidth={2}
            justifyContent="center"
            alignItems="stretch"
            borderRadius="md"
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={{
                ...styles.textInput,
                color: theme.colors.textPrimary,
              }}
              editable={!checkingOtp}
              selectTextOnFocus={true}
              onFocus={() => setFocusedIndex(index)}
              maxLength={1}
              returnKeyType={index === 5 ? "done" : "next"}
              onChangeText={(value) => handleInputChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          </Box>
        ))}
      </Box>
      {selectionData.isNewUser === false ? (
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
            onChangeText={setOneTimePasscode}
          />
        </Box>
      ) : null}
      {errorMessage ? (
        <Text variant="error" numberOfLines={1}>
          {errorMessage}
        </Text>
      ) : (
        <Box height={20} />
      )}
      {checkingOtp ? (
        <ActivityIndicator size="small" />
      ) : (
        <BaseButton
          mt="sm"
          alignItems="center"
          height={theme.textVariants.bodySmallSecondary.fontSize}
          onPress={onRequestNewCodePress}
        >
          {requestingNewOtp ? (
            <ActivityIndicator
              size={"small"}
              color={theme.colors.linkPrimary}
            />
          ) : (
            <Text variant="bodySmallSecondary" color="linkPrimary">
              {l.embedded_wallet.request_new_code}
            </Text>
          )}
        </BaseButton>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    textAlign: "center",
    height: 50,
  },
});
