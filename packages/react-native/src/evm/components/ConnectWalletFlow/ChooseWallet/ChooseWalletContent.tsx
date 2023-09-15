import { useMemo } from "react";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { StyleSheet, View, FlatList } from "react-native";
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
      <FlatList
        keyExtractor={(item) => item.meta.name}
        data={walletsToDisplay}
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
                    modalSize="compact"
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
      />
    </View>
  );
};

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
