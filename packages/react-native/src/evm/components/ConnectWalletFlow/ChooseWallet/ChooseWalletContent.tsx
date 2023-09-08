import { useMemo } from "react";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { Dimensions, ScrollView, View } from "react-native";
import { WalletButton } from "../../base/WalletButton";
import Box from "../../base/Box";
import { useTheme } from "@shopify/restyle";

interface ChooseWalletContentProps {
  wallets: WalletConfig[];
  excludeWalletIds?: string[];
  onChooseWallet: (wallet: WalletConfig, data?: any) => void;
}

const MAX_HEIGHT = Dimensions.get("window").height * 0.4;

export const ChooseWalletContent = ({
  wallets,
  excludeWalletIds,
  onChooseWallet,
}: ChooseWalletContentProps) => {
  const theme = useTheme();

  const walletsToDisplay = useMemo(() => {
    const filteredWallets = wallets.filter(
      (w) => !!!excludeWalletIds?.find((ewId) => ewId === w.id),
    );

    const trueItems = filteredWallets.filter(
      (item) => item.recommended === true,
    );
    const falseItems = filteredWallets.filter(
      (item) => item.recommended !== true,
    );
    const sortedWallets = [...trueItems, ...falseItems];

    return sortedWallets;
  }, [wallets, excludeWalletIds]);

  return (
    <View style={{ flexDirection: "column", maxHeight: MAX_HEIGHT }}>
      <ScrollView
        style={{
          marginVertical: 16,
          paddingHorizontal: 16,
        }}
      >
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
                  recommended={item.recommended}
                  onPress={() => onChooseWallet(item)}
                  mb={marginBottom}
                />
              )}
            </Box>
          );
        })}
      </ScrollView>
    </View>
  );
};
