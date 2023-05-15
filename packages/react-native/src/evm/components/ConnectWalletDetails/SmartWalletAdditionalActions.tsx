import { StyleSheet, View } from "react-native";
import PocketWalletIcon from "../../assets/wallet";
import BaseButton from "../base/BaseButton";
import { WalletIcon } from "../base/WalletIcon";
import { AbstractClientWallet, SmartWallet } from "@thirdweb-dev/wallets";
import { Address } from "../base/Address";
import Text from "../base/Text";
import { usePersonalWalletAddress } from "../../wallets/hooks/usePersonalWalletAddress";
import { LocalWallet } from "../../wallets/wallets/local-wallet";
import { useWalletContext, useWallet } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { useSmartWallet } from "../../providers/context-provider";
import RightArrowIcon from "../../assets/right-arrow";
import { useTheme } from "@shopify/restyle";
import { TextInput } from "../base/TextInput";
import Box from "../base/Box";
import { WCWallet } from "./wc-wallet";

export const SmartWalletAdditionalActions = ({
  onExportPress,
}: {
  onExportPress: () => void;
}) => {
  const personalWalletAddress = usePersonalWalletAddress();
  const { setConnectedWallet } = useWalletContext();
  const [smartWallet, setSmartWallet] = useSmartWallet();
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [showSmartWallet, setShowSmartWallet] = useState(false);
  const activeWallet = useWallet();
  const theme = useTheme();
  const [showWCRow, setShowWCRow] = useState(false);
  const [wcUri, setWCUri] = useState<string | undefined>();
  const [wcWallet, setWcWallet] = useState<WCWallet | undefined>();
  const [appMeta, setAppMeta] = useState<{ name: string; iconUrl: string }>();

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

  const onConnectDappPress = () => {
    setShowWCRow(true);

    const wc = new WCWallet();
    wc.init();

    setWcWallet(wc);
  };

  const onAddressChangeText = (text: string) => {
    setWCUri(text);
  };

  const onWCPress = async () => {
    if (!wcWallet || !wcUri || !smartWallet) {
      return;
    }

    const appMetaP = await wcWallet.pair(smartWallet, wcUri);

    setAppMeta(appMetaP);
  };

  return (
    <>
      <View style={styles.currentNetwork}>
        <Text variant="bodySmallSecondary">
          {showSmartWallet ? "Smart Wallet" : "Personal Wallet"}
        </Text>
      </View>
      <BaseButton
        backgroundColor="background"
        borderColor="border"
        justifyContent="space-between"
        mb="md"
        style={styles.walletDetails}
        onPress={onWalletPress}
      >
        <>
          {wallet?.getMeta().iconURL ? (
            <WalletIcon size={32} iconUri={wallet?.getMeta().iconURL || ""} />
          ) : null}
          <View style={styles.walletInfo}>
            <Address
              variant="bodyLarge"
              address={
                showSmartWallet ? smartWalletAddress : personalWalletAddress
              }
            />
          </View>
        </>
        <RightArrowIcon
          height={10}
          width={10}
          color={theme.colors.iconPrimary}
        />
      </BaseButton>
      {showWCRow && !appMeta ? (
        <Box
          flexDirection="row"
          mb="sm"
          borderColor="border"
          borderWidth={1}
          borderRadius="md"
        >
          <TextInput onChangeText={onAddressChangeText} flex={1} />
          <BaseButton
            onPress={onWCPress}
            justifyContent="center"
            alignItems="center"
          >
            <RightArrowIcon
              height={20}
              width={30}
              color={theme.colors.iconPrimary}
            />
          </BaseButton>
        </Box>
      ) : (
        <BaseButton
          backgroundColor="background"
          borderColor="border"
          mb="sm"
          justifyContent="space-between"
          style={styles.exportWallet}
          onPress={onConnectDappPress}
        >
          <>
            {appMeta ? (
              <WalletIcon size={32} iconUri={appMeta.iconUrl} />
            ) : (
              <PocketWalletIcon size={16} />
            )}
            <View style={styles.exportWalletInfo}>
              <Text variant="bodySmall">
                {appMeta ? appMeta.name : "Connect app"}
              </Text>
            </View>
          </>
          <RightArrowIcon
            height={10}
            width={10}
            color={theme.colors.iconPrimary}
          />
        </BaseButton>
      )}
      {wallet?.walletId === LocalWallet.id ||
      activeWallet?.walletId === LocalWallet.id ? (
        <>
          <BaseButton
            backgroundColor="background"
            borderColor="border"
            mb="sm"
            justifyContent="space-between"
            style={styles.exportWallet}
            onPress={onExportPress}
          >
            <>
              <PocketWalletIcon size={16} />
              <View style={styles.exportWalletInfo}>
                <Text variant="bodySmall">
                  {wallet?.walletId === LocalWallet.id
                    ? "Backup personal wallet"
                    : "Backup wallet"}
                </Text>
              </View>
            </>
            <RightArrowIcon
              height={10}
              width={10}
              color={theme.colors.iconPrimary}
            />
          </BaseButton>
          <Text variant="error">
            {
              "This is a temporary guest wallet. Download a backup if you don't want to lose access to it."
            }
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
