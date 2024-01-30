import type { Address } from "abitype";

import type {
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";

export interface IWallet {
  // REQUIRED
  address: Address;
  sendTransaction: (
    tx: TransactionSerializable & { chainId: number },
  ) => Promise<Hex>;

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
}
