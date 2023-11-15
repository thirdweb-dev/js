import { StyleSheet, View } from "react-native";
import PocketWalletIcon from "../../assets/wallet";
import BaseButton from "../base/BaseButton";
import {
  AbstractClientWallet,
  SmartWallet,
  walletIds,
} from "@thirdweb-dev/wallets";
import Text from "../base/Text";
import { useWalletContext, useWallet } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { useSmartWallet } from "../../providers/context-provider";
import RightArrowIcon from "../../assets/right-arrow";
import DisconnectIcon from "../../assets/disconnect";
import { IconTextButton } from "../base/IconTextButton";
import { useGlobalTheme, useLocale } from "../../providers/ui-context-provider";

export const SmartWalletAdditionalActions = ({
  onExportPress,
  hideSwitchToPersonalWallet,
}: {
  onExportPress: () => void;
  hideSwitchToPersonalWallet?: boolean;
}) => {
  const l = useLocale();
  const { setConnectedWallet } = useWalletContext();
  const [smartWallet, setSmartWallet] = useSmartWallet();
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [showSmartWallet, setShowSmartWallet] = useState(false);
  const activeWallet = useWallet();
  const theme = useGlobalTheme();

  const wallet = showSmartWallet
    ? smartWallet
    : (activeWallet?.getPersonalWallet() as AbstractClientWallet);

  useEffect(() => {
    if (activeWallet?.walletId === SmartWallet.id) {
      setSmartWallet?.(activeWallet as SmartWallet);
      setShowSmartWallet(false);
    } else {
      setShowSmartWallet(true);
    }
  }, [activeWallet, activeWallet?.walletId, setSmartWallet]);

  useEffect(() => {
    (async () => {
      if (smartWallet && !smartWalletAddress) {
        const addr = await smartWallet.getAddress();
        setSmartWalletAddress(addr);
      }
    })();
  }, [smartWallet, smartWalletAddress]);

  const onWalletPress = () => {
    if (!wallet) {
      return;
    }

    setConnectedWallet(wallet);
  };

  return (
    <>
      {(showSmartWallet || !hideSwitchToPersonalWallet) && (
        <IconTextButton
          mt="xs"
          text={
            showSmartWallet
              ? l.smart_wallet.switch_to_smart
              : l.smart_wallet.switch_to_personal
          }
          icon={
            <DisconnectIcon
              width={14}
              height={14}
              color={theme.colors.iconPrimary}
            />
          }
          onPress={onWalletPress}
        />
      )}
      {wallet?.walletId === walletIds.localWallet ||
      activeWallet?.walletId === walletIds.localWallet ? (
        <>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            borderRadius="lg"
            borderWidth={0.5}
            mb="sm"
            mt="xs"
            justifyContent="space-between"
            style={styles.exportWallet}
            onPress={onExportPress}
          >
            <>
              <PocketWalletIcon width={16} height={16} />
              <View style={styles.exportWalletInfo}>
                <Text variant="bodySmall">
                  {wallet?.walletId === walletIds.localWallet
                    ? l.connect_wallet_details.backup_personal_wallet
                    : l.connect_wallet_details.backup_wallet}
                </Text>
              </View>
            </>
            <RightArrowIcon
              height={10}
              width={10}
              color={theme.colors.iconPrimary}
            />
          </BaseButton>
          <Text variant="error" textAlign="left" mb="sm">
            {l.local_wallet.this_is_a_temporary_wallet}
          </Text>
        </>
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
