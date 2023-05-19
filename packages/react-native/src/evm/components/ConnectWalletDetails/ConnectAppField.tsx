import { useWallet } from "@thirdweb-dev/react-core";
import {
  IWalletConnectReceiver,
  WCProposal,
  WCRequest,
} from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useState } from "react";
import Box from "../base/Box";
import BaseButton from "../base/BaseButton";
import DisconnectIcon from "../../assets/disconnect";
import { useTheme } from "@shopify/restyle";
import { TextInput } from "../base/TextInput";
import RightArrowIcon from "../../assets/right-arrow";
import { StyleSheet, View } from "react-native";
import Text from "../base/Text";
import PocketWalletIcon from "../../assets/wallet";
import { WalletIcon } from "../base/WalletIcon";
import { SessionProposalModal } from "./SessionProposalModal";
import { SessionRequestModal } from "./SessionRequestModal";

// type AppMeta = { name: string; iconUrl: string };

// type ConnectAppFieldProps = { appMeta?: AppMeta };

export const ConnectAppField = () => {
  const theme = useTheme();
  const [showWCInput, setShowWCInput] = useState(false);
  const [wcUri, setWCUri] = useState<string | undefined>();
  const [appMeta, setAppMeta] = useState<{ name: string; iconUrl: string }>();
  const [sessionProposalData, setSessionProposalData] = useState<
    WCProposal | undefined
  >();
  const [sessionRequestData, setSessionRequestData] = useState<
    WCRequest | undefined
  >();
  const wallet = useWallet();

  const onSmartWalletWCMessage = useCallback(
    ({ type, data }: { type: string; data?: unknown }) => {
      switch (type) {
        case "session_proposal":
          setSessionProposalData(data as WCProposal);
          break;
        case "session_delete":
          reset();
          break;
        case "session_request":
          setSessionRequestData(data as WCRequest);
          break;
        default:
        // method not implemented
      }
    },
    [],
  );

  useEffect(() => {
    if (wallet) {
      wallet.addListener("message", onSmartWalletWCMessage);

      const sessions = (
        wallet as unknown as IWalletConnectReceiver
      ).getActiveSessions();
      console.log("sessions", sessions);
      if (Object.keys(sessions).length > 0) {
        setAppMeta({
          name: sessions[0].peer.metadata.name,
          iconUrl: sessions[0].peer.metadata.icons[0],
        });
      }
    }

    return () => {
      if (wallet) {
        wallet.removeListener("message", onSmartWalletWCMessage);
      }
    };
  }, [onSmartWalletWCMessage, wallet]);

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
    console.log(wcUri);
    console.log(!!wallet);

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
              <PocketWalletIcon size={16} />
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
