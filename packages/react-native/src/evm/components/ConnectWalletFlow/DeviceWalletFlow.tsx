import BaseButton from "../base/BaseButton";
import { StyleSheet, View } from "react-native";
import { ConnectWalletHeader } from "./ConnectingWallet/ConnectingWalletHeader";
import Text from "../base/Text";
import { ModalFooter } from "../base/modal/ModalFooter";
import { DeviceWallet } from "../../wallets/wallets/device-wallet";
import { DeviceWalletImportModal } from "./DeviceWalletImportModal";
import { useState } from "react";

export type DeviceWalletFlowProps = {
  onClose: () => void;
  onBackPress: () => void;
  onConnectPress: () => void;
};

export function DeviceWalletFlow({
  onClose,
  onBackPress,
  onConnectPress,
}: DeviceWalletFlowProps) {
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  const onImportPress = async () => {
    setIsImportModalVisible(true);
  };

  const onImportModalClose = () => {
    setIsImportModalVisible(false);
  };

  return (
    <>
      <ConnectWalletHeader
        onBackPress={onBackPress}
        walletLogoUrl={DeviceWallet.meta.iconURL}
        subHeaderText={""}
        close={onClose}
      />
      <View style={styles.connectingContainer}>
        <BaseButton
          backgroundColor="white"
          onPress={onConnectPress}
          style={styles.connectWalletButton}
        >
          <Text variant="bodyLarge" color="black">
            Create new wallet
          </Text>
        </BaseButton>
        <Text variant="subHeader" mt="lg">
          -------- OR --------
        </Text>
        <ModalFooter footer={"Import a wallet"} onPress={onImportPress} />
      </View>

      <DeviceWalletImportModal
        isVisible={isImportModalVisible}
        onClose={onImportModalClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  connectingContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 18,
  },
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
