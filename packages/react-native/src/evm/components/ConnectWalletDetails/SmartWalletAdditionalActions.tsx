import { StyleSheet, View } from "react-native";
import PocketWalletIcon from "../../assets/wallet";
import BaseButton from "../base/BaseButton";
import { WalletIcon } from "../base/WalletIcon";
import {
  AbstractClientWallet,
  IWalletConnectReceiver,
  SmartWallet,
  walletIds,
} from "@thirdweb-dev/wallets";
import { Address } from "../base/Address";
import Text from "../base/Text";
import { usePersonalWalletAddress } from "../../wallets/hooks/usePersonalWalletAddress";
import { useWalletContext, useWallet } from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { useSmartWallet } from "../../providers/context-provider";
import RightArrowIcon from "../../assets/right-arrow";
import { useTheme } from "@shopify/restyle";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { TextInput } from "../base/TextInput";
import Box from "../base/Box";
import { SessionProposalModal } from "./SessionProposalModal";
import { SessionRequestModal } from "./SessionRequestModal";

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
  const [appMeta, setAppMeta] = useState<{ name: string; iconUrl: string }>();
  const [sessionProposalData, setSessionProposalData] = useState<
    SignClientTypes.EventArguments["session_proposal"] | undefined
  >();
  const [sessionRequestData, setSessionRequestData] = useState<
    | {
        request: SignClientTypes.EventArguments["session_request"];
        session: SessionTypes.Struct;
      }
    | undefined
  >();

  const wallet = showSmartWallet
    ? smartWallet
    : (activeWallet?.getPersonalWallet() as AbstractClientWallet);

  const onSmartWalletWCMessage = ({
    type,
    data,
  }: {
    type: string;
    data?: unknown;
  }) => {
    switch (type) {
      case "session_proposal":
        setSessionProposalData(
          data as SignClientTypes.EventArguments["session_proposal"],
        );
        break;
      case "session_delete":
        setAppMeta(undefined);
        break;
      case "session_request":
        setSessionRequestData(
          data as {
            request: SignClientTypes.EventArguments["session_request"];
            session: SessionTypes.Struct;
          },
        );
        break;
      default:
        // method not implemented
        return;
    }
  };

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

  useEffect(() => {
    if (smartWallet) {
      smartWallet.addListener("message", onSmartWalletWCMessage);

      const sessions = (
        smartWallet as unknown as IWalletConnectReceiver
      ).getActiveSessions();
      console.log("sessions", sessions);
      const keys = Object.keys(sessions);
      if (keys.length > 0) {
        setAppMeta({
          name: sessions[keys[0]].peer.metadata.name,
          iconUrl: sessions[keys[0]].peer.metadata.icons[0],
        });
      }
    }

    return () => {
      if (smartWallet) {
        smartWallet.removeListener("message", onSmartWalletWCMessage);
      }
    };
  }, [smartWallet]);

  const onWalletPress = () => {
    if (!wallet) {
      return;
    }

    setConnectedWallet(wallet);
  };

  const onConnectDappPress = () => {
    setShowWCRow(true);
  };

  const onAddressChangeText = (text: string) => {
    setWCUri(text);
  };

  const onWCPress = () => {
    if (!wcUri || !smartWallet) {
      return;
    }

    smartWallet.connectApp(wcUri);
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
      {!showSmartWallet && smartWallet?.enableConnectApp ? (
        showWCRow && !appMeta ? (
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
        )
      ) : null}
      {sessionProposalData ? (
        <SessionProposalModal
          isVisible={true}
          onApprove={(appName: string, appIconUrl: string) => {
            setAppMeta({ name: appName, iconUrl: appIconUrl });
            setSessionProposalData(undefined);
          }}
          onClose={() => {
            setSessionProposalData(undefined);
          }}
          proposal={sessionProposalData}
        />
      ) : null}
      {sessionRequestData ? (
        <SessionRequestModal
          isVisible={true}
          onClose={() => {
            setSessionRequestData(undefined);
          }}
          requestData={sessionRequestData}
        />
      ) : null}
      {wallet?.walletId === walletIds.localWallet ||
      activeWallet?.walletId === walletIds.localWallet ? (
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
                  {wallet?.walletId === walletIds.localWallet
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
