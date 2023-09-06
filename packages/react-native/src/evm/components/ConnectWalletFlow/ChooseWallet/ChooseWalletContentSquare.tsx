import { useMemo } from "react";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { FlatList, Dimensions } from "react-native";
import Box from "../../base/Box";
import { useTheme } from "@shopify/restyle";
import { WalletButtonSquare } from "../../base/WalletButtonSquare";
import Text from "../../base/Text";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.4;
const NUM_COLUMNS = 3;
const TILE_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

interface ChooseWalletContentProps {
  wallets: WalletConfig[];
  excludeWalletIds?: string[];
  onChooseWallet: (wallet: WalletConfig, data?: any) => void;
}

export const ChooseWalletContentSquare = ({
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
    <Box marginTop="sm" flexDirection="column">
      {walletsToDisplay.map((wallet) => {
        if (!wallet.selectUI) {
          return null;
        }

        return (
          <Box
            key={wallet.id}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="sm"
          >
            <wallet.selectUI
              theme={theme}
              supportedWallets={wallets}
              onSelect={(data) => {
                onChooseWallet(wallet, data);
              }}
              walletConfig={wallet}
            />
          </Box>
        );
      })}
      <FlatList
        keyExtractor={(item) => item.meta.name}
        data={walletsToDisplay}
        numColumns={NUM_COLUMNS}
        style={{ maxHeight: MAX_HEIGHT }}
        fadingEdgeLength={10}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return !item.selectUI ? (
            <WalletButtonSquare
              walletIconUrl={item.meta.iconURL}
              name={item.meta.name}
              size={TILE_SIZE}
              onPress={() => onChooseWallet(item)}
            />
          ) : null;
        }}
      />
      <Box
        height={60}
        borderTopColor="border"
        borderTopWidth={1}
        borderBottomColor="border"
        borderBottomWidth={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text variant="bodySmall">New to wallets?</Text>
        <Text variant="link">Get started</Text>
      </Box>
    </Box>
  );
};
