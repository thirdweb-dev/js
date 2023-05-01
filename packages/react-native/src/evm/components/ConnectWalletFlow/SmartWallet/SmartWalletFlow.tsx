import { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  WalletInstance,
  useConnect,
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { SmartWalletObj } from "../../../wallets/wallets/smart-wallet";
import {
  LocalWallet,
  localWallet,
} from "../../../wallets/wallets/local-wallet";
import { ChooseWallet } from "../ChooseWallet/ChooseWallet";
import { LocalWalletFlow } from "../LocalWalletFlow";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ActivityIndicator } from "react-native";
import { useTheme } from "@shopify/restyle";
import BaseButton from "../../base/BaseButton";
import Text from "../../base/Text";

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
  const theme = useTheme();
  const createWalletInstance = useCreateWalletInstance();
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const connect = useConnect();
  const targetChain = useThirdwebWallet().activeChain;

  const mismatch = personalWalletChainId
    ? personalWalletChainId !== targetChain.chainId
    : false;

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
      if (mismatch) {
        // TODO: Add network switching logic
        // connectSmartWallet(connectedPersonalWallet);
      } else {
        connectSmartWallet(connectedPersonalWallet);
      }
    }
  }, [connectSmartWallet, connectedPersonalWallet, mismatch]);

  const connectPersonalWallet = useCallback(
    async (wallet: Wallet) => {
      setIsConnecting(true);
      const walletInstance = createWalletInstance(wallet);
      await walletInstance.connect();

      setConnectedPersonalWallet(walletInstance);
    },
    [createWalletInstance],
  );

  const onLocalWalletImported = async (localWalletImported: LocalWallet) => {
    setIsConnecting(true);
    await localWalletImported.connect();

    connectSmartWallet(localWalletImported);
  };

  const onChoosePersonalWallet = useCallback(
    async (wallet: Wallet) => {
      if (wallet.id === LocalWallet.id) {
        setShowLocalWalletFlow(true);
      } else {
        connectPersonalWallet(wallet);
      }
    },
    [connectPersonalWallet],
  );

  const onLocalWalletBackPress = () => {
    setShowLocalWalletFlow(false);
    reset();
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
            gap="md"
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
        onClose={onClose}
        onBackPress={onLocalWalletBackPress}
        onWalletImported={onLocalWalletImported}
        onConnectPress={() => connectPersonalWallet(localWallet())}
      />
    );
  }

  return (
    <ChooseWallet
      headerText={"Smart wallet"}
      subHeaderText={"Select a personal wallet to connect to your smart wallet"}
      wallets={walletObj.config.personalWallets}
      onChooseWallet={onChoosePersonalWallet}
      onClose={onClose}
    />
  );
};
