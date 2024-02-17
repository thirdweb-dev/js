import type { DAppMetaData, WalletMetadata } from "../types.js";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import type { ThirdwebClient } from "../../client/client.js";

type EthereumProviderOptions = Parameters<(typeof EthereumProvider)["init"]>[0];

type WalletConnectQRCodeModalOptions = Pick<
  NonNullable<EthereumProviderOptions["qrModalOptions"]>,
  | "themeMode"
  | "themeVariables"
  | "desktopWallets"
  | "enableExplorer"
  | "explorerRecommendedWalletIds"
  | "explorerExcludedWalletIds"
  | "mobileWallets"
  | "privacyPolicyUrl"
  | "termsOfServiceUrl"
  | "walletImages"
>;

export type WalletConnectCreationOptions = {
  metadata?: WalletMetadata;
  client: ThirdwebClient;
  projectId?: string;
  dappMetadata?: DAppMetaData;
};

export type WalletConnectConnectionOptions = {
  chainId?: number;
  optionalChains?: number[];
  showQrModal?: boolean;
  pairingTopic?: string;
  qrModalOptions?: WalletConnectQRCodeModalOptions;
  onDisplayUri?: (uri: string) => void;
  onSessionRequestSent?: () => void;
};
