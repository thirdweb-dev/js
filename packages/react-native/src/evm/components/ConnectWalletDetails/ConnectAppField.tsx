import { useWallet } from "@thirdweb-dev/react-core";
import { IWalletConnectReceiver } from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import DisconnectIcon from "../../assets/disconnect";
import { useTheme } from "@shopify/restyle";
import { TextInput } from "../base/TextInput";
import RightArrowIcon from "../../assets/right-arrow";
import { StyleSheet, View } from "react-native";
import Text from "../base/Text";
import { WalletIcon } from "../base/WalletIcon";
import WalletConnectIcon from "../../assets/wallet-connect";

export const ConnectAppField = () => {
  const theme = useTheme();
  const [showWCInput, setShowWCInput] = useState(false);
  const [wcUri, setWCUri] = useState<string | undefined>();
  const [appMeta, setAppMeta] = useState<{ name: string; iconUrl: string }>();
  const wallet = useWallet();

  const onSmartWalletWCMessage = ({ type }: { type: string }) => {
    if (type === "session_approved") {
      getAppMeta();
    } else if (type === "session_delete") {
      reset();
    }
  };

  const getAppMeta = () => {
    const sessions = (
      wallet as unknown as IWalletConnectReceiver
    ).getActiveSessions();
    if (Object.keys(sessions).length > 0) {
      setAppMeta({
        name: sessions[0].peer.metadata.name,
        iconUrl: sessions[0].peer.metadata.icons[0],
      });
    }
  };

  useEffect(() => {
    if (wallet) {
      wallet.addListener("message", onSmartWalletWCMessage);

      getAppMeta();
    }

    return () => {
      if (wallet) {
        wallet.removeListener("message", onSmartWalletWCMessage);
      }
    };
  }, [wallet]);

  const onConnectDappPress = () => {
    if (appMeta) {
      reset();
      (wallet as unknown as IWalletConnectReceiver).disconnectSession();
    } else {
      setShowWCInput(true);
    }
  };

  const reset = () => {
    setAppMeta(undefined);
    setShowWCInput(false);
  };

  const onAddressChangeText = (text: string) => {
    setWCUri(text);
  };

  const onWCPress = () => {
    if (!wcUri || !wallet) {
      return;
    }

    (wallet as unknown as IWalletConnectReceiver).connectApp(wcUri);
  };

  return (
    <>
      {!appMeta && showWCInput ? (
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
              <WalletConnectIcon width={16} height={16} />
            )}
            <View style={styles.exportWalletInfo}>
              <Text variant="bodySmall">
                {appMeta ? appMeta.name : "Connect app"}
              </Text>
            </View>
          </>
          {appMeta ? (
            <DisconnectIcon
              height={10}
              width={10}
              color={theme.colors.iconPrimary}
            />
          ) : (
            <RightArrowIcon
              height={10}
              width={10}
              color={theme.colors.iconPrimary}
            />
          )}
        </BaseButton>
      )}
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
