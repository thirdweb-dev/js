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
  getAccount(): Account | undefined;
  getChainId(): number | undefined;

  // OPTIONAL
  events?: {
    addListener: WalletEventListener;
    removeListener: WalletEventListener;
  };

  switchChain?: (newChainId: number) => Promise<void>;
};

export interface WalletWithPersonalWallet extends Wallet {
  autoConnect: (options: { personalWallet: Wallet }) => Promise<Account>;
  personalWallet?: Wallet;
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
  sendBatchTransaction?: (
    txs: SendTransactionOption[],
  ) => Promise<TransactionOrUserOpHash>;
};
