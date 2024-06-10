import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { useConnect } from "../../../core/hooks/wallets/wallet-hooks.js";
import {
  useWalletImage,
  useWalletInfo,
} from "../../../web/ui/hooks/useWalletInfo.js";
import { spacing } from "../../design-system/index.js";
import { ThemedText } from "../components/text.js";

export type ExternalWalletsUiProps = {
  theme: Theme;
  client: ThirdwebClient;
  connectMutation: ReturnType<typeof useConnect>;
  containerType: "modal" | "embed";
};

export function ExternalWalletsList(
  props: ExternalWalletsUiProps & { externalWallets: Wallet[] },
) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: props.containerType === "modal" ? spacing.lg : 0,
        }}
      >
        <View style={{ flexDirection: "column", gap: spacing.md }}>
          {props.externalWallets.map((wallet) => (
            <ExternalWalletRow key={wallet.id} wallet={wallet} {...props} />
          ))}
        </View>
      </ScrollView>
      <NewToWallets theme={props.theme} />
    </View>
  );
}

function ExternalWalletRow(props: ExternalWalletsUiProps & { wallet: Wallet }) {
  const { wallet, theme, client, connectMutation } = props;
  const imageQuery = useWalletImage(wallet.id);
  const infoQuery = useWalletInfo(wallet.id);

  const connectWallet = () => {
    connectMutation.connect(async () => {
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
