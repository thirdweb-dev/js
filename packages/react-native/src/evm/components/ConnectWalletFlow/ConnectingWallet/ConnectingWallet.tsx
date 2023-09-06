import { useAppTheme } from "../../../styles/hooks";
import { Box } from "../../base";
import Text from "../../base/Text";
import { ModalFooter } from "../../base/modal/ModalFooter";
import { ConnectWalletHeader } from "./ConnectingWalletHeader";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { ReactNode } from "react";
import { ActivityIndicator, Linking, StyleSheet, View } from "react-native";

export type ConnectingWalletProps = {
  subHeaderText?: string;
  footer?: ReactNode;
  content?: ReactNode;
  onClose: () => void;
  onBackPress: () => void;
  wallet: WalletConfig;
};

export function ConnectingWallet({
  subHeaderText,
  content,
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
    <Box padding="lg">
      <ConnectWalletHeader
        onBackPress={onBackPress}
        walletLogoUrl={wallet.meta.iconURL}
        subHeaderText={subHeaderText}
        onClose={onClose}
      />
      <View style={styles.connectingContainer}>
        <ActivityIndicator size="small" color={theme.colors.linkPrimary} />
        {content ? (
          content
        ) : (
          <Text variant="bodySmallSecondary" mt="md">
            Connect your wallet through the {wallet.meta.name} application.
          </Text>
        )}
      </View>
      {footer ? (
        footer
      ) : (
        <ModalFooter
          footer={`Having troubles connecting to ${wallet.meta.name}?`}
          onPress={onFooterPress}
        />
      )}
    </Box>
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
