import { WalletInstance } from "@thirdweb-dev/react-core";
import { IWalletConnectReceiver } from "@thirdweb-dev/wallets";

export const isWalletConnectReceiver = (wallet?: WalletInstance) => {
  return wallet && "isWCReceiverEnabled" in wallet;
};

export const isWalletConnectReceiverEnabled = (wallet?: WalletInstance) => {
  return (
    isWalletConnectReceiver(wallet) &&
    (wallet as unknown as IWalletConnectReceiver).isWCReceiverEnabled()
  );
};
