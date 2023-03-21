import Text from "../base/Text";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { useWallet } from "@thirdweb-dev/react-core";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";

export type ExportDeviceWalletModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ExportDeviceWalletModal = ({
  isVisible,
  onClose,
}: ExportDeviceWalletModalProps) => {
  const [privateKey, setPrivateKey] = useState<string | undefined>();

  const activeWallet = useWallet();

  const onContinuePress = () => {
    if (privateKey) {
      onCloseInternal();
    } else {
      (activeWallet as DeviceWallet).getWalletData().then((data) => {
        setPrivateKey(data?.encryptedData);
      });
    }
  };

  const onCloseInternal = () => {
    setPrivateKey(undefined);
    onClose();
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.7}>
      <Box
        flexDirection="column"
        backgroundColor="background"
        borderRadius="md"
        p="md"
      >
        <Box>
          <Text variant="header">Reveal Secret Private Key</Text>
          <Text variant="subHeader" mt="sm" textAlign="center">
            The private key gives full access to your wallet, funds and
            accounts.
          </Text>
          <Text variant="bodySmall" mt="sm" textAlign="center">
            You are responsible for keeping it safe.
          </Text>
        </Box>
        <BaseButton
          backgroundColor="background"
          borderColor="border"
          style={styles.pkButton}
        >
          <Text variant="bodySmall" textAlign="center">
            {privateKey || "Make sure no one is looking at your screen"}
          </Text>
        </BaseButton>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingHorizontal="md"
          mt="md"
        >
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            style={styles.modalButton}
            onPress={onCloseInternal}
          >
            <Text variant="bodySmall">Close</Text>
          </BaseButton>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            style={styles.modalButton}
            onPress={onContinuePress}
          >
            <Text variant="bodySmall">Next</Text>
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
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingVertical: 12,
  },
});
