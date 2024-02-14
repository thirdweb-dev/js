import type { Address } from "abitype";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { WalletEventListener } from "./listeners.js";
import type { TransactionOrUserOpHash } from "../../transaction/types.js";
import type { WalletMetadata } from "../types.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

export type Wallet = {
  // REQUIRED
  metadata: WalletMetadata;
  connect: (options?: any) => Promise<Account>;
  autoConnect: (options?: any) => Promise<Account>;
  disconnect: () => Promise<void>;

  // OPTIONAL
  chainId?: bigint;

  events?: {
    addListener: WalletEventListener;
    removeListener: WalletEventListener;
  };

  switchChain?: (newChainId: bigint | number) => Promise<void>;
};

export interface WalletWithPersonalAccount extends Wallet {
  autoConnect: (options: { personalAccount: Account }) => Promise<Account>;
  personalAccount?: Account;
}

export type Account = {
  // REQUIRED
  address: Address;
  sendTransaction: (
    // TODO: figure out how we get our "chain" here
    tx: SendTransactionOption,
  ) => Promise<TransactionOrUserOpHash>;
  signMessage: ({ message }: { message: SignableMessage }) => Promise<Hex>;
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;

  // OPTIONAL
  signTransaction?: (tx: TransactionSerializable) => Promise<Hex>;
  estimateGas?: (tx: PreparedTransaction) => Promise<bigint>;

  // TODO: figure out a path to remove this (or reduce it to the minimum possible interface)
  /**
   * The wallet that the account belongs to
   */
  wallet: Wallet;
};
