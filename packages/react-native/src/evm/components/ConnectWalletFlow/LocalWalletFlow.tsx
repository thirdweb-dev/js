import BaseButton from "../base/BaseButton";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ConnectWalletHeader } from "./ConnectingWallet/ConnectingWalletHeader";
import Text from "../base/Text";
import { ModalFooter } from "../base/modal/ModalFooter";
import { LocalWallet } from "../../wallets/wallets/local-wallet";
import { LocalWalletImportModal } from "./LocalWalletImportModal";
import { useState } from "react";

export type LocalWalletFlowProps = {
  onClose: () => void;
  onBackPress: () => void;
  onConnectPress: () => void;
  onWalletImported: (localWallet: LocalWallet) => void;
};

export function LocalWalletFlow({
  onClose,
  onBackPress,
  onConnectPress,
  onWalletImported,
}: LocalWalletFlowProps) {
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const onImportPress = async () => {
    setIsImportModalVisible(true);
  };

  const onImportModalClose = () => {
    setIsImportModalVisible(false);
  };

  const onConnectPressInternal = () => {
    setIsCreatingWallet(true);
    onConnectPress();
  };

  return (
    <>
      <ConnectWalletHeader
        onBackPress={onBackPress}
        walletLogoUrl={LocalWallet.meta.iconURL}
        subHeaderText={""}
        onClose={onClose}
      />
      <View style={styles.connectingContainer}>
        <BaseButton
          backgroundColor="white"
          minWidth={130}
          onPress={onConnectPressInternal}
          style={styles.connectWalletButton}
        >
          {isCreatingWallet ? (
            <ActivityIndicator size="small" color="buttonTextColor" />
          ) : (
            <Text variant="bodyLarge" color="black">
              Create new wallet
            </Text>
          )}
        </BaseButton>
        <Text variant="subHeader" mt="lg">
          -------- OR --------
        </Text>
        <ModalFooter footer={"Import a wallet"} onPress={onImportPress} />
      </View>

      <LocalWalletImportModal
        isVisible={isImportModalVisible}
        onWalletImported={onWalletImported}
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
