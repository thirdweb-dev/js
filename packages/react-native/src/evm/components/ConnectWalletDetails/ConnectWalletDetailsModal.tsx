import { StyleSheet, View } from "react-native";
import Box from "../base/Box";
import { Toast } from "../base/Toast";
import { ExportLocalWalletModal } from "./ExportLocalWalletModal";
import { NetworkButton } from "../base/NetworkButton";
import { WalletDetailsModalHeader } from "./WalletDetailsModalHeader";
import {
  useActiveChain,
  useDisconnect,
  useSetConnectedWallet,
  useWallet,
} from "@thirdweb-dev/react-core";
import { SmartWallet, walletIds, LocalWallet } from "@thirdweb-dev/wallets";
import { useState, useCallback, useEffect } from "react";
import RightArrowIcon from "../../assets/right-arrow";
import PocketWalletIcon from "../../assets/wallet";
import { useSmartWallet } from "../../providers/context-provider";
import BaseButton from "../base/BaseButton";
import { SmartWalletAdditionalActions } from "./SmartWalletAdditionalActions";
import Text from "../base/Text";
import { useModalState } from "../../providers/ui-context-provider";
import { CLOSE_MODAL_STATE, WalletDetailsModal } from "../../utils/modalTypes";
import { useAppTheme } from "../../styles/hooks";
import { LocalWalletImportModal } from "../ConnectWalletFlow/LocalWalletImportModal";

export const ConnectWalletDetailsModal = () => {
  const theme = useAppTheme();
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const activeWallet = useWallet();
  const chain = useActiveChain();
  const disconnect = useDisconnect();
  const [smartWallet, setSmartWallet] = useSmartWallet();
  const [addressCopied, setAddressCopied] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const { modalState, setModalState } = useModalState();
  const { address } = (modalState as WalletDetailsModal).data;
  const setConnectedWallet = useSetConnectedWallet();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (addressCopied) {
        setAddressCopied(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [addressCopied]);

  const onDisconnectPress = () => {
    disconnect().finally(() => {
      setModalState(CLOSE_MODAL_STATE("ConnectWalletDetailsModal"));
      setSmartWallet?.(undefined);
    });
  };

  const onChangeNetworkPress = () => {
    // TODO: implement this
    // setIsDetailsModalVisible(false);
    // setIsNetworkSelectorModalVisible(true);
  };

  const onExportLocalWalletPress = useCallback(() => {
    setIsExportModalVisible(true);
  }, []);

  const onExportModalClose = () => {
    setIsExportModalVisible(false);
  };

  const onAddressCopied = () => {
    setAddressCopied(true);
  };

  const onImportLocalWalletPress = () => {
    setIsImportModalVisible(true);
  };

  const onImportModalClose = () => {
    setIsImportModalVisible(false);
  };

  const onWalletImported = useCallback(
    (localWalletInstance: LocalWallet) => {
      activeWallet?.disconnect();
      localWalletInstance.connect();

      setConnectedWallet?.(localWalletInstance);
    },
    [activeWallet, setConnectedWallet],
  );

  const getAdditionalActions = useCallback(() => {
    if (activeWallet?.walletId === SmartWallet.id || smartWallet) {
      return (
        <SmartWalletAdditionalActions
          onExportPress={onExportLocalWalletPress}
        />
      );
    }

    if (activeWallet?.walletId === walletIds.localWallet) {
      return (
        <>
          <View style={styles.currentNetwork}>
            <Text variant="bodySmallSecondary">Additional Actions</Text>
          </View>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            mb="sm"
            justifyContent="space-between"
            style={styles.exportWallet}
            onPress={onExportLocalWalletPress}
          >
            <>
              <PocketWalletIcon width={16} height={16} />
              <View style={styles.exportWalletInfo}>
                <Text variant="bodySmall">Backup wallet</Text>
              </View>
            </>
            <RightArrowIcon
              height={10}
              width={10}
              color={theme.colors.iconPrimary}
            />
          </BaseButton>

          <BaseButton
            backgroundColor="background"
            borderColor="border"
            mb="sm"
            justifyContent="space-between"
            style={styles.exportWallet}
            onPress={onImportLocalWalletPress}
          >
            <>
              <PocketWalletIcon width={16} height={16} />
              <View style={styles.exportWalletInfo}>
                <Text variant="bodySmall">Import wallet</Text>
              </View>
            </>
            <RightArrowIcon
              height={10}
              width={10}
              color={theme.colors.iconPrimary}
            />
          </BaseButton>

          <LocalWalletImportModal
            isVisible={isImportModalVisible}
            onWalletImported={onWalletImported}
            onClose={onImportModalClose}
          />

          {activeWallet?.walletId === LocalWallet.id ? (
            <Text variant="error">
              {
                "This is a temporary guest wallet. Download a backup if you don't want to lose access to it."
              }
            </Text>
          ) : null}
        </>
      );
    }

    return null;
  }, [
    activeWallet?.walletId,
    isImportModalVisible,
    onExportLocalWalletPress,
    onWalletImported,
    smartWallet,
    theme.colors.iconPrimary,
  ]);

  return (
    <Box>
      <ExportLocalWalletModal
        isVisible={isExportModalVisible}
        onClose={onExportModalClose}
      />
      <WalletDetailsModalHeader
        address={address}
        onDisconnectPress={onDisconnectPress}
        onAddressCopied={onAddressCopied}
      />
      <View style={styles.currentNetwork}>
        <Text variant="bodySmallSecondary">Current Network</Text>
      </View>
      <NetworkButton
        chainIconUrl={chain?.icon?.url || ""}
        chainName={chain?.name || "Unknown Network"}
        onPress={onChangeNetworkPress}
      />
      {getAdditionalActions()}
      {addressCopied === true ? (
        <Toast text={"Address copied to clipboard"} />
      ) : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  exportWalletInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    marginLeft: 8,
  },
  exportWallet: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 200,
  },
  currentNetwork: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 24,
    marginBottom: 8,
  },
});
