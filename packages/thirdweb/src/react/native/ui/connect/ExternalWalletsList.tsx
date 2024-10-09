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
import { RNImage } from "../components/RNImage.js";
import { Skeleton } from "../components/Skeleton.js";
import { ThemedInput } from "../components/input.js";
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
              key={wallet.id}
              wallet={wallet}
              connectWallet={connectWallet}
              theme={theme}
            />
          ))}
          {props.showAllWalletsButton && (
            <ShowAllWalletsRow theme={theme} onPress={onShowAllWallets} />
          )}
        </View>
      </ScrollView>
      <NewToWallets theme={props.theme} containerType={props.containerType} />
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
      <View style={styles.searchContainer}>
        <ThemedInput
          theme={theme}
          leftView={
            <View
              style={{
                padding: spacing.sm,
                width: 48,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <RNImage
                data={SEARCH_ICON}
                size={24}
                theme={theme}
                color={theme.colors.secondaryIconColor}
              />
            </View>
          }
          placeholder="Search Wallet"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Spacer size="md" />
      <FlatList
        style={{
          flex: 1,
          paddingHorizontal: props.containerType === "modal" ? spacing.lg : 0,
          paddingBottom: spacing.md,
        }}
        data={walletsToShow}
        renderItem={({ item: walletId }) => (
          <ExternalWalletRow
            key={walletId}
            wallet={createWallet(walletId as WalletId)}
            connectWallet={connectWallet}
            theme={theme}
          />
        )}
        keyExtractor={(walletId) => walletId}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
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

function ShowAllWalletsRow(props: {
  theme: Theme;
  onPress: () => void;
}) {
  const { theme, onPress } = props;
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View
        style={{
          width: 52,
          height: 52,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignContent: "space-between",
          backgroundColor: theme.colors.secondaryButtonBg,
          borderColor: theme.colors.borderColor,
          borderWidth: 1,
          padding: 8,
          borderRadius: 6,
        }}
      >
        {[...Array(4)].map((_, index) => (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: only have index as key
            key={index}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: theme.colors.secondaryIconColor,
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
  searchContainer: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
});
