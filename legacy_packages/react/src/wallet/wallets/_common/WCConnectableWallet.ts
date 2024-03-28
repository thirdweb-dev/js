import { AbstractClientWallet } from "@thirdweb-dev/wallets";

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export interface WCConnectableWallet extends AbstractClientWallet {
  connectWithQrCode: (options: ConnectWithQrCodeArgs) => Promise<void>;
}
