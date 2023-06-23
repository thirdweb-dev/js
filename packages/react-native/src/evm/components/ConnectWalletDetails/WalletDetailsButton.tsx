import { AddressDisplay } from "../base/AddressDisplay";
import BaseButton from "../base/BaseButton";
import { ChainIcon } from "../base/ChainIcon";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { useWallet, useBalance } from "@thirdweb-dev/react-core";
import { useActiveChain } from "@thirdweb-dev/react-core/evm";
import { StyleSheet } from "react-native";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { useModalState } from "../../providers/ui-context-provider";
import Box from "../base/Box";

export type ConnectWalletDetailsProps = {
  address: string;
  detailsButton?: React.ReactElement;
};

export const WalletDetailsButton = ({
  address,
  detailsButton,
}: ConnectWalletDetailsProps) => {
  const activeWallet = useWallet();
  const chain = useActiveChain();
  const balanceQuery = useBalance();
  const { setModalState } = useModalState();

  const onPress = () => {
    setModalState({
      view: "WalletDetails",
      data: {
        address: address,
      },
      isOpen: true,
      isSheet: true,
      caller: "ConnectWalletDetails",
    });
  };

  return (
    <>
      <BaseButton
        backgroundColor="background"
        borderColor="border"
        style={styles.walletDetails}
        onPress={onPress}
      >
        {detailsButton ? (
          detailsButton
        ) : (
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <ChainIcon size={32} chainIconUrl={chain?.icon?.url} />
            <Box justifyContent="center" alignItems="flex-start">
              <Text variant="bodySmall">
                {balanceQuery.data
                  ? Number(balanceQuery.data.displayValue).toFixed(3)
                  : ""}{" "}
                {balanceQuery.data?.symbol}
              </Text>
              {activeWallet?.walletId === LocalWallet.id ? (
                <Text variant="error">Guest</Text>
              ) : (
                <AddressDisplay
                  variant="bodySmallSecondary"
                  address={address}
                />
              )}
            </Box>
            <WalletIcon
              size={32}
              iconUri={activeWallet?.getMeta().iconURL || ""}
            />
          </Box>
        )}
      </BaseButton>
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
