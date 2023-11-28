import { WalletInstance } from "@thirdweb-dev/react-core";

export const isWalletConnectReceiverEnabled = (wallet?: WalletInstance) => {
  const options = wallet?.getOptions();
  return options && "walletConnectReceiver" in options;
};
