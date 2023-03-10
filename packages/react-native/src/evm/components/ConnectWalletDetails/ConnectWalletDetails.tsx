import { IWalletWithMetadata } from "../../types/wallets";
import { NetworkSelectorModal } from "../NetworkSelector/NetworkSelectorModal";
import { Address } from "../base/Address";
import BaseButton from "../base/BaseButton";
import { ChainIcon } from "../base/ChainIcon";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { TWModal } from "../base/modal/TWModal";
import { NetworkButton } from "./NetworkButton";
import { WalletDetailsModalHeader } from "./WalletDetailsModalHeader";
import {
  useActiveWallet,
  useBalance,
  useDisconnect,
} from "@thirdweb-dev/react-core";
import { useActiveChain } from "@thirdweb-dev/react-core/evm";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export type ConnectWalletDetailsProps = {
  address: string;
};

export const ConnectWalletDetails = ({
  address,
}: ConnectWalletDetailsProps) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isNetworkSelectorModalVisible, setIsNetworkSelectorModalVisible] =
    useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const activeWallet = useActiveWallet();
  const disconnect = useDisconnect();
  const chain = useActiveChain();
  const balanceQuery = useBalance();

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
  };

  return (
    <>
      <TWModal
        isVisible={isDetailsModalVisible}
        onBackdropPress={onBackdropPress}
      >
        <WalletDetailsModalHeader
          address={address}
          onDisconnectPress={onDisconnectPress}
          loading={isDisconnecting}
        />
        <View style={styles.currentNetwork}>
          <Text variant="bodySmallSecondary">Current Network</Text>
        </View>
        <NetworkButton
          chainIconUrl={chain?.icon?.url || ""}
          chainName={chain?.name || ""}
          onPress={onChangeNetworkPress}
        />
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
        <WalletIcon
          size={32}
          iconUri={
            (activeWallet as unknown as IWalletWithMetadata).getMetadata()
              .image_url || ""
          }
        />
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
    marginTop: 36,
  },
});
