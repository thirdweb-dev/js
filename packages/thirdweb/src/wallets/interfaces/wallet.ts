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

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

export type WalletConnectionOptions = { chainId?: number | bigint };

export type Wallet = {
  // REQUIRED
  // can't make address undefined, it breaks assumptions
  address: Address;
  sendTransaction: (
    // TODO: figure out how we get our "chain" here
    tx: SendTransactionOption,
  ) => Promise<TransactionOrUserOpHash>;

  metadata: {
    id: string;
    name: string;
    iconUrl: string;
  };

  connect: (options?: WalletConnectionOptions) => Promise<string>;
  autoConnect: (options?: WalletConnectionOptions) => Promise<string>;
  disconnect: () => Promise<void>;

  // OPTIONAL
  chainId?: bigint;
  signMessage?: ({ message }: { message: SignableMessage }) => Promise<Hex>;
  signTypedData?: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;
  signTransaction?: (tx: TransactionSerializable) => Promise<Hex>;

  estimateGas?: <abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ) => Promise<bigint>;

  events?: {
    addListener: WalletEventListener;
    removeListener: WalletEventListener;
  };

  switchChain?: (newChainId: bigint | number) => Promise<void>;
};
