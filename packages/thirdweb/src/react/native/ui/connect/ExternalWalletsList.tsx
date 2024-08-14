import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useWalletImage, useWalletInfo } from "../../../core/utils/wallet.js";
import { spacing } from "../../design-system/index.js";
import type { ContainerType } from "../components/Header.js";
import { Skeleton } from "../components/Skeleton.js";
import { ThemedText } from "../components/text.js";

export type ExternalWalletsUiProps = {
  theme: Theme;
  client: ThirdwebClient;
  connector: (args: {
    wallet: Wallet;
    connectFn: (chain?: Chain) => Promise<Wallet>;
  }) => Promise<void>;
  containerType: ContainerType;
};

export function ExternalWalletsList(
  props: ExternalWalletsUiProps & { externalWallets: Wallet[] },
) {
  const { connector, client, theme } = props;
  const connectWallet = (wallet: Wallet) => {
    connector({
      wallet,
      connectFn: async (chain) => {
        await wallet.connect({
          client,
          chain,
        });
        return wallet;
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: props.containerType === "modal" ? spacing.lg : 0,
          paddingBottom: spacing.md,
        }}
      >
        <View style={{ flexDirection: "column", gap: spacing.md }}>
          {props.externalWallets.map((wallet) => (
            <ExternalWalletRow
              key={wallet.id}
              wallet={wallet}
              connectWallet={connectWallet}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>
      <NewToWallets theme={props.theme} containerType={props.containerType} />
    </View>
  );
}

function ExternalWalletRow(props: {
  theme: Theme;
  wallet: Wallet;
  connectWallet: (wallet: Wallet) => void;
}) {
  const { wallet, theme, connectWallet } = props;
  const imageQuery = useWalletImage(wallet.id);
  const infoQuery = useWalletInfo(wallet.id);
  return (
    <TouchableOpacity style={styles.row} onPress={() => connectWallet(wallet)}>
      {imageQuery.data ? (
        <Image
          source={{ uri: imageQuery.data ?? "" }}
          style={{ width: 52, height: 52, borderRadius: 6 }}
        />
      ) : (
        <Skeleton
          theme={theme}
          style={{
            width: 52,
            height: 52,
          }}
        />
      )}
      <ThemedText theme={theme} type="subtitle">
        {infoQuery.data?.name || ""}
      </ThemedText>
    </TouchableOpacity>
  );
}

function NewToWallets({
  theme,
  containerType,
}: { theme: Theme; containerType: ContainerType }) {
  return (
    <View
      style={[
        styles.row,
        {
          borderTopWidth: 1,
          borderColor: theme.colors.borderColor,
          paddingVertical: spacing.md,
          paddingHorizontal: containerType === "modal" ? spacing.lg : 0,
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
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
