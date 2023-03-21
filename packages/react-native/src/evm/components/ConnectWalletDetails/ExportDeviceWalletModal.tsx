import Text from "../base/Text";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import BaseButton from "../base/BaseButton";
import Box from "../base/Box";
import { useWallet } from "@thirdweb-dev/react-core";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import KeyIcon from "../../assets/key";
import { useAppTheme } from "../../styles/hooks";

export type ExportDeviceWalletModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ExportDeviceWalletModal = ({
  isVisible,
  onClose,
}: ExportDeviceWalletModalProps) => {
  const [privateKey, setPrivateKey] = useState<string | undefined>();

  const theme = useAppTheme();

  const activeWallet = useWallet();

  const onContinuePress = () => {
    if (!privateKey) {
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
        p="lg"
      >
        <ModalHeaderTextClose headerText={""} onClose={onCloseInternal} />
        <Text variant="header" textAlign="center">
          Revealing private key
        </Text>
        <Text variant="subHeader" mt="md" textAlign="center">
          This private key gives full access to your wallet, funds and accounts.
        </Text>
        <Text variant="bodySmall" mt="xl" textAlign="center" color="warning">
          Please ensure you are keeping your private key safe.
        </Text>
        <BaseButton
          backgroundColor="background"
          borderColor="border"
          mt="lg"
          style={styles.pkButton}
        >
          <KeyIcon size={22} color={theme.colors.iconPrimary} />
          <Text variant="bodySmallSecondary" textAlign="center" mt={"md"}>
            {privateKey ||
              "Your private key will show here. Make sure no one is looking at your screen."}
          </Text>
        </BaseButton>
        <Box
          flexDirection="row"
          justifyContent="center"
          paddingHorizontal="md"
          mt="lg"
        >
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            style={styles.modalButton}
            onPress={onContinuePress}
          >
            <Text variant="bodySmall">Reveal Key</Text>
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
