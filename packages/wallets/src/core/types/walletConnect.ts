import { IWeb3Wallet } from "@walletconnect/web3wallet";

export type WalletConnectMetadata = IWeb3Wallet["metadata"];

// connect dapp support through wcv2 protocol
export type WalletConnectReceiverConfig = {
  enableConnectApp?: boolean;
  walletConnectV2Metadata?: WalletConnectMetadata;
  walletConenctV2ProjectId?: string;
  walletConnectV2RelayUrl?: string;
};
