import type { DAppMetaData, WalletMetadata } from "../types.js";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import type { ThirdwebClient } from "../../client/client.js";

type EthereumProviderOptions = Parameters<(typeof EthereumProvider)["init"]>[0];

type QRCodeModalOptions = Pick<
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
  chainId?: number | bigint;
  showQrModal?: boolean;
  pairingTopic?: string;
  qrModalOptions?: QRCodeModalOptions;
  onDisplayUri?: (uri: string) => void;
  onSessionRequestSent?: () => void;
};
