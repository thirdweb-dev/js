import { StyleSheet, View } from "react-native";
import PocketWalletIcon from "../../assets/wallet";
import BaseButton from "../base/BaseButton";
import { WalletIcon } from "../base/WalletIcon";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { Address } from "../base/Address";
import Text from "../base/Text";
import { usePersonalWalletAddress } from "../../wallets/hooks/usePersonalWalletAddress";
import { LocalWallet } from "../../wallets/wallets/local-wallet";

export const SmartWalletAdditionalActions = ({
  personalWallet,
  onExportPress,
}: {
  personalWallet: AbstractClientWallet;
  onExportPress: () => void;
}) => {
  const personalWalletAddress = usePersonalWalletAddress();

  return (
    <>
      <View style={styles.currentNetwork}>
        <Text variant="bodySmallSecondary">Personal Wallet</Text>
      </View>
      <BaseButton
        backgroundColor="background"
        borderColor="border"
        mb="md"
        style={styles.walletDetails}
        onPress={() => {}}
      >
        {personalWallet?.getMeta().iconURL ? (
          <WalletIcon
            size={32}
            iconUri={personalWallet?.getMeta().iconURL || ""}
          />
        ) : null}
        <View style={styles.walletInfo}>
          {personalWalletAddress ? (
            <Address variant="bodyLarge" address={personalWalletAddress} />
          ) : null}
        </View>
      </BaseButton>
      {personalWallet?.walletId === LocalWallet.id ? (
        <BaseButton
          backgroundColor="background"
          borderColor="border"
          mb="sm"
          style={styles.exportWallet}
          onPress={onExportPress}
        >
          <PocketWalletIcon size={16} />
          <View style={styles.exportWalletInfo}>
            <Text variant="bodySmall">Export personal wallet</Text>
          </View>
        </BaseButton>
      ) : null}
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
    marginLeft: 15,
  },
  exportWalletInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    marginLeft: 8,
  },
  exportWallet: {
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
  currentNetwork: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 24,
    marginBottom: 8,
  },
});
