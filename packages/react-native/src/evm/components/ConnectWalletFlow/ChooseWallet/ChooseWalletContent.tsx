import { WalletMeta } from "../../../types/wallet";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import React from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";

interface InitialExplorerContentProps {
  wallets: WalletMeta[];
  onChooseWallet: (wallet: WalletMeta) => void;
}

export const ChooseWalletContent = ({
  wallets,
  onChooseWallet,
}: InitialExplorerContentProps) => {
  return (
    <View style={styles.explorerContainer}>
      <FlatList
        keyExtractor={(item) => item.name}
        data={wallets}
        renderItem={({ item, index }) => {
          const marginBottom = index === wallets.length - 1 ? "none" : "xxs";
          return (
            <BaseButton
              mb={marginBottom}
              style={styles.row}
              backgroundColor="backgroundHighlight"
              onPress={() => onChooseWallet(item)}
            >
              <Image
                alt="wallet logo"
                style={styles.walletImage}
                source={{ uri: item.image_url }}
              />
              <Text variant="bodyLarge">{item.name}</Text>
            </BaseButton>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  walletImage: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
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
