// UNCHANGED
const WalletTypeObj = {
  Preset: "Preset",
  MetaMask: "metaMask",
  CoinbaseWallet: "coinbaseWallet",
  WalletConnect: "walletConnect",
  Phantom: "Phantom",
} as const;

export type WalletType = (typeof WalletTypeObj)[keyof typeof WalletTypeObj];

export interface ConnectWalletProps {
  onWalletConnected: onWalletConnectedType;
  onWalletConnectFail: onWalletConnectFailType;
}

export type onWalletConnectFailType = (props: {
  walletType: typeof WalletTypeObj;
  currentUserWalletType: typeof WalletTypeObj;
  error: Error;
}) => void;
export type onWalletConnectedType = (props: {
  userAddress: string;
  chainId: number;
}) => void;
