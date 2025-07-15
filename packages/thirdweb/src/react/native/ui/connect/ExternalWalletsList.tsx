import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import walletInfos from "../../../../wallets/__generated__/wallet-infos.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { createWallet } from "../../../../wallets/native/create-wallet.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useWalletImage, useWalletInfo } from "../../../core/utils/wallet.js";
import { spacing } from "../../design-system/index.js";
import type { ContainerType } from "../components/Header.js";
import { ThemedInput } from "../components/input.js";
import { RNImage } from "../components/RNImage.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { SEARCH_ICON } from "../icons/svgs.js";

type ExternalWalletsUiProps = {
  theme: Theme;
  client: ThirdwebClient;
  connector: (args: {
    wallet: Wallet;
    connectFn: (chain?: Chain) => Promise<Wallet>;
  }) => Promise<void>;
  containerType: ContainerType;
};

export function ExternalWalletsList(
  props: ExternalWalletsUiProps & {
    externalWallets: Wallet[];
    showAllWalletsButton: boolean;
    onShowAllWallets: () => void;
  },
) {
  const { connector, client, theme, externalWallets, onShowAllWallets } = props;
  const connectWallet = (wallet: Wallet) => {
    connector({
      connectFn: async (chain) => {
        await wallet.connect({
          chain,
          client,
        });
        return wallet;
      },
      wallet,
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: props.containerType === "modal" ? spacing.lg : 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: spacing.md,
            paddingBottom: spacing.md,
          }}
        >
          {externalWallets.map((wallet) => (
            <ExternalWalletRow
              connectWallet={connectWallet}
              key={wallet.id}
              theme={theme}
              wallet={wallet}
            />
          ))}
          {props.showAllWalletsButton && (
            <ShowAllWalletsRow onPress={onShowAllWallets} theme={theme} />
          )}
        </View>
      </ScrollView>
      <NewToWallets containerType={props.containerType} theme={props.theme} />
    </View>
  );
}

export function AllWalletsList(
  props: ExternalWalletsUiProps & { externalWallets: Wallet[] },
) {
  const { connector, client, theme, externalWallets } = props;
  const [searchQuery, setSearchQuery] = useState("");

  const walletsToShow = useMemo(() => {
    const filteredWallets = walletInfos
      .filter(
        (info) => !externalWallets.find((wallet) => wallet.id === info.id),
      )
      .filter(
        (info) =>
          info.id !== "inApp" && info.id !== "embedded" && info.id !== "smart",
      )
      .filter((info) => info.hasMobileSupport);

    const fuse = new Fuse(filteredWallets, {
      keys: ["name"],
      threshold: 0.3,
    });

    return searchQuery
      ? fuse.search(searchQuery).map((result) => result.item.id)
      : filteredWallets.map((info) => info.id);
  }, [externalWallets, searchQuery]);

  const connectWallet = (wallet: Wallet) => {
    connector({
      connectFn: async (chain) => {
        await wallet.connect({
          chain,
          client,
        });
        return wallet;
      },
      wallet,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <ThemedInput
          leftView={
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                padding: spacing.sm,
                width: 48,
              }}
            >
              <RNImage
                color={theme.colors.secondaryIconColor}
                data={SEARCH_ICON}
                size={24}
                theme={theme}
              />
            </View>
          }
          onChangeText={setSearchQuery}
          placeholder="Search Wallet"
          theme={theme}
          value={searchQuery}
        />
      </View>
      <Spacer size="md" />
      <FlatList
        data={walletsToShow}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        keyExtractor={(walletId) => walletId}
        renderItem={({ item: walletId }) => (
          <ExternalWalletRow
            connectWallet={connectWallet}
            key={walletId}
            theme={theme}
            wallet={createWallet(walletId as WalletId)}
          />
        )}
        style={{
          flex: 1,
          paddingBottom: spacing.md,
          paddingHorizontal: props.containerType === "modal" ? spacing.lg : 0,
        }}
      />
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
    <TouchableOpacity onPress={() => connectWallet(wallet)} style={styles.row}>
      {imageQuery.data ? (
        <Image
          source={{ uri: imageQuery.data ?? "" }}
          style={{ borderRadius: 6, height: 52, width: 52 }}
        />
      ) : (
        <Skeleton
          style={{
            height: 52,
            width: 52,
          }}
          theme={theme}
        />
      )}
      <ThemedText theme={theme} type="subtitle">
        {infoQuery.data?.name || ""}
      </ThemedText>
    </TouchableOpacity>
  );
}

function ShowAllWalletsRow(props: { theme: Theme; onPress: () => void }) {
  const { theme, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View
        style={{
          alignContent: "space-between",
          backgroundColor: theme.colors.secondaryButtonBg,
          borderColor: theme.colors.borderColor,
          borderRadius: 6,
          borderWidth: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          height: 52,
          justifyContent: "space-between",
          padding: 8,
          width: 52,
        }}
      >
        {[...Array(4)].map((_, index) => (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: only have index as key
            key={index}
            style={{
              backgroundColor: theme.colors.secondaryIconColor,
              borderRadius: 7,
              height: 14,
              width: 14,
            }}
          />
        ))}
      </View>
      <ThemedText theme={theme} type="subtitle">
        Show all wallets
      </ThemedText>
    </TouchableOpacity>
  );
}

function NewToWallets({
  theme,
  containerType,
}: {
  theme: Theme;
  containerType: ContainerType;
}) {
  return (
    <View
      style={[
        styles.row,
        {
          borderColor: theme.colors.borderColor,
          borderTopWidth: 1,
          paddingHorizontal: containerType === "modal" ? spacing.lg : 0,
          paddingVertical: spacing.md,
        },
      ]}
    >
      <ThemedText theme={theme} type="subtext">
        New to wallets?
      </ThemedText>
      <View style={{ flex: 1 }} />
      <ThemedText
        onPress={() =>
          Linking.openURL("https://blog.thirdweb.com/web3-wallet/")
        }
        style={{ color: theme.colors.primaryText }}
        theme={theme}
        type="subtext"
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
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "flex-start",
  },
  searchContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "flex-start",
    paddingHorizontal: spacing.lg,
  },
});
