import { Dimensions, Linking, StyleSheet, View } from "react-native";
import Box from "../base/Box";
import { Toast } from "../base/Toast";
import { ExportLocalWalletModal } from "./ExportLocalWalletModal";
import { NetworkButton } from "../base/NetworkButton";
import { WalletDetailsModalHeader } from "./WalletDetailsModalHeader";
import {
  useChain,
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
import { LocalWalletImportModal } from "../ConnectWalletFlow/LocalWalletImportModal";
import { IconTextButton } from "../base/IconTextButton";
import MoneyIcon from "../../assets/money";
import { TWModal } from "../base/modal/TWModal";
import { ThemeProvider } from "../../styles/ThemeProvider";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;
const DEVICE_WIDTH = Dimensions.get("window").width;

export const ConnectWalletDetailsModal = ({
  isVisible,
  onClosePress,
  extraRows,
  address,
  hideTestnetFaucet,
}: {
  isVisible: boolean;
  onClosePress: () => void;
  extraRows?: React.FC;
  address?: string;
  hideTestnetFaucet?: boolean;
}) => {
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const activeWallet = useWallet();
  const chain = useChain();
  const disconnect = useDisconnect();
  const [smartWallet, setSmartWallet] = useSmartWallet();
  const [addressCopied, setAddressCopied] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
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
      setSmartWallet?.(undefined);
      onClosePress();
    });
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
            <RightArrowIcon height={10} width={10} />
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
            <RightArrowIcon height={10} width={10} />
          </BaseButton>

          <LocalWalletImportModal
            isVisible={isImportModalVisible}
            onWalletImported={onWalletImported}
            onClose={onImportModalClose}
          />

          {activeWallet?.walletId === LocalWallet.id ? (
            <Text variant="error" textAlign="left">
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
  ]);

  return (
    <ThemeProvider>
      <TWModal isVisible={isVisible} onBackdropPress={onClosePress}>
        <Box backgroundColor="background" style={styles.modal}>
          <Box style={styles.contentContainer}>
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
            <NetworkButton chain={chain} enableSwitchModal={true} />
            {!hideTestnetFaucet && chain?.testnet && chain?.faucets?.length ? (
              <IconTextButton
                mt="xs"
                text="Request Testnet Funds"
                icon={<MoneyIcon height={10} width={10} />}
                onPress={() => {
                  if (chain?.faucets?.[0]) {
                    Linking.openURL(chain.faucets[0]);
                  }
                }}
              />
            ) : null}
            {getAdditionalActions()}
            {extraRows ? extraRows({}) : null}
            {addressCopied === true ? (
              <Toast text={"Address copied to clipboard"} />
            ) : null}
          </Box>
        </Box>
      </TWModal>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: DEVICE_WIDTH,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  contentContainer: {
    maxHeight: MODAL_HEIGHT,
    display: "flex",
  },
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
