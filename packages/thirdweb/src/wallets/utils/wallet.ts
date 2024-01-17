import type {
  Address,
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";

export interface IWallet {
  address: Address | null;
  connect: (_opts: any) => Promise<void>;
  disconnect: () => Promise<void>;
  //
  signMessage: (_message: SignableMessage) => Promise<Hex>;
  signTransaction: (_tx: TransactionSerializable) => Promise<Hex>;
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;
}
