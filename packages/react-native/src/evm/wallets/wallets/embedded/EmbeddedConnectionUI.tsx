import {
  ConnectUIProps,
  useAddress,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "./EmbeddedWallet";
import React, { useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";
import { useAppTheme } from "../../../styles/hooks";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";
import BaseButton from "../../../components/base/BaseButton";

const OTP_LENGTH = 6;

export const EmbeddedConnectionUI: React.FC<ConnectUIProps<EmbeddedWallet>> = ({
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

      setTimeout(() => {
        (selectionData.emailWallet as EmbeddedWallet)
          .validateEmailOTP(otp)
          .then(async () => {
            await setConnectedWallet(selectionData.emailWallet);
            setConnectionStatus("connected");
          })
          .catch((error) => {
            clearCode();
            console.error("Error validating otp: ", error);
            setErrorMessage("Error validating the code");
            setCheckingOtp(false);
            setFocusedIndex(undefined);
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
            borderColor={focusedIndex === index ? "white" : "iconPrimary"}
            marginHorizontal="xxs"
            borderWidth={2}
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={{
                fontSize: 20,
                color: theme.colors.textPrimary,
                textAlign: "center",
                height: 50,
              }}
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
