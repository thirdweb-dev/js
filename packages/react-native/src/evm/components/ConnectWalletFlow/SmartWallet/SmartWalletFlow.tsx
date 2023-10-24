import { useCallback, useEffect, useState } from "react";
import {
  ConnectUIProps,
  WalletConfig,
  WalletInstance,
  useConnect,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import { SmartWallet } from "@thirdweb-dev/wallets";
import WalletLoadingThumbnail from "../../../wallets/wallets/wallet-connect/WalletLoadingThumbnail";
import ImageSvgUri from "../../base/ImageSvgUri";
import Box from "../../base/Box";
import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";

export const SmartWalletFlow = ({
  connected,
  goBack,
  walletConfig,
  personalWalletConfig,
  ...props
}: ConnectUIProps<SmartWallet> & { personalWalletConfig: WalletConfig }) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [connectedPersonalWallet, setConnectedPersonalWallet] =
    useState<WalletInstance>();
  const [personalWalletChainId, setPersonalWalletChaindId] = useState<
    number | undefined
  >();
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const createWalletInstance = useCreateWalletInstance();
  const connect = useConnect();
  const targetChain = useWalletContext().activeChain;

  const mismatch = personalWalletChainId
    ? personalWalletChainId !== targetChain.chainId
    : false;

  const PersonalWalletConfigUI = personalWalletConfig.connectUI;

  const connectSmartWallet = useCallback(
    async (personalWallet: WalletInstance) => {
      const eoaWalletChainId = await personalWallet.getChainId();

      if (eoaWalletChainId === targetChain.chainId) {
        await connect(walletConfig, {
          personalWallet: personalWallet,
        });
        connected();
      } else {
        setPersonalWalletChaindId(eoaWalletChainId);
      }
    },
    [connected, connect, targetChain.chainId, walletConfig],
  );

  const connectPersonalWallet = useCallback(
    async (wallet: WalletConfig) => {
      const walletInstance = createWalletInstance(wallet);
      await walletInstance.connect();

      setConnectedPersonalWallet(walletInstance);

      connectSmartWallet(walletInstance);
    },
    [connectSmartWallet, createWalletInstance],
  );

  useEffect(() => {
    if (walletConfig.personalWallets?.[0] && !PersonalWalletConfigUI) {
      connectPersonalWallet(walletConfig.personalWallets[0]);
    }
  }, [
    PersonalWalletConfigUI,
    connectPersonalWallet,
    walletConfig.personalWallets,
  ]);

  const onConnectingClosePress = () => {
    connectedPersonalWallet?.disconnect();
    reset();
    connected();
  };

  const onConnectingBackPress = () => {
    connectedPersonalWallet?.disconnect();
    reset();
    goBack();
  };

  const onSwitchNetworkPress = async () => {
    if (connectedPersonalWallet) {
      setSwitchingNetwork(true);
      await connectedPersonalWallet?.switchChain(targetChain.chainId);
      setSwitchingNetwork(false);
      setPersonalWalletChaindId(targetChain.chainId);
      connectSmartWallet(connectedPersonalWallet);
    }
  };

  const reset = () => {
    setConnectedPersonalWallet(undefined);
    setPersonalWalletChaindId(undefined);
  };

  const onPersonalWalletConnected = useCallback(
    (walletInstance: WalletInstance) => {
      setConnectedPersonalWallet(walletInstance);
      connectSmartWallet(walletInstance);
    },
    [connectSmartWallet],
  );

  return (
    <>
      {PersonalWalletConfigUI && !connectedPersonalWallet ? (
        <PersonalWalletConfigUI
          {...props}
          connected={connected}
          goBack={goBack}
          walletConfig={personalWalletConfig}
          onLocallyConnected={onPersonalWalletConnected}
        />
      ) : (
        <Box paddingHorizontal="xl">
          <ConnectWalletHeader
            subHeaderText=""
            onBackPress={onConnectingBackPress}
            onClose={onConnectingClosePress}
          />
          <WalletLoadingThumbnail imageSize={85}>
            <ImageSvgUri
              height={80}
              width={80}
              imageUrl={walletConfig.meta.iconURL}
            />
          </WalletLoadingThumbnail>
          <View style={styles.connectingContainer}>
            <>
              <Text variant="header" mt="lg" textAlign="center">
                {mismatch
                  ? l.smart_wallet.network_mismatch
                  : `${l.smart_wallet.connecting} ...`}
              </Text>
              {mismatch ? (
                <Text variant="bodySmallSecondary" mt="lg" textAlign="center">
                  {l.connect_wallet_details.network_mismatch}
                </Text>
              ) : null}
            </>
          </View>
        </Box>
      )}

      {mismatch === true ? (
        <BaseButton
          marginVertical="sm"
          mt="md"
          marginHorizontal="xl"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="md"
          paddingVertical="sm"
          borderRadius="sm"
          backgroundColor="backgroundHighlight"
          onPress={onSwitchNetworkPress}
        >
          {switchingNetwork ? (
            <ActivityIndicator size="small" color={theme.colors.textPrimary} />
          ) : (
            <Text variant="bodyLarge" textAlign="center">
              {l.common.switch_network}
            </Text>
          )}
        </BaseButton>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  connectingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 24,
    marginTop: 18,
  },
});
