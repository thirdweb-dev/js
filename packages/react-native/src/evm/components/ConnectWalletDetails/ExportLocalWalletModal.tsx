import Text from "../base/Text";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Share,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import { useAddress, useWallet } from "@thirdweb-dev/react-core";
import { PasswordInput } from "../PasswordInput";
import * as FileSystem from "expo-file-system";
import { LocalWallet } from "../../wallets/wallets/local-wallet";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { usePersonalWalletAddress } from "../../wallets/hooks/usePersonalWalletAddress";

export type ExportLocalWalletModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ExportLocalWalletModal = ({
  isVisible,
  onClose,
}: ExportLocalWalletModalProps) => {
  const [password, setPassword] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const activeWallet = useWallet();
  const address = useAddress();
  const personalWalletAddress = usePersonalWalletAddress();

  const onContinuePress = async () => {
    if (!password) {
      setError("Please enter a password");
      return;
    }

    setIsExporting(true);
    setError(undefined);

    let data;
    if (activeWallet?.walletId === SmartWallet.id) {
      data = await (activeWallet.getPersonalWallet() as LocalWallet).export({
        strategy: "encryptedJson",
        password: password,
      });
    } else {
      data = await (activeWallet as LocalWallet).export({
        strategy: "encryptedJson",
        password: password,
      });
    }

    const fileName = "wallet.json";
    if (Platform.OS === "android") {
      // Requests permissions for external directory
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        // Gets SAF URI from response
        const uri = permissions.directoryUri;

        let fileURI;
        try {
          // Create file in external directory. If file already exists, it will be renamed.
          fileURI = await FileSystem.StorageAccessFramework.createFileAsync(
            uri,
            fileName,
            "application/json",
          );
        } catch (e) {
          console.error("Error creating the file", e);
          setError("Error creating the file. Please try again.");
          setIsExporting(false);
          return;
        }

        try {
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            fileURI,
            data,
            {
              encoding: FileSystem.EncodingType.UTF8,
            },
          );
          setIsExporting(false);
        } catch (e) {
          console.error("Error writing the file", e);
          setError("Error writing the file. Please try again.");
          setIsExporting(false);
          return;
        }
      }

      onCloseInternal();
    } else {
      let filePath;
      try {
        filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, data, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      } catch (e) {
        console.error("Error writing the file", e);
        setError("Error writing the file. Please try again.");
      }

      if (!filePath) {
        setIsExporting(false);
        return;
      }

      await Share.share({ title: "Wallet JSON", url: filePath });

      onCloseInternal();
    }

    setIsExporting(false);
  };

  const onCloseInternal = () => {
    setError(undefined);
    setPassword(undefined);
    onClose();
  };

  const onChangeText = (text: string) => {
    if (error) {
      setError(undefined);
    }

    setPassword(text);
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
            Export your Wallet
          </Text>
          <Text variant="subHeader" mt="md" textAlign="center">
            {
              "This will download a JSON file containing your wallet information onto your device encrypted with the password."
            }
          </Text>
          <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
            Wallet Address
          </Text>
          <Text variant="bodySmallSecondary">
            {personalWalletAddress ? personalWalletAddress : address}
          </Text>
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
              onPress={onContinuePress}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color="buttonTextColor" />
              ) : (
                <Text variant="bodySmall" color="black">
                  Export
                </Text>
              )}
            </BaseButton>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
