import { AddressDisplay } from "../base/AddressDisplay";
import BaseButton from "../base/BaseButton";
import { ChainIcon } from "../base/ChainIcon";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { useWallet, useChain } from "@thirdweb-dev/react-core";
import { StyleSheet, View } from "react-native";
import { LocalWallet } from "@thirdweb-dev/wallets";
import Box from "../base/Box";
import { ConnectWalletDetailsModal } from "./ConnectWalletDetailsModal";
import { useState } from "react";
import { TextBalance } from "../base/TextBalance";

export type ConnectWalletDetailsProps = {
  address?: string;
  detailsButton?: React.FC<{ onPress: () => void }>;
  extraRows?: React.FC;
  hideTestnetFaucet?: boolean;
};

export const WalletDetailsButton = ({
  address,
  detailsButton,
  extraRows,
  hideTestnetFaucet,
}: ConnectWalletDetailsProps) => {
  const activeWallet = useWallet();
  const chain = useChain();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onPress = () => {
    // setModalState({
    //   view: "WalletDetails",
    //   data: {
    //     address: address,
    //   },
    //   isOpen: true,
    //   isSheet: true,
    //   caller: "ConnectWalletDetails",
    // });
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <ConnectWalletDetailsModal
        isVisible={isModalVisible}
        onClosePress={onPress}
        extraRows={extraRows}
        address={address}
        hideTestnetFaucet={hideTestnetFaucet}
      />
      {detailsButton ? (
        detailsButton({ onPress })
      ) : (
        <BaseButton
          backgroundColor="background"
          borderColor="border"
          style={styles.walletDetails}
          onPress={onPress}
        >
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <View>
              <ChainIcon size={32} chainIconUrl={chain?.icon?.url} />
            </View>
            <Box justifyContent="center" alignItems="flex-start">
              <TextBalance textVariant="bodySmall" />
              {activeWallet?.walletId === LocalWallet.id ? (
                <Text variant="error">Guest</Text>
              ) : (
                <AddressDisplay
                  variant="bodySmallSecondary"
                  extraShort={false}
                  address={address}
                />
              )}
            </Box>
            <View>
              <WalletIcon
                size={32}
                iconUri={activeWallet?.getMeta().iconURL || ""}
              />
            </View>
          </Box>
        </BaseButton>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  walletDetails: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    minWidth: 200,
  },
});
