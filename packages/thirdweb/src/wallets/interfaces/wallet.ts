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
import type { Chain } from "../../chains/index.js";

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
  estimateGas?: (tx: PreparedTransaction) => Promise<bigint>;
  switchChain?: (newChainId: Chain) => Promise<void>;
};

export interface WalletWithPersonalWallet extends Wallet {
  autoConnect: (options: { personalWallet: Wallet }) => Promise<Account>;
  personalWallet?: Wallet;
}

export type Account = {
  // REQUIRED
  address: Address;
  sendTransaction: (
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
  sendBatchTransaction?: (
    txs: SendTransactionOption[],
  ) => Promise<TransactionOrUserOpHash>;
};
