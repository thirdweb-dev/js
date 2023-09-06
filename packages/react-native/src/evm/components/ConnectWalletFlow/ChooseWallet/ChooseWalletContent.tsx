import { useMemo } from "react";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { StyleSheet, View, ScrollView } from "react-native";
import { WalletButton } from "../../base/WalletButton";
import Box from "../../base/Box";
import { useTheme } from "@shopify/restyle";

interface ChooseWalletContentProps {
  wallets: WalletConfig[];
  excludeWalletIds?: string[];
  onChooseWallet: (wallet: WalletConfig, data?: any) => void;
}

export const ChooseWalletContent = ({
  wallets,
  excludeWalletIds,
  onChooseWallet,
}: ChooseWalletContentProps) => {
  const walletsToDisplay = useMemo(() => {
    return wallets.filter(
      (w) => !!!excludeWalletIds?.find((ewId) => ewId === w.id),
    );
  }, [wallets, excludeWalletIds]);
  const theme = useTheme();

  return (
    <View style={styles.explorerContainer}>
      <ScrollView>
        {walletsToDisplay.map((item, index) => {
          const marginBottom =
            index === walletsToDisplay.length - 1 ? "none" : "xxs";
          return (
            <Box key={item.id}>
              {item.selectUI ? (
                <Box
                  mb={marginBottom}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="sm"
                >
                  <item.selectUI
                    theme={theme}
                    supportedWallets={wallets}
                    onSelect={(data) => {
                      onChooseWallet(item, data);
                    }}
                    walletConfig={item}
                  />
                </Box>
              ) : (
                <WalletButton
                  walletIconUrl={item.meta.iconURL}
                  name={item.meta.name}
                  onPress={() => onChooseWallet(item)}
                  mb={marginBottom}
                />
              )}
            </Box>
          );
        })}
      </ScrollView>
      {/* <FlatList
        keyExtractor={(item) => item.meta.name}
        data={walletsToDisplay}
        style={{ width: "100%" }}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item, index }) => {
          const marginBottom =
            index === walletsToDisplay.length - 1 ? "none" : "xxs";

          return (
            <>
              {item.selectUI ? (
                <Box
                  mb={marginBottom}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="sm"
                >
                  <item.selectUI
                    theme={theme}
                    supportedWallets={wallets}
                    onSelect={(data) => {
                      onChooseWallet(item, data);
                    }}
                    walletConfig={item}
                  />
                </Box>
              ) : (
                <WalletButton
                  walletIconUrl={item.meta.iconURL}
                  name={item.meta.name}
                  onPress={() => onChooseWallet(item)}
                  mb={marginBottom}
                />
              )}
            </>
          );
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  explorerContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    paddingHorizontal: 32,
  },
});
