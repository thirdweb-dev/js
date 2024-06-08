import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useConnect } from "../../../core/hooks/wallets/wallet-hooks.js";
import {
  useWalletImage,
  useWalletInfo,
} from "../../../web/ui/hooks/useWalletInfo.js";
import { spacing } from "../../design-system/index.js";
import { ThemedText } from "../components/text.js";

export type ExternalWalletsUiProps = {
  theme: Theme;
  client: ThirdwebClient;
  externalWallets: Wallet[];
};

export function ExternalWalletsUI({
  theme,
  client,
  externalWallets,
}: ExternalWalletsUiProps) {
  return (
    <View style={styles.container}>
      {externalWallets.map((wallet) => (
        <ExternalWalletRow
          key={wallet.id}
          wallet={wallet}
          theme={theme}
          client={client}
        />
      ))}
    </View>
  );
}

function ExternalWalletRow({
  wallet,
  theme,
  client,
}: { client: ThirdwebClient; theme: Theme; wallet: Wallet }) {
  const imageQuery = useWalletImage(wallet.id);
  const infoQuery = useWalletInfo(wallet.id);
  const { connect } = useConnect(); // TODO pass account abstraction flag

  const connectWallet = () => {
    connect(async () => {
      await wallet.connect({
        client,
      });
      return wallet;
    });
  };

  return (
    imageQuery.data &&
    infoQuery.data && (
      <TouchableOpacity style={styles.row} onPress={connectWallet}>
        <Image
          source={{ uri: imageQuery.data ?? "" }}
          style={{ width: 52, height: 52, borderRadius: 6 }}
        />
        <ThemedText theme={theme} type="subtitle">
          {infoQuery.data.name}
        </ThemedText>
      </TouchableOpacity>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
