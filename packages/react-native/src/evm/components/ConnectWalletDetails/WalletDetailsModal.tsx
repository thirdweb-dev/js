import { TWModal, TWModalProps } from "../base/modal/TWModal";
import { NetworkButton } from "./NetworkButton";
import { WalletDetailsModalHeader } from "./WalletDetailsModalHeader";
import { useActiveChainId, useSupportedChains } from "@thirdweb-dev/react-core";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export type WalletDetailsModalProps = {
  address: string;
  onDisconnectPress: () => void;
  onChangeNetworkPress: () => void;
} & TWModalProps;

export const WalletDetailsModal = ({
  address,
  onDisconnectPress,
  onChangeNetworkPress,
  ...props
}: WalletDetailsModalProps) => {
  const activeChainId = useActiveChainId();
  const chains = useSupportedChains();

  const chain = useMemo(() => {
    return chains.find((_chain) => _chain.chainId === activeChainId);
  }, [activeChainId, chains]);

  return (
    <TWModal {...props}>
      <WalletDetailsModalHeader
        address={address}
        onDisconnectPress={onDisconnectPress}
      />
      <View style={styles.currentNetwork}>
        <Text style={styles.currentNetworkText}>Current Network</Text>
      </View>
      <NetworkButton
        chainIconUrl={chain?.icon?.url || ""}
        chainName={chain?.name || ""}
        onPress={onChangeNetworkPress}
      />
    </TWModal>
  );
};

const styles = StyleSheet.create({
  currentNetworkText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
    color: "#646D7A",
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
