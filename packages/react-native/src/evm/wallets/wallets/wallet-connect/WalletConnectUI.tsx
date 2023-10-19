import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Box from "../../../components/base/Box";
import Text from "../../../components/base/Text";
import { useDebounceCallback } from "../../../hooks/useDebounceCallback";
import { TWModal } from "../../../components/base/modal/TWModal";
import {
  ConnectUIProps,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { WalletConnect } from "./WalletConnect";
import { WalletConnectButton } from "./WalletConnectButton";
import { ModalHeaderTextClose } from "../../../components/base";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";

type WCWallet = {
  iconURL: string;
  name: string;
  links: {
    native: string;
    universal: string;
  };
};

const DEVICE_WIDTH = Dimensions.get("window").width;
const MODAL_HEIGHT = Dimensions.get("window").height * 0.5;

export function WalletConnectUI({
  connected,
  walletConfig,
  goBack,
  projectId,
}: ConnectUIProps<WalletConnect> & { projectId: string }) {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [wallets, setWallets] = useState<WCWallet[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [searchWallets, setSearchWallets] = useState<WCWallet[]>([]);
  const createWalletInstance = useCreateWalletInstance();
  const setConnectedWallet = useSetConnectedWallet();
  const setConnectionStatus = useSetConnectionStatus();

  const onChangeText = useDebounceCallback({ callback: setSearch });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchAsync() {
      const platformOS =
        Platform.OS.toLowerCase() === "ios" ? "iOS" : "Android";
      let response;
      try {
        response = await fetch(
          `https://explorer-api.walletconnect.com/w3m/v1/get${platformOS}Listings?projectId=${projectId}&chains=eip155:1`,
          { signal },
        );
      } catch (err) {
        console.error("Failed to fetch wallets", err);
        setError(`Failed to fetch wallets: ${err}`);
      }

      if (response?.ok) {
        const data = await response.json();

        if (data) {
          const walletsB = [];
          const listings: {
            [key: string]: {
              name: string;
              image_id: string;
              mobile: {
                native: string;
                universal: string;
              };
            };
          } = data.listings;
          for (const listing of Object.values(listings)) {
            walletsB.push({
              name: listing.name,
              iconURL: `https://explorer-api.walletconnect.com/w3m/v1/getWalletImage/${listing.image_id}?projectId=${projectId}`,
              links: listing.mobile
                ? listing.mobile
                : {
                    native: "wc://",
                    universal: "wc://",
                  },
            });
          }

          setWallets(walletsB);
          setSearchWallets(walletsB);
          setLoading(false);
        }
      }
    }

    fetchAsync();

    return () => {
      abortController.abort();
    };
  }, [projectId]);

  useEffect(() => {
    if (wallets && search) {
      setSearchWallets(
        wallets.filter((w) => {
          return w.name.toLowerCase().includes(search.toLowerCase());
        }),
      );
    } else if (search.length === 0) {
      setSearchWallets(wallets);
    }
  }, [search, wallets]);

  const onChooseWalletItem = (walletMeta: WCWallet) => {
    const wcWallet = createWalletInstance(walletConfig);
    wcWallet.setWCLinks(walletMeta.links);

    setConnectionStatus("connecting");
    wcWallet
      .connect()
      .then(() => {
        setConnectedWallet(wcWallet);
      })
      .catch((e) => {
        setConnectionStatus("disconnected");
        console.error(`Error connecting with WalletConnect: ${e}`);
      })
      .finally(() => {
        connected();
      });
  };

  const onClosePress = () => {
    setConnectionStatus("disconnected");
    connected();
  };

  return (
    <TWModal
      isVisible={true}
      onBackdropPress={onClosePress}
      backdropOpacity={0.7}
    >
      <View
        style={[styles.modal, { backgroundColor: theme.colors.background }]}
      >
        <ModalHeaderTextClose
          onBackPress={goBack}
          headerText="WalletConnect"
          onClose={onClosePress}
          paddingHorizontal="md"
        />
        <View style={styles.explorerContainer}>
          {loading ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <FlatList
              data={searchWallets}
              contentContainerStyle={styles.listContentContainer}
              showsVerticalScrollIndicator={false}
              numColumns={4}
              fadingEdgeLength={20}
              stickyHeaderIndices={[0]}
              ListHeaderComponent={
                <Box backgroundColor="background" mb="sm">
                  <Box
                    borderColor="border"
                    borderWidth={0.5}
                    flex={1}
                    flexDirection="row"
                    borderRadius="md"
                    alignItems="center"
                    marginHorizontal="md"
                    padding="xs"
                  >
                    <TextInput
                      onChangeText={onChangeText}
                      placeholder="Search Wallets"
                      placeholderTextColor={theme.colors.textSecondary}
                      style={{
                        ...styles.textInput,
                        color: theme.colors.textSecondary,
                        fontFamily: theme.textVariants.defaults.fontFamily,
                      }}
                    />
                  </Box>
                </Box>
              }
              ListEmptyComponent={
                error ? (
                  <Text variant="error">{error}</Text>
                ) : (
                  <View
                    style={[
                      styles.emptyContainer,
                      { height: Math.round(MODAL_HEIGHT) },
                    ]}
                  >
                    <Text variant="bodySmall">
                      {l.wallet_connect.no_results_found}
                    </Text>
                  </View>
                )
              }
              renderItem={({ item }) => (
                <WalletConnectButton item={item} onPress={onChooseWalletItem} />
              )}
            />
          )}
        </View>
      </View>
    </TWModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: DEVICE_WIDTH,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  listContentContainer: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    margin: 0,
    fontSize: 16,
    fontWeight: "500",
    padding: 2,
    flex: 1,
  },
  explorerContainer: {
    display: "flex",
    height: MODAL_HEIGHT,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
});
