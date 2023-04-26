import { NetworkSelectorModal } from "../NetworkSelector/NetworkSelectorModal";
import { Address } from "../base/Address";
import BaseButton from "../base/BaseButton";
import { ChainIcon } from "../base/ChainIcon";
import PocketWalletIcon from "../../assets/wallet";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { TWModal } from "../base/modal/TWModal";
import { NetworkButton } from "./NetworkButton";
import { WalletDetailsModalHeader } from "./WalletDetailsModalHeader";
import { useWallet, useBalance, useDisconnect } from "@thirdweb-dev/react-core";
import { useActiveChain } from "@thirdweb-dev/react-core/evm";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ExportLocalWalletModal } from "./ExportLocalWalletModal";
import { Toast } from "../base/Toast";
import { SmartWallet } from "@thirdweb-dev/wallets";

export type ConnectWalletDetailsProps = {
  address: string;
};

export const ConnectWalletDetails = ({
  address,
}: ConnectWalletDetailsProps) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isNetworkSelectorModalVisible, setIsNetworkSelectorModalVisible] =
    useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const activeWallet = useWallet();
  const disconnect = useDisconnect();
  const chain = useActiveChain();
  const balanceQuery = useBalance();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (addressCopied) {
        setAddressCopied(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [addressCopied]);

  const onPress = () => {
    setIsDetailsModalVisible(true);
  };

  const onDisconnectPress = () => {
    setIsDisconnecting(true);
    disconnect().finally(() => {
      setIsDisconnecting(false);
    });
  };

  const onChangeNetworkPress = () => {
    // TODO: implement this
    // setIsDetailsModalVisible(false);
    // setIsNetworkSelectorModalVisible(true);
  };

  const onSelectorModalClose = () => {
    setIsNetworkSelectorModalVisible(false);
  };

  const onBackdropPress = () => {
    setIsDetailsModalVisible(false);
    setIsExportModalVisible(false);
  };

  const onExportLocalWalletPress = () => {
    setIsExportModalVisible(true);
  };

  const onExportModalClose = () => {
    setIsExportModalVisible(false);
  };

  const onAddressCopied = () => {
    setAddressCopied(true);
  };

  const getAdditionalActions = useCallback(() => {
    if (
      activeWallet?.walletId.toLowerCase().includes("localwallet") ||
      activeWallet?.walletId === SmartWallet.id
    ) {
      return (
        <>
          <View style={styles.currentNetwork}>
            <Text variant="bodySmallSecondary">Additional Actions</Text>
          </View>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            mb="sm"
            style={styles.exportWallet}
            onPress={onExportLocalWalletPress}
          >
            <PocketWalletIcon size={16} />
            <View style={styles.exportWalletInfo}>
              <Text variant="bodySmall">Export wallet</Text>
            </View>
          </BaseButton>
        </>
      );
    }

    return null;
  }, [activeWallet?.walletId]);

  return (
    <>
      <TWModal
        isVisible={isDetailsModalVisible}
        onBackdropPress={onBackdropPress}
      >
        <ExportLocalWalletModal
          isVisible={isExportModalVisible}
          onClose={onExportModalClose}
        />
        <WalletDetailsModalHeader
          address={address}
          onDisconnectPress={onDisconnectPress}
          onAddressCopied={onAddressCopied}
          loading={isDisconnecting}
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
      </TWModal>

      <NetworkSelectorModal
        isVisible={isNetworkSelectorModalVisible}
        onClose={onSelectorModalClose}
      />
      <BaseButton
        backgroundColor="background"
        borderColor="border"
        style={styles.walletDetails}
        onPress={onPress}
      >
        <ChainIcon size={32} chainIconUrl={chain?.icon?.url} />
        <View style={styles.walletInfo}>
          <Text variant="bodySmall">
            {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
            {balanceQuery.data?.symbol}
          </Text>
          <Address variant="bodySmallSecondary" address={address} />
        </View>
        <WalletIcon size={32} iconUri={activeWallet?.getMeta().iconURL || ""} />
      </BaseButton>
    </>
  );
};

const styles = StyleSheet.create({
  walletInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    marginLeft: 5,
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
  walletDetails: {
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
