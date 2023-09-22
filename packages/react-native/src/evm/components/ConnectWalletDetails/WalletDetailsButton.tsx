import { AddressDisplay } from "../base/AddressDisplay";
import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import { useWallet } from "@thirdweb-dev/react-core";
import { StyleSheet } from "react-native";
import { LocalWallet } from "@thirdweb-dev/wallets";
import Box from "../base/Box";
import { ConnectWalletDetailsModal } from "./ConnectWalletDetailsModal";
import { useState } from "react";
import { TextBalance } from "../base/TextBalance";
import { SupportedTokens } from "../SendFunds/defaultTokens";

export type ConnectWalletDetailsProps = {
  address?: string;
  detailsButton?: React.FC<{ onPress: () => void }>;
  extraRows?: React.FC;
  hideTestnetFaucet?: boolean;
  /**
   * Override the default supported tokens for each network
   *
   * These tokens will be displayed in "Send Funds" Modal
   */
  supportedTokens: SupportedTokens;

  /**
   * Show balance of ERC20 token instead of the native token  in the "Connected" button when connected to certain network
   *
   * @example
   * ```tsx
   * <ConnectWallet balanceToken={{
   *  1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" // show USDC balance when connected to Ethereum mainnet
   * }} />
   * ```
   */
  displayBalanceToken?: Record<number, string>;
};

export const WalletDetailsButton = ({
  address,
  detailsButton,
  extraRows,
  hideTestnetFaucet,
  supportedTokens,
  displayBalanceToken,
}: ConnectWalletDetailsProps) => {
  const activeWallet = useWallet();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onPress = () => {
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
        supportedTokens={supportedTokens}
        displayBalanceToken={displayBalanceToken}
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
          <Box flex={1} flexDirection="row" justifyContent="flex-start">
            <WalletIcon
              size={32}
              iconUri={activeWallet?.getMeta().iconURL || ""}
            />
            <Box ml="md" justifyContent="center" alignItems="flex-start">
              {activeWallet?.walletId === LocalWallet.id ? (
                <Text variant="bodySmall" color="red">
                  Guest
                </Text>
              ) : (
                <AddressDisplay
                  variant="bodySmall"
                  extraShort={false}
                  address={address}
                />
              )}
              <TextBalance textVariant="bodySmallSecondary" />
            </Box>
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
