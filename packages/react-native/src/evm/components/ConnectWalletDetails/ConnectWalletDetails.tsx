import { Address } from "../base/Address";
import BaseButton from "../base/BaseButton";
import { ChainIcon } from "../base/ChainIcon";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { useWallet, useBalance } from "@thirdweb-dev/react-core";
import { useActiveChain } from "@thirdweb-dev/react-core/evm";
import { StyleSheet, View } from "react-native";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { useModalState } from "../../providers/ui-context-provider";

export type ConnectWalletDetailsProps = {
  address: string;
  detailsButton?: React.ReactElement;
};

export const ConnectWalletDetails = ({
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
          <>
            <ChainIcon size={32} chainIconUrl={chain?.icon?.url} />
            <View style={styles.walletInfo}>
              <Text variant="bodySmall">
                {balanceQuery.data?.displayValue.slice(0, 5)}{" "}
                {balanceQuery.data?.symbol}
              </Text>
              {activeWallet?.walletId === LocalWallet.id ? (
                <Text variant="error">Guest</Text>
              ) : (
                <Address variant="bodySmallSecondary" address={address} />
              )}
            </View>
            <WalletIcon
              size={32}
              iconUri={activeWallet?.getMeta().iconURL || ""}
            />
          </>
        )}
      </BaseButton>
    </>
  );
};

const styles = StyleSheet.create({
  walletInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    marginLeft: 5,
  },
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
