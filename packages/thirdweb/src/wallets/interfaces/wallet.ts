import type { AbiFunction, Address } from "abitype";
import type { TransactionOrUserOpHash } from "../../transaction/types.js";
import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { AddListener, RemoveListener } from "./listeners.js";
import type { Transaction } from "../../transaction/transaction.js";

export type Wallet = {
  // REQUIRED
  id: string;
  // can't make address undefined, it breaks assumptions
  address: Address;
  sendTransaction: (
    // TODO: figure out how we get our "chain" here
    tx: TransactionSerializable & { chainId: number },
  ) => Promise<TransactionOrUserOpHash>;

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
  addListener?: AddListener;
  removeListener?: RemoveListener;
  switchChain?: (newChainId: bigint | number) => Promise<void>;
};
