import type { Address } from "abitype";
import type { Transaction } from "../../transaction/transaction.js";
import type {
  AbiFunction,
  Hex,
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";

export interface IWallet<connectOpts> {
  address: Address | null;
  connect:
    | ((opts: connectOpts) => Promise<IWallet<connectOpts>>)
    | ((opts?: connectOpts) => Promise<IWallet<connectOpts>>);
  disconnect: () => Promise<void>;
  //
  signMessage?: (_message: SignableMessage) => Promise<Hex>;
  signTransaction?: (_tx: TransactionSerializable) => Promise<Hex>;
  signTypedData?: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(
    _typedData: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hex>;

  // TX methods
  sendTransaction: <abiFn extends AbiFunction>(
    _tx: Transaction<abiFn>,
  ) => Promise<Hex>;
}
