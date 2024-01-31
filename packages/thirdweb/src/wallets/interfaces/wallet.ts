import type { Address } from "abitype";
import type { TransactionOrUserOpHash } from "../../transaction/types.js";

import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import type { AddListener, RemoveListener } from "./listeners.js";

export type Wallet = {
  // REQUIRED
  id: string;
  address?: Address | undefined;
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
  // TODO: figure out estimate gas
  estimateGas?: (
    // TODO: figure out how we get our "chain" here
    tx: TransactionSerializable & { chainId: number },
  ) => Promise<bigint>;
  addListener?: AddListener;
  removeListener?: RemoveListener;
  switchChain?: (newChainId: bigint | number) => Promise<void>;
};
