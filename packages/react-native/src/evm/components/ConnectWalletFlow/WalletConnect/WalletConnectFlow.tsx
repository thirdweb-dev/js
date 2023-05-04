import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { WalletButton } from "../../base/WalletButton";
import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";
import { TW_WC_PROJECT_ID, WC_LINKS } from "../../../constants/walletConnect";
import Text from "../../base/Text";

export type WalletConnectFlowProps = {
  onChooseWallet: (wallet: WCWallet) => void;
  onClose: () => void;
  onBackPress: () => void;
};

type WCWallet = {
  iconURL: string;
  name: string;
  links: {
    native: string;
    universal: string;
  };
};

export function WalletConnectFlow({
  onChooseWallet,
  onClose,
  onBackPress,
}: WalletConnectFlowProps) {
  const [wallets, setWallets] = useState<WCWallet[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchAsync() {
      let response;
      try {
        response = await fetch(
          `https://explorer-api.walletconnect.com/v3/wallets?projectId=${TW_WC_PROJECT_ID}`,
          { signal },
        );
      } catch (err) {
        console.error("Failed to fetch wallets", err);
        setError(`Failed to fetch wallets: ${err}`);
      }

      if (response) {
        const data = await response.json();

        if (data) {
          const walletsB = [];
          const listings = data.listings;
          for (const key in Object.keys(listings)) {
            const listing = listings[key];

            walletsB.push({
              name: listing.name,
              iconURL: listing.image_url.md,
              links: listing.mobile ? listing.mobile : WC_LINKS,
            });
          }

          setWallets(walletsB);
        }
      }
    }

    fetchAsync();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <View>
      <ConnectWalletHeader
        headerText="Choose your Wallet"
        onClose={onClose}
        onBackPress={onBackPress}
      />
      <View style={styles.explorerContainer}>
        <FlatList
          keyExtractor={(item) => item.name}
          data={wallets}
          ListEmptyComponent={
            error ? (
              <Text variant="error"></Text>
            ) : (
              <ActivityIndicator size="small" color="buttonTextColor" />
            )
          }
          renderItem={({ item, index }) => {
            const marginBottom = index === wallets.length - 1 ? "none" : "xxs";
            return (
              <WalletButton
                walletIconUrl={item.iconURL}
                name={item.name}
                onPress={() => onChooseWallet(item)}
                mb={marginBottom}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  explorerContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 25,
  },
});
