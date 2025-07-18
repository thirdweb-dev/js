import type { Address } from "../../utils/address.js";
import type { Hex } from "../../utils/encoding/hex.js";

export type TransactionRequest = {
  contractAddress: Address;
  method: `function ${string}`;
  params: Array<(string | bigint | number | boolean | object)>;
  value?: bigint;
} | {
  to: Address;
  data: Hex;
  value?: bigint;
} | {
  to: Address;
  value: bigint;
}

export type Transaction = {
  id: string;
  transactionHash: Hex;
  from: Address;
  chainId: string;
  createdAt: string;
  confirmedAt?: string;
  confirmedAtBlockNumber?: string;
  cancelledAt?: string;
  errorMessage: string | null;
}

