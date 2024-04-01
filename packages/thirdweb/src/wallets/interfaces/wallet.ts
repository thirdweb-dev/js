import type { Address } from "abitype";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { SendTransactionResult } from "../../transaction/types.js";
import type { Chain } from "../../chains/types.js";
import type {
  CreateWalletArgs,
  WalletAutoConnectionOption,
  WalletConnectionOption,
  WalletId,
} from "../wallet-types.js";
import type { WalletEmitter } from "../wallet-emitter.js";

// TODO: add generic ID on wallet class, creation options, connect options etc

export type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

/**
 * Wallet interface
 */
export type Wallet<TWalletId extends WalletId = WalletId> = {
  id: TWalletId;
  getChain(): Chain | undefined;
  getAccount(): Account | undefined;
  // connection management methods
  autoConnect(options: WalletAutoConnectionOption<TWalletId>): Promise<Account>;
  connect(options: WalletConnectionOption<TWalletId>): Promise<Account>;
  disconnect(): Promise<void>;
  // chain management methods
  switchChain(chain: Chain): Promise<void>;
  // events
  subscribe: WalletEmitter<TWalletId>["subscribe"];

  getConfig: () => CreateWalletArgs<TWalletId>[1];
};

// Symbols to track account origins internally for downstream adapters
// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
export const accountKeySymbol: unique symbol = Symbol("key");
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
  estimateGas?: (tx: PreparedTransaction) => Promise<bigint>;
  signTransaction?: (tx: TransactionSerializable) => Promise<Hex>;
  sendBatchTransaction?: (
    txs: SendTransactionOption[],
  ) => Promise<SendTransactionResult>;
} & (
  | {
      // if a private key account, signTransaction will be defined and an accountKeySymbol assigned
      signTransaction: (tx: TransactionSerializable) => Promise<Hex>;
      [accountKeySymbol]: Hex;
    }
  | {
      [accountKeySymbol]?: never;
    }
);
