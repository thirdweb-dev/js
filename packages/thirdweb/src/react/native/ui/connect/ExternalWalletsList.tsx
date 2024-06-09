import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useConnect } from "../../../core/hooks/wallets/wallet-hooks.js";
import {
  useWalletImage,
  useWalletInfo,
} from "../../../web/ui/hooks/useWalletInfo.js";
import { spacing } from "../../design-system/index.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";

export type ExternalWalletsUiProps = {
  theme: Theme;
  client: ThirdwebClient;
  externalWallets: Wallet[];
};

export function ExternalWalletsList({
  theme,
  client,
  externalWallets,
}: ExternalWalletsUiProps) {
  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1, paddingHorizontal: spacing.lg }}
        data={externalWallets}
        renderItem={(x) => (
          <ExternalWalletRow wallet={x.item} theme={theme} client={client} />
        )}
        keyExtractor={(x) => x.id}
        ItemSeparatorComponent={() => <Spacer size="md" />}
      />
      <NewToWallets theme={theme} />
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

function NewToWallets({ theme }: { theme: Theme }) {
  return (
    <View
      style={[
        styles.row,
        {
          borderTopWidth: 1,
          borderColor: theme.colors.borderColor,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <ThemedText theme={theme} type="subtext">
        New to wallets?
      </ThemedText>
      <View style={{ flex: 1 }} />
      <ThemedText
        type="subtext"
        style={{ color: theme.colors.primaryText }}
        theme={theme}
        onPress={() =>
          Linking.openURL("https://blog.thirdweb.com/web3-wallet/")
        }
      >
        Get started
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
