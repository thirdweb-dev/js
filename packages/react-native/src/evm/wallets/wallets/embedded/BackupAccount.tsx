import React, { useEffect, useState } from "react";
import { ConnectWalletHeader } from "../../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWalletHeader";
import { Box, BaseButton, Text, Toast } from "../../../components/base";
import { useGlobalTheme } from "../../../providers/ui-context-provider";
import CopyIcon from "../../../assets/copy";
import CheckBox from "@react-native-community/checkbox";
import * as Clipboard from "expo-clipboard";

export type EnterPasswordProps = {
  goBack: () => void;
  close: () => void;
};

export const AccountRecovery = ({ close, goBack }: EnterPasswordProps) => {
  const theme = useGlobalTheme();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [errorMessage] = useState<string>();
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (codeCopied) {
        setCodeCopied(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [codeCopied]);

  const onNextPress = async () => {};

  const onCodeCopyPress = async (code: string) => {
    console.log("code", code);

    await Clipboard.setStringAsync(code);
    setCodeCopied(true);
  };

  const codes = ["testing", "testing2", "testing3", "testing4", "testing5"];

  return (
    <Box marginHorizontal="xl">
      <ConnectWalletHeader
        middleContent={<Text variant="header">Backup your account</Text>}
        subHeaderText={
          "Copy or download these codes and keep them safe. You will need these to recover access to your account if you forget your password. These have also been sent to the email address associated with your account"
        }
        onBackPress={goBack}
        onClose={close}
      />
      <Box mt="sm" flexDirection="column" marginTop="xl" mb="md">
        {codes.map((code) => (
          <BaseButton
            key={code}
            mt="xs"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            borderColor="border"
            borderWidth={1}
            borderRadius="md"
            onPress={() => {
              onCodeCopyPress(code);
            }}
            p="md"
          >
            <Text variant="bodySmall">{code}</Text>
            <CopyIcon width={14} height={14} color={theme.colors.iconPrimary} />
          </BaseButton>
        ))}
      </Box>

      {errorMessage ? (
        <Text variant="error" numberOfLines={1}>
          {errorMessage}
        </Text>
      ) : (
        <Box height={20} />
      )}
      <Box flex={1} flexDirection="row" justifyContent="flex-end">
        <BaseButton>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
          />
          <Text variant="bodySmallSecondary" color="linkPrimary">
            Learn More
          </Text>
        </BaseButton>
        <BaseButton
          mt="sm"
          flexDirection="row"
          alignItems="center"
          height={theme.textVariants.bodySmallSecondary.fontSize}
          onPress={onNextPress}
        >
          <Text variant="bodySmallSecondary" color="linkPrimary">
            Next
          </Text>
        </BaseButton>
      </Box>
      {codeCopied === true ? (
        <Toast text={"Address copied to clipboard"} />
      ) : null}
    </Box>
  );
};
