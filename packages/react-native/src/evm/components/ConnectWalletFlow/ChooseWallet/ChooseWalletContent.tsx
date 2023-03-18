import BaseButton from "../../base/BaseButton";
import ImageSvgUri from "../../base/ImageSvgUri";
import Text from "../../base/Text";
import { SupportedWallet } from "@thirdweb-dev/react-core";
import { StyleSheet, View, FlatList } from "react-native";

interface InitialExplorerContentProps {
  wallets: SupportedWallet[];
  onChooseWallet: (wallet: SupportedWallet) => void;
}

export const ChooseWalletContent = ({
  wallets,
  onChooseWallet,
}: InitialExplorerContentProps) => {
  return (
    <View style={styles.explorerContainer}>
      <FlatList
        keyExtractor={(item) => item.meta.name}
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
              <View style={styles.imageView}>
                <ImageSvgUri
                  imageUrl={item.meta.iconURL}
                  width={32}
                  height={32}
                />
              </View>
              <Text variant="bodyLarge">{item.meta.name}</Text>
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
  imageView: {
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
