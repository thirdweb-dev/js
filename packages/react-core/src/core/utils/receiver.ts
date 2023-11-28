import { WalletInstance } from "../types/wallet";

export const isWalletConnectReceiverEnabled = (wallet?: WalletInstance) => {
  const options = wallet?.getOptions();
  return (
    options &&
    "walletConnectReceiver" in options &&
    options.walletConnectReceiver
  );
};
