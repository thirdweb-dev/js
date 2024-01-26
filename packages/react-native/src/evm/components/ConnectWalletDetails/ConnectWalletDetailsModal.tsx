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
import TransactionIcon from "../../assets/transaction";
import { ReceiveButton } from "../ReceiveButton";
import { SendButton } from "../SendFunds/SendButton";
import { SupportedTokens } from "../SendFunds/defaultTokens";
import { ActiveDot } from "../base";
import { EmbeddedWallet } from "../../wallets/wallets/embedded/EmbeddedWallet";
import { useLocale } from "../../providers/ui-context-provider";
import { isWalletConnectReceiverEnabled } from "../../wallets/utils";
import ConnectAppField from "./ConnectAppField";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.7;
const DEVICE_WIDTH = Dimensions.get("window").width;

export const ConnectWalletDetailsModal = ({
  isVisible,
  onClosePress,
  extraRows,
  address,
  hideTestnetFaucet,
  supportedTokens,
  tokenAddress,
  hideSwitchToPersonalWallet,
  hideReceiveButton,
  hideSendButton,
  hideDisconnect,
}: {
  isVisible: boolean;
  onClosePress: () => void;
  extraRows?: React.FC;
  address?: string;
  hideTestnetFaucet?: boolean;
  supportedTokens: SupportedTokens;
  tokenAddress?: string;
  hideSwitchToPersonalWallet?: boolean;
  hideReceiveButton?: boolean;
  hideSendButton?: boolean;
  hideDisconnect?: boolean;
}) => {
  const l = useLocale();
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const activeWallet = useWallet();
  const chain = useChain();
  const disconnect = useDisconnect();
  const [smartWallet, setSmartWallet] = useSmartWallet();
  const [addressCopied, setAddressCopied] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const setConnectedWallet = useSetConnectedWallet();

  const [isSmartWalletDeployed, setIsSmartWalletDeployed] = useState(false);

  useEffect(() => {
    if (activeWallet && activeWallet.walletId === walletIds.smartWallet) {
      const connectedSmartWallet = activeWallet as SmartWallet;
      connectedSmartWallet.isDeployed().then((isDeployed) => {
        setIsSmartWalletDeployed(isDeployed);
      });
    } else {
      setIsSmartWalletDeployed(false);
    }
  }, [activeWallet]);

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
          hideSwitchToPersonalWallet={hideSwitchToPersonalWallet}
        />
      );
    }

    if (activeWallet?.walletId === walletIds.localWallet) {
      return (
        <>
          <View style={styles.additionalActions}>
            <Text variant="bodySmallSecondary">
              {l.connect_wallet_details.additional_actions}
            </Text>
          </View>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            borderRadius="lg"
            borderWidth={0.5}
            mb="sm"
            justifyContent="space-between"
            style={styles.exportWallet}
            onPress={onExportLocalWalletPress}
          >
            <>
              <PocketWalletIcon width={16} height={16} />
              <View style={styles.exportWalletInfo}>
                <Text variant="bodySmall">
                  {l.connect_wallet_details.backup_wallet}
                </Text>
              </View>
            </>
            <RightArrowIcon height={10} width={10} />
          </BaseButton>

          <BaseButton
            backgroundColor="background"
            borderColor="border"
            borderRadius="lg"
            borderWidth={0.5}
            mb="sm"
            justifyContent="space-between"
            style={styles.exportWallet}
            onPress={onImportLocalWalletPress}
          >
            <>
              <PocketWalletIcon width={16} height={16} />
              <View style={styles.exportWalletInfo}>
                <Text variant="bodySmall">
                  {l.connect_wallet_details.import_wallet}
                </Text>
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
            <Text variant="error" textAlign="left" mb="sm">
              {l.local_wallet.this_is_a_temporary_wallet}
            </Text>
          ) : null}
        </>
      );
    }

    return null;
  }, [
    activeWallet?.walletId,
    smartWallet,
    onExportLocalWalletPress,
    l.connect_wallet_details.additional_actions,
    l.connect_wallet_details.backup_wallet,
    l.connect_wallet_details.import_wallet,
    l.local_wallet.this_is_a_temporary_wallet,
    isImportModalVisible,
    onWalletImported,
    hideSwitchToPersonalWallet,
  ]);

  // by default we hide faucet link
  const showFaucet =
    hideTestnetFaucet === undefined ? false : !hideTestnetFaucet;

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
              tokenAddress={tokenAddress}
              address={address}
              hideDisconnect={hideDisconnect}
              onDisconnectPress={onDisconnectPress}
              onAddressCopied={onAddressCopied}
            />
            {activeWallet?.walletId === SmartWallet.id ? (
              <BaseButton
                disabled={!isSmartWalletDeployed}
                onPress={() => {
                  Linking.openURL(
                    `https://thirdweb.com/${chain?.slug}/${address}/account`,
                  );
                }}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                mt="md"
              >
                <Box flexDirection="row" alignItems="center">
                  <ActiveDot width={10} height={10} />
                  <Text variant="bodySmallSecondary" ml="xxs">
                    {l.connect_wallet_details.connected_to_smart_wallet}
                  </Text>
                </Box>
                {isSmartWalletDeployed ? (
                  <RightArrowIcon width={10} height={10} />
                ) : null}
              </BaseButton>
            ) : null}
            {activeWallet?.walletId === EmbeddedWallet.id &&
            (activeWallet as EmbeddedWallet).getEmail() ? (
              <Box flexDirection="row" alignItems="center" mt="md">
                <ActiveDot width={10} height={10} />
                <Text variant="bodySmallSecondary" ml="xxs">
                  {(activeWallet as EmbeddedWallet).getEmail()}
                </Text>
              </Box>
            ) : null}
            {hideReceiveButton && hideSendButton ? null : (
              <Box
                flexDirection="row"
                justifyContent="space-evenly"
                gap="xs"
                marginTop="md"
              >
                {hideSendButton ? null : (
                  <SendButton supportedTokens={supportedTokens} />
                )}
                {hideReceiveButton ? null : <ReceiveButton />}
              </Box>
            )}
            <View style={styles.currentNetwork}>
              <Text variant="bodySmallSecondary">
                {l.connect_wallet_details.current_network}
              </Text>
            </View>
            <NetworkButton chain={chain} enableSwitchModal={true} />
            {showFaucet && chain?.testnet && chain?.faucets?.length ? (
              <IconTextButton
                mt="xs"
                text={l.connect_wallet_details.request_testnet_funds}
                icon={<MoneyIcon height={16} width={16} />}
                onPress={() => {
                  if (chain?.faucets?.[0]) {
                    Linking.openURL(chain.faucets[0]);
                  }
                }}
              />
            ) : null}
            {chain?.explorers && chain?.explorers?.[0] && (
              <IconTextButton
                mt="xs"
                text={l.connect_wallet_details.view_transaction_history}
                icon={<TransactionIcon height={16} width={16} />}
                onPress={() => {
                  Linking.openURL(
                    chain?.explorers?.[0].url + "/address/" + address,
                  );
                }}
              />
            )}
            {isWalletConnectReceiverEnabled(activeWallet) ? (
              <ConnectAppField onConnectAppTriggered={onClosePress} />
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
    marginBottom: 8,
    marginTop: 28,
  },
  additionalActions: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 8,
    marginTop: 12,
  },
});
