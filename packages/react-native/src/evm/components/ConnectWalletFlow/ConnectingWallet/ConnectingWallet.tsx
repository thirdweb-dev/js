import { WalletMeta } from "../../../types/wallet";
import { ModalFooter } from "../../base/modal/ModalFooter";
import { ConnectWalletHeader } from "./ConnectingWalletHeader";
import React, { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export type ConnectingWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  footer?: ReactNode;
  onClose: () => void;
  onBackPress: () => void;
  wallet: WalletMeta;
};

export function ConnectingWallet({
  subHeaderText,
  wallet,
  footer,
  onClose,
  onBackPress,
}: ConnectingWalletProps) {
  return (
    <View>
      <ConnectWalletHeader
        onBackPress={onBackPress}
        walletLogoUrl={wallet.image_url}
        subHeaderText={subHeaderText}
        close={onClose}
      />
      <View style={styles.connectingContainer}>
        <ActivityIndicator size="small" color="#C4C4C4" />
        <Text style={styles.text}>
          Connect your wallet through the {wallet.name} application.
        </Text>
      </View>
      {footer ? (
        footer
      ) : (
        <ModalFooter footer={`Having troubles connecting to ${wallet.name}?`} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "500",
    color: "#646D7A",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.02,
    textAlign: "center",
    marginTop: 18,
  },
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
});
