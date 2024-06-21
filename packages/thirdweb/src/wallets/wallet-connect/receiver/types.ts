import type { SignClient } from "@walletconnect/sign-client";
import type { TypedDataDefinition } from "viem";
import type { Address } from "../../../utils/address.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Account, Wallet } from "../../interfaces/wallet.js";

export type { WalletConnectConfig } from "../types.js"; // re-exporting for use in this module
export type WalletConnectSession = {
  topic: string;
  origin?: string;
};

export type WalletConnectClient = Awaited<ReturnType<typeof SignClient.init>>;

export type WalletConnectSessionProposalEvent = {
  id: number;
  params: {
    id: number;
    expiryTimestamp: number;
    relays: Array<{
      protocol: string;
      data?: string;
    }>;
    proposer: {
      publicKey: string;
      metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
      };
    };
    requiredNamespaces?: Record<
      string,
      {
        chains?: string[];
        methods: string[];
        events: string[];
      }
    >;
    optionalNamespaces?: Record<
      string,
      {
        chains?: string[];
        methods: string[];
        events: string[];
      }
    >;
    pairingTopic?: string;
  };
  verifyContext?: {
    verified?: {
      origin: string;
    };
  };
};

export type WalletConnectSessionEvent = {
  id: number;
  topic: string;
  params: {
    event: {
      name: string;
      data: unknown;
    };
    chainId: string;
  };
};

export type WalletConnectRequestHandlers = Prettify<
  {
    personal_sign?: (_: {
      account: Account;
      params: WalletConnectSignRequestPrams;
    }) => Promise<Hex | WalletConnectRequestError>;
    eth_sign?: (_: {
      account: Account;
      params: WalletConnectSignRequestPrams;
    }) => Promise<Hex | WalletConnectRequestError>;
    eth_signTypedData?: (_: {
      account: Account;
      params: WalletConnectSignTypedDataRequestParams;
    }) => Promise<Hex | WalletConnectRequestError>;
    eth_signTypedData_v4?: (_: {
      account: Account;
      params: WalletConnectSignTypedDataRequestParams;
    }) => Promise<Hex | WalletConnectRequestError>;
    eth_signTransaction?: (_: {
      account: Account;
      params: WalletConnectTransactionRequestParams;
    }) => Promise<Hex | WalletConnectRequestError>;
    eth_sendRawTransaction?: (_: {
      account: Account;
      chainId: number;
      params: WalletConnectRawTransactionRequestParams;
    }) => Promise<Hex | WalletConnectRequestError>;
    eth_sendTransaction?: (_: {
      account: Account;
      chainId: number;
      params: WalletConnectTransactionRequestParams;
    }) => Promise<Hex | WalletConnectRequestError>;
    wallet_addEthereumChain?: (_: {
      wallet: Wallet;
      params: WalletConnectAddEthereumChainRequestParams;
    }) => Promise<Hex>;
    wallet_switchEthereumChain?: (_: {
      wallet: Wallet;
      params: WalletConnectSwitchEthereumChainRequestParams;
    }) => Promise<Hex>;
  } & {
    [code: string]: (_: {
      account: Account;
      chainId: number;
      params: unknown[];
    }) => Promise<Hex | WalletConnectRequestError>;
  }
>;

export type WalletConnectRequestError = {
  code: number;
  message: string;
};

type WalletConnectRequestParams =
  | WalletConnectSignRequestPrams
  | WalletConnectSignTypedDataRequestParams
  | WalletConnectTransactionRequestParams
  | WalletConnectRawTransactionRequestParams
  | WalletConnectAddEthereumChainRequestParams
  | WalletConnectSwitchEthereumChainRequestParams;

export type WalletConnectSessionRequestEvent = {
  id: number;
  topic: string;
  params: {
    request: {
      method: string;
      params: WalletConnectRequestParams;
    };
    chainId: string;
  };
};

// Request param types
export type WalletConnectSignRequestPrams = [string, Address];
export type WalletConnectSignTypedDataRequestParams = [
  Address,
  TypedDataDefinition | string,
];
export type WalletConnectTransactionRequestParams = [
  {
    from?: Address;
    to?: Address;
    data?: Hex;
    gas?: Hex;
    gasPrice?: Hex;
    value?: Hex;
    nonce?: Hex;
  },
];
export type WalletConnectRawTransactionRequestParams = [Hex];

export type WalletConnectAddEthereumChainRequestParams = {
  chainId: string;
  blockExplorerUrls: string[];
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
}[];

export type WalletConnectSwitchEthereumChainRequestParams = [{ chainId: Hex }];
