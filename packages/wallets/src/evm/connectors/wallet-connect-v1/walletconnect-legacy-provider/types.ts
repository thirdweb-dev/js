import {
  IWCEthRpcConnectionOptions,
  IWalletConnectSession,
} from "@walletconnect/legacy-types";

export type IWCEthRpcConnectionOptionsWithSession =
  IWCEthRpcConnectionOptions & { session?: IWalletConnectSession };
