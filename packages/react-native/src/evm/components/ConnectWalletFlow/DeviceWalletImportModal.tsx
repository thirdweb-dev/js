import Text from "../base/Text";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import {
  Wallet,
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { PasswordInput } from "../PasswordInput";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export type DeviceWalletImportModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const DeviceWalletImportModal = ({
  isVisible,
  onClose,
}: DeviceWalletImportModalProps) => {
  const [password, setPassword] = useState<string | undefined>();
  const [jsonFile, setJsonFile] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const createWalletInstance = useCreateWalletInstance();
  const deviceWalletCreator = useSupportedWallet(DeviceWallet.id) as Wallet;
  const twWalletContext = useThirdwebWallet();

  const onImportPress = async () => {
    setError(undefined);
    if (!password || !jsonFile) {
      setError("Please enter a password and select a file.");
      return;
    }

    let json;
    try {
      json = await FileSystem.readAsStringAsync(jsonFile, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (err) {
      setError("Error reading the file. Please try again.");
      return;
    }

    const deviceWallet = createWalletInstance(
      deviceWalletCreator,
    ) as DeviceWallet;

    try {
      await deviceWallet.import({
        encryptedJson: json,
        password: password,
      });
    } catch (err) {
      console.error("Error importing the wallet", err);
      setError("Invalid password");
      return;
    }

    deviceWallet.save({
      strategy: "privateKey",
    });

    await deviceWallet.connect();
    twWalletContext?.handleWalletConnect(deviceWallet);

    onCloseInternal();
  };

  const onCloseInternal = () => {
    setPassword(undefined);
    onClose();
  };

  const onChangeText = (text: string) => {
    setPassword(text);

    if (text.length === 0) {
      setError(undefined);
    }
  };

  const onPickFilePress = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "application/json",
    });

    if (result.type === "success") {
      setJsonFile(result.uri);
      setError(undefined);
    } else {
      setError("Error accessing the file. Please try again.");
    }
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <KeyboardAvoidingView behavior="padding">
        <Box
          flexDirection="column"
          backgroundColor="background"
          borderRadius="md"
          p="lg"
        >
          <ModalHeaderTextClose headerText={""} onClose={onCloseInternal} />
          <Text variant="header" textAlign="center">
            Import JSON Wallet
          </Text>
          <Text variant="subHeader" mt="md" textAlign="center">
            {
              "The application can authorize any transactions on behalf of the wallet without any approvals. We recommend only connecting to trusted applications."
            }
          </Text>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            mt="lg"
            onPress={onPickFilePress}
            style={styles.pkButton}
          >
            <Text variant="bodySmallSecondary" textAlign="left">
              {jsonFile ||
                "Select the JSON file you exported from your wallet."}
            </Text>
          </BaseButton>
          <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
            Password
          </Text>
          <PasswordInput onChangeText={onChangeText} />
          <Text variant="bodySmall" color="red" mt="xs" textAlign="left">
            {error}
          </Text>
          <Box
            flexDirection="row"
            justifyContent="center"
            paddingHorizontal="md"
            mt="lg"
          >
            <BaseButton
              backgroundColor="white"
              style={styles.modalButton}
              onPress={onImportPress}
            >
              <Text variant="bodySmall" color="black">
                Import
              </Text>
            </BaseButton>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalButton: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 100,
  },
  pkButton: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});
