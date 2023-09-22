import { useCallback, useEffect, useState } from "react";
import {
  ConnectUIProps,
  WalletConfig,
  WalletInstance,
  useConnect,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { StyleSheet, View } from "react-native";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import { SmartWallet } from "@thirdweb-dev/wallets";
import WalletLoadingThumbnail from "../../../wallets/wallets/wallet-connect/WalletLoadingThumbnail";
import ImageSvgUri from "../../base/ImageSvgUri";
import Box from "../../base/Box";
import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";

export const SmartWalletFlow = ({
  close,
  goBack,
  walletConfig,
}: ConnectUIProps<SmartWallet>) => {
  const [connectedPersonalWallet, setConnectedPersonalWallet] =
    useState<WalletInstance>();
  const [personalWalletChainId, setPersonalWalletChaindId] = useState<
    number | undefined
  >();
  const createWalletInstance = useCreateWalletInstance();
  const connect = useConnect();
  const targetChain = useWalletContext().activeChain;

  console.log("walletConfig", personalWalletChainId);
  const mismatch = personalWalletChainId
    ? personalWalletChainId !== targetChain.chainId
    : false;

  const connectSmartWallet = useCallback(
    async (personalWallet: WalletInstance) => {
      const eoaWalletChainId = await personalWallet.getChainId();

      if (eoaWalletChainId === targetChain.chainId) {
        await connect(walletConfig, {
          personalWallet: personalWallet,
        });
        close();
      } else {
        setPersonalWalletChaindId(eoaWalletChainId);
      }
    },
    [close, connect, targetChain.chainId, walletConfig],
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
    if (walletConfig.personalWallets?.[0]) {
      connectPersonalWallet(walletConfig.personalWallets[0]);
    }
  }, [connectPersonalWallet, walletConfig.personalWallets]);

  const onConnectingClosePress = () => {
    connectedPersonalWallet?.disconnect();
    reset();
    close();
  };

  const onConnectingBackPress = () => {
    connectedPersonalWallet?.disconnect();
    reset();
    goBack();
  };

  const onSwitchNetworkPress = async () => {
    await connectedPersonalWallet?.switchChain(targetChain.chainId);
    setPersonalWalletChaindId(targetChain.chainId);
  };

  const reset = () => {
    setConnectedPersonalWallet(undefined);
    setPersonalWalletChaindId(undefined);
  };

  return (
    <>
      <Box paddingHorizontal="xl">
        <ConnectWalletHeader
          subHeaderText=""
          onBackPress={onConnectingBackPress}
          onClose={onConnectingClosePress}
        />
        <WalletLoadingThumbnail imageSize={100}>
          <ImageSvgUri
            height={80}
            width={80}
            imageUrl={walletConfig.meta.iconURL}
          />
        </WalletLoadingThumbnail>
        <View style={styles.connectingContainer}>
          <>
            <Text variant="header" mt="lg">
              {mismatch
                ? "Network Mismatch"
                : `Connecting ${walletConfig.meta.name}`}
            </Text>
            {mismatch ? (
              <Text variant="bodySmallSecondary" mt="lg" textAlign="center">
                {
                  "There's a network mismatch between your contract and your wallet"
                }
              </Text>
            ) : null}
          </>
        </View>
      </Box>

      {mismatch === true ? (
        <BaseButton
          marginVertical="sm"
          mt="md"
          marginHorizontal="xl"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          paddingHorizontal="md"
          paddingVertical="sm"
          borderRadius="sm"
          backgroundColor="backgroundHighlight"
          onPress={onSwitchNetworkPress}
        >
          <Text variant="bodyLarge" textAlign="center">
            Switch Network
          </Text>
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
