import type { AbiFunction, Address } from "abitype";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { WalletEventListener } from "./listeners.js";
import type { TransactionOrUserOpHash } from "../../transaction/types.js";
import type { Transaction } from "../../transaction/transaction.js";
import type { WalletMetadata } from "../types.js";

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

export type WalletConnectionOptions = { chainId?: number | bigint };

export type Wallet = {
  // REQUIRED
  metadata: WalletMetadata;
  connect: (options?: WalletConnectionOptions) => Promise<Account>;
  autoConnect: () => Promise<Account>;
  disconnect: () => Promise<void>;

  // OPTIONAL
  chainId?: bigint;
  estimateGas?: <abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ) => Promise<bigint>;

  events?: {
    addListener: WalletEventListener;
    removeListener: WalletEventListener;
  };

  switchChain?: (newChainId: bigint | number) => Promise<void>;
};

export type Account = {
  // REQUIRED
  address: Address;
  sendTransaction: (
    // TODO: figure out how we get our "chain" here
    tx: SendTransactionOption,
  ) => Promise<TransactionOrUserOpHash>;

  // OPTIONAL
  signMessage?: ({ message }: { message: SignableMessage }) => Promise<Hex>;
  signTypedData?: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;
  signTransaction?: (tx: TransactionSerializable) => Promise<Hex>;

  // TODO: figure out a path to remove this (or reduce it to the minimum possible interface)
  /**
   * The wallet that the account belongs to
   * @internal
   */
  wallet: Wallet;
};
