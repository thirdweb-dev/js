import Text from "../base/Text";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import { useAddress, useWallet } from "@thirdweb-dev/react-core";
import { PasswordInput } from "../PasswordInput";
import * as FileSystem from "expo-file-system";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";

export type ExportDeviceWalletModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ExportDeviceWalletModal = ({
  isVisible,
  onClose,
}: ExportDeviceWalletModalProps) => {
  const [password, setPassword] = useState<string | undefined>();

  const activeWallet = useWallet();
  const address = useAddress();

  const onContinuePress = async () => {
    if (!password) {
      return;
    }

    const data = await (activeWallet as DeviceWallet).export({
      strategy: "encryptedJson",
      password: password,
    });

    // Requests permissions for external directory
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      // Gets SAF URI from response
      const uri = permissions.directoryUri;

      // Create file in external directory. If file already exists, it will be renamed.
      const fileURI = await FileSystem.StorageAccessFramework.createFileAsync(
        uri,
        "wallet.json",
        "application/json",
      );

      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        fileURI,
        data,
        {
          encoding: FileSystem.EncodingType.UTF8,
        },
      );

      onCloseInternal();
    }
  };

  const onCloseInternal = () => {
    setPassword(undefined);
    onClose();
  };

  const onChangeText = (text: string) => {
    setPassword(text);
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
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
            "Enter a password to export your wallet. It will be used for encrypting and for re-importing this wallet."
          }
        </Text>
        <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
          Wallet Address
        </Text>
        <Text variant="subHeader">{address}</Text>
        <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
          Password
        </Text>
        <PasswordInput onChangeText={onChangeText} />
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
            <Text variant="bodySmall" color="black">
              Export
            </Text>
          </BaseButton>
        </Box>
      </Box>
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
