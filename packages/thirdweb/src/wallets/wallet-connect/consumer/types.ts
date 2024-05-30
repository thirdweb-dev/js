import type { TypedDataDefinition } from "viem";
import type { Address } from "../../../utils/address.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { WalletConnectMetadata } from "../types.js";

export type { WalletConnectConfig } from "../types.js"; // re-exporting for use in this module
export type WalletConnectSession = {
  topic: string;
  pairingTopic: string;
  relay: {
    protocol: string;
    data?: string | undefined;
  };
  self: {
    publicKey: string;
    metadata: WalletConnectMetadata;
  };
  peer: {
    publicKey: string;
    metadata: WalletConnectMetadata;
  };
  expiry: number; // timestamp (seconds)
  acknowledged: boolean;
  controller: string;
  namespaces: Record<
    string,
    {
      chains?: string[];
      accounts: string[];
      methods: string[];
      events: string[];
    }
  >;
  requiredNamespaces: Record<
    string,
    {
      chains?: string[];
      methods: string[];
      events: string[];
    }
  >;
  optionalNamespaces: Record<
    string,
    {
      chains?: string[];
      methods: string[];
      events: string[];
    }
  >;
};

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
    requiredNamespaces: Record<
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

export type WalletConnectSessionRequestEvent = {
  id: number;
  topic: string;
  params: {
    request: {
      method: string;
      params:
        | WalletConnectSignRequestPrams
        | WalletConnectSignTypedDataRequestParams
        | WalletConnectTransactionRequestParams
        | WalletConnectRawTransactionRequestParams;
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
