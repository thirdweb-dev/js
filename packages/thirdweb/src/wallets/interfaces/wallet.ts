import type { Transaction } from "../../transaction/index.js";
import type {
  AbiFunction,
  Address,
  Hex,
  SignableMessage,
  TransactionReceipt,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";

export interface IWallet {
  address: Address | null;
  connect: (_opts: any) => Promise<IWallet>;
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
  ) => Promise<{
    transactionHash: Hex;
    wait: () => Promise<TransactionReceipt>;
  }>;
  estimateGas: <abiFn extends AbiFunction>(
    _tx: Transaction<abiFn>,
  ) => Promise<bigint>;
}
