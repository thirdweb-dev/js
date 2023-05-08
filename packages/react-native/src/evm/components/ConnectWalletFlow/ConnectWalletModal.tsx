import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { useIsConnectModalVisible } from "../../providers/context-provider";
import { TWModal } from "../base/modal/TWModal";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletFlow } from "./SmartWallet/SmartWalletFlow";

type ConnectWalletModalProps = {};

export const ConnectWalletModal = (props: ConnectWalletModalProps) => {
  const { isConnectModalVisible, setIsConnectModalVisible } =
    useIsConnectModalVisible();

  const reset = () => {
    setIsConnectModalVisible(false);
  };

  const close = () => {
    reset();
  };

  const goBack = () => {
    reset();
  };

  function getComponentForWallet(activeWalletP: ConfiguredWallet) {
    switch (activeWalletP.id) {
      // case LocalWallet.id:
      //   return (
      //     <LocalWalletFlow
      //       onClose={onClose}
      //       onBackPress={supportedWallets.length > 1 ? onBackPress : undefined}
      //       onWalletImported={onLocalWalletImported}
      //       onConnectPress={() => connectActiveWallet(activeWalletP)}
      //     />
      //   );
      case SmartWallet.id:
        return <SmartWalletFlow onClose={close} onConnect={goBack} />;
    }

    if (activeWalletP.connectUI) {
      return <activeWalletP.connectUI goBack={onBackPress} close={onClose} />;
    }
  }

  return (
    <TWModal isVisible={isConnectModalVisible}>
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
          wallets={supportedWallets}
          onChooseWallet={onChooseWallet}
          onClose={onClose}
        />
      )}
    </TWModal>
  );
};
