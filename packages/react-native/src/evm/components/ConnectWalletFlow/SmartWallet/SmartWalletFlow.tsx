import { useCallback, useEffect, useState } from "react";
import {
  WalletConfig,
  WalletInstance,
  useConnect,
  useCreateWalletInstance,
  useSupportedWallet,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import { SmartWalletObj } from "../../../wallets/wallets/smart-wallet";
import { localWallet } from "../../../wallets/wallets/local-wallet";
import { ChooseWallet } from "../ChooseWallet/ChooseWallet";
import { LocalWalletFlow } from "../LocalWalletFlow";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ActivityIndicator, Linking, useColorScheme } from "react-native";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";
import { walletIds } from "@thirdweb-dev/wallets";
import { useAppTheme } from "../../../styles/hooks";
import { DEFAULT_WALLETS } from "../../../constants/wallets";

export const SmartWalletFlow = ({
  onClose,
  onConnect,
}: {
  onClose: () => void;
  onConnect: () => void;
}) => {
  const [showLocalWalletFlow, setShowLocalWalletFlow] = useState<boolean>();
  const [connectedPersonalWallet, setConnectedPersonalWallet] =
    useState<WalletInstance>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [personalWalletChainId, setPersonalWalletChaindId] = useState<
    number | undefined
  >();
  const theme = useAppTheme();
  const createWalletInstance = useCreateWalletInstance();
  const walletObj = useSupportedWallet(walletIds.smartWallet) as SmartWalletObj;
  const connect = useConnect();
  const targetChain = useWalletContext().activeChain;
  const colorScheme = useColorScheme();
  const supportedWallets = useWallets();

  const mismatch = personalWalletChainId
    ? personalWalletChainId !== targetChain.chainId
    : false;

  const connectPersonalWallet = useCallback(
    async (wallet: WalletConfig) => {
      setIsConnecting(true);
      const walletInstance = createWalletInstance(wallet);
      await walletInstance.connect();

      setConnectedPersonalWallet(walletInstance);
    },
    [createWalletInstance],
  );

  const onChoosePersonalWallet = useCallback(
    async (wallet: WalletConfig) => {
      // if (wallet.id === LocalWallet.id) {
      //   setShowLocalWalletFlow(true);
      // } else {
      connectPersonalWallet(wallet);
      // }
    },
    [connectPersonalWallet],
  );

  useEffect(() => {
    if (walletObj.personalWallets?.length === 1) {
      onChoosePersonalWallet(walletObj.personalWallets[0]);
    }
  }, [onChoosePersonalWallet, walletObj.personalWallets]);

  useEffect(() => {
    (async () => {
      if (connectedPersonalWallet) {
        const chainId = await connectedPersonalWallet.getChainId();
        setPersonalWalletChaindId(chainId);
      }
    })();
  }, [connectedPersonalWallet]);

  const connectSmartWallet = useCallback(
    async (personalWallet: WalletInstance) => {
      if (!mismatch && personalWalletChainId) {
        await connect(walletObj, {
          personalWallet: personalWallet,
        });
        onConnect();
      }
    },
    [connect, mismatch, onConnect, personalWalletChainId, walletObj],
  );

  useEffect(() => {
    if (connectedPersonalWallet) {
      if (!mismatch) {
        connectSmartWallet(connectedPersonalWallet);
      }
    }
  }, [connectSmartWallet, connectedPersonalWallet, mismatch]);

  const onConnectedLocalWallet = async (wallet: WalletInstance) => {
    setIsConnecting(true);

    connectSmartWallet(wallet);
  };

  const onLocalWalletBackPress = () => {
    setShowLocalWalletFlow(false);
  };

  const onConnectingClosePress = () => {
    connectedPersonalWallet?.disconnect();
    reset();
  };

  const onSwitchNetworkPress = async () => {
    await connectedPersonalWallet?.switchChain(targetChain.chainId);
    setPersonalWalletChaindId(targetChain.chainId);
  };

  const reset = () => {
    setIsConnecting(false);
    setConnectedPersonalWallet(undefined);
    setPersonalWalletChaindId(undefined);
  };

  const onLearnMorePress = () => {
    Linking.openURL("https://portal.thirdweb.com/wallet/smart-wallet");
  };

  if (isConnecting) {
    return (
      <>
        <ModalHeaderTextClose
          onClose={onConnectingClosePress}
          headerText={mismatch ? "Network Mismatch" : "Connecting smart wallet"}
          subHeaderText={
            mismatch
              ? "There's a network mismatch between your contract and your wallet"
              : ""
          }
        />

        {mismatch ? null : (
          <ActivityIndicator size="large" color={theme.colors.linkPrimary} />
        )}

        {mismatch === true ? (
          <BaseButton
            marginVertical="sm"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            paddingHorizontal="md"
            paddingVertical="sm"
            borderRadius="sm"
            backgroundColor="backgroundHighlight"
            onPress={onSwitchNetworkPress}
          >
            <Text variant="bodyLarge">Switch Network</Text>
          </BaseButton>
        ) : null}
      </>
    );
  }

  if (showLocalWalletFlow) {
    return (
      <LocalWalletFlow
        modalSize="compact"
        theme={colorScheme || "dark"}
        close={onClose}
        goBack={onLocalWalletBackPress}
        onConnected={onConnectedLocalWallet}
        isOpen={false}
        open={() => {}}
        walletConfig={localWallet()}
        selectionData={undefined} // TODO
        setSelectionData={() => {}} // TODO
        supportedWallets={supportedWallets} // TODO - pass personal wallets instead
      />
    );
  }

  return (
    <ChooseWallet
      headerText={"Link key"}
      subHeaderText={
        <Text variant="subHeader">
          {
            "Choose a personal wallet that acts as your account's key. This controls access to your account. "
          }
          <Text
            variant="subHeader"
            color="linkPrimary"
            onPress={onLearnMorePress}
          >
            Learn more.
          </Text>
        </Text>
      }
      wallets={walletObj.personalWallets || DEFAULT_WALLETS}
      onChooseWallet={onChoosePersonalWallet}
      onClose={onClose}
    />
  );
};
