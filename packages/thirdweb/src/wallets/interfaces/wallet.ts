import type { Address } from "abitype";
import type { TransactionOrUserOpHash } from "../../transaction/types.js";

import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";

export type Wallet<T extends object = object> = {
  // REQUIRED
  address: Address;
  sendTransaction: (
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
  // TODO: figure out estimate gas
  estimateGas?: (
    tx: TransactionSerializable & { chainId: number },
  ) => Promise<bigint>;
  id: string;
} & T;
