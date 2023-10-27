import { useLocale } from "../../../providers/ui-context-provider";
import WalletLoadingThumbnail from "../../../wallets/wallets/wallet-connect/WalletLoadingThumbnail";
import { Box, ImageSvgUri } from "../../base";
import Text from "../../base/Text";
import { ConnectWalletHeader } from "./ConnectingWalletHeader";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export type ConnectingWalletProps = {
  subHeaderText?: string;
  footer?: ReactNode;
  content?: ReactNode;
  onClose: () => void;
  onBackPress: () => void;
  wallet: WalletConfig<any>;
};

export function ConnectingWallet({
  subHeaderText,
  content,
  wallet,
  footer,
  onClose,
  onBackPress,
}: ConnectingWalletProps) {
  const l = useLocale();
  return (
    <Box paddingHorizontal="xl">
      <ConnectWalletHeader
        onBackPress={onBackPress}
        subHeaderText={subHeaderText}
        onClose={onClose}
      />
      <WalletLoadingThumbnail imageSize={85}>
        <ImageSvgUri height={80} width={80} imageUrl={wallet.meta.iconURL} />
      </WalletLoadingThumbnail>
      <View style={styles.connectingContainer}>
        {content ? (
          content
        ) : (
          <>
            <Text variant="header" mt="lg">
              {l.connecting_wallet.connecting_your_wallet}
            </Text>
            <Text variant="bodySmallSecondary" mt="lg" textAlign="center">
              {l.connecting_wallet.connecting_through_pop_up}
            </Text>
          </>
        )}
      </View>
      {footer ? footer : null}
    </Box>
  );
}

const styles = StyleSheet.create({
  connectingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 24,
    marginTop: 18,
  },
});
