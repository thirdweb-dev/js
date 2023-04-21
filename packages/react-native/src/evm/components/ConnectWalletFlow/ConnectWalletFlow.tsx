import BaseButton from "../base/BaseButton";
import Text from "../base/Text";
import { TWModal } from "../base/modal/TWModal";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import {
  Wallet,
  useConnect,
  useThirdwebWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { LocalWalletFlow } from "./LocalWalletFlow";
import { LocalWallet, localWallet } from "../../wallets/wallets/local-wallet";

export const ConnectWalletFlow = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const guestMode = useThirdwebWallet()?.guestMode;
  const removedGuestWalletRef = useRef(false);

  const connect = useConnect();
  const supportedWallets = useWallets();

  const wallets = useMemo(() => {
    if (
      guestMode &&
      supportedWallets[supportedWallets.length - 1].id === LocalWallet.id &&
      !removedGuestWalletRef.current
    ) {
      removedGuestWalletRef.current = true;
      return supportedWallets.slice(0, supportedWallets.length - 1);
    }

    return supportedWallets;
  }, [guestMode, supportedWallets]);

  const onConnectPress = () => {
    if (supportedWallets.length === 1) {
      onChooseWallet(supportedWallets[0]);
    }

    setModalVisible(true);
  };

  const onClose = () => {
    setModalVisible(false);
    setActiveWallet(undefined);
  };

  const connectActiveWallet = async (wallet: Wallet) => {
    setIsConnecting(true);
    connect(wallet, {}).catch((error) => {
      console.error("Error connecting to the wallet", error);
      onBackPress();
    });
  };

  const onJoinAsGuestPress = () => {
    connectActiveWallet(localWallet());
  };

  const onChooseWallet = (wallet: Wallet) => {
    setActiveWallet(() => wallet);

    if (wallet.id !== LocalWallet.id) {
      connectActiveWallet(wallet);
    }
  };

  const onBackPress = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  function getComponentForWallet(activeWalletP: Wallet) {
    switch (activeWalletP.id) {
      case LocalWallet.id:
        return (
          <LocalWalletFlow
            onClose={onClose}
            onBackPress={onBackPress}
            onConnectPress={() => connectActiveWallet(activeWalletP)}
          />
        );
    }
  }

  return (
    <>
      <TWModal isVisible={modalVisible}>
        {activeWallet ? (
          isConnecting ? (
            <ConnectingWallet
              content={
                activeWallet.id === LocalWallet.id ? (
                  <Text variant="bodySmallSecondary" mt="md">
                    Creating, encrypting and securing your device wallet.
                  </Text>
                ) : undefined
              }
              wallet={activeWallet}
              onClose={onClose}
              onBackPress={onBackPress}
            />
          ) : (
            getComponentForWallet(activeWallet)
          )
        ) : (
          <ChooseWallet
            wallets={wallets}
            onChooseWallet={onChooseWallet}
            onJoinAsGuestPress={onJoinAsGuestPress}
            onClose={onClose}
          />
        )}
      </TWModal>

      <BaseButton
        backgroundColor="buttonBackgroundColor"
        onPress={onConnectPress}
        style={styles.connectWalletButton}
      >
        <Text variant="bodyLarge" color="buttonTextColor">
          Connect Wallet
        </Text>
      </BaseButton>
    </>
  );
};

const styles = StyleSheet.create({
  connectWalletButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
