import {
  ConnectUIProps,
  useAddress,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { EmailWallet } from "./EmailWallet";
import React, { useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";
import { useAppTheme } from "../../../styles/hooks";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";
import BaseButton from "../../../components/base/BaseButton";

const OTP_LENGTH = 6;

export const EmailConnectionUI: React.FC<ConnectUIProps<EmailWallet>> = ({
  close,
  goBack,
  selectionData,
}) => {
  const theme = useAppTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [values, setValues] = useState<string[]>(
    new Array(OTP_LENGTH).fill(""),
  );
  const [checkingOtp, setCheckingOtp] = useState(false);
  const [requestingNewOtp, setRequestingNewOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const setConnectedWallet = useSetConnectedWallet();
  const setConnectionStatus = useSetConnectionStatus();
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>();

  const address = useAddress();

  useEffect(() => {
    if (address) {
      setCheckingOtp(false);
      close();
    }
  }, [address, close]);

  useEffect(() => {
    if (
      values.length === OTP_LENGTH &&
      values.every((v) => v.length === 1) &&
      selectionData
    ) {
      setCheckingOtp(true);
      setErrorMessage("");
      setFocusedIndex(undefined);
      const otp = values.join("");
      console.log("OTP: ", otp);

      setTimeout(() => {
        (selectionData.emailWallet as EmailWallet)
          .validateEmailOTP(otp)
          .then(async (response) => {
            console.log("EmailConnectionUI.response", !!response);

            await setConnectedWallet(selectionData.emailWallet);
            setConnectionStatus("connected");

            // console.log('getSigner', selectionData.clientId);
            // const signer = await getEthersSigner(selectionData.clientId);
            // console.log('signer.sign', !!signer);
            // const tx = await signer.signMessage('hello!!');
            // console.log('after sign', tx);
          })
          .catch((error) => {
            clearCode();
            console.error("Error validating otp: ", error);
            setErrorMessage("Error validating the code");
            setCheckingOtp(false);
            setFocusedIndex(undefined);
            // await (selectionData.emailWallet as EmailWallet).disconnect();
          });
      }, 0);
    }
  }, [close, selectionData, setConnectedWallet, setConnectionStatus, values]);

  const handleInputChange = (value: string, index: number) => {
    const newValues = [...values];
    newValues[index] = value;

    setValues(newValues);

    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (value.length === 1 && /^[0-9]$/.test(value)) {
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
    (selectionData.emailWallet as EmailWallet)
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

  return (
    <Box>
      <ConnectWalletHeader
        middleContent={<Text variant="header">Sign In</Text>}
        subHeaderText={"Please enter the code sent to"}
        onBackPress={goBack}
        onClose={close}
      />
      <Text
        variant="subHeader"
        textAlign="center"
        fontWeight="700"
        color="white"
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
            borderColor={focusedIndex === index ? "white" : "iconPrimary"}
            marginHorizontal="xxs"
            borderWidth={2}
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.textInput}
              keyboardType="number-pad"
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
              Request new code
            </Text>
          )}
        </BaseButton>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  textInput: { fontSize: 20, color: "white", textAlign: "center", height: 50 },
});
