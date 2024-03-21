import type { Address } from "abitype";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { WalletEventListener } from "./listeners.js";
import type { WalletMetadata } from "../types.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { Chain } from "../../chains/types.js";
import type { SendTransactionResult } from "../../transaction/types.js";

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

export type Wallet = {
  // REQUIRED
  metadata: WalletMetadata;
  connect: (options?: any) => Promise<Account>;
  autoConnect: (options?: any) => Promise<Account>;
  disconnect: () => Promise<void>;
  getAccount(): Account | undefined;
  getChain(): Chain | undefined;

  // OPTIONAL
  events?: {
    addListener: WalletEventListener;
    removeListener: WalletEventListener;
  };
  switchChain?: (newChain: Chain) => Promise<void>;
};

export interface WalletWithPersonalAccount extends Wallet {
  autoConnect: (options: { personalAccount: Account }) => Promise<Account>;
  personalAccount?: Account;
}

export type Account = {
  // REQUIRED
  address: Address;
  sendTransaction: (
    tx: SendTransactionOption,
  ) => Promise<SendTransactionResult>;
  signMessage: ({ message }: { message: SignableMessage }) => Promise<Hex>;
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;

  // OPTIONAL
  publicKey?: Hex;
  estimateGas?: (tx: PreparedTransaction) => Promise<bigint>;
  signTransaction?: (tx: TransactionSerializable) => Promise<Hex>; // TODO: Allow for custom serializers and native serialize types
  sendBatchTransaction?: (
    txs: SendTransactionOption[],
  ) => Promise<SendTransactionResult>;
};
