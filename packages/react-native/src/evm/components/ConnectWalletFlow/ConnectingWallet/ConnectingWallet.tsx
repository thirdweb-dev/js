import { useAppTheme } from "../../../styles/hooks";
import Text from "../../base/Text";
import { ModalFooter } from "../../base/modal/ModalFooter";
import { ConnectWalletHeader } from "./ConnectingWalletHeader";
import { ReactNode } from "react";
import { ActivityIndicator, Linking, StyleSheet, View } from "react-native";
import { SupportedWallet } from "@thirdweb-dev/react-core";

export type ConnectingWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  footer?: ReactNode;
  onClose: () => void;
  onBackPress: () => void;
  wallet: SupportedWallet;
};

export function ConnectingWallet({
  subHeaderText,
  wallet,
  footer,
  onClose,
  onBackPress,
}: ConnectingWalletProps) {
  const theme = useAppTheme();

  const onFooterPress = () => {
    Linking.openURL("https://support.thirdweb.com/");
  };

  return (
    <View>
      <ConnectWalletHeader
        onBackPress={onBackPress}
        walletLogoUrl={wallet.meta.iconURL}
        subHeaderText={subHeaderText}
        close={onClose}
      />
      <View style={styles.connectingContainer}>
        <ActivityIndicator size="small" color={theme.colors.linkPrimary} />
        <Text variant="bodySmallSecondary" mt="md">
          Connect your wallet through the {wallet.meta.name} application.
        </Text>
      </View>
      {footer ? (
        footer
      ) : (
        <ModalFooter
          footer={`Having troubles connecting to ${wallet.meta.name}?`}
          onPress={onFooterPress}
        />
      )}
    </View>
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
});
