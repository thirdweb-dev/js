import type { Address } from "../../utils/address.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { OneOf, Prettify } from "../../utils/type-utils.js";

export type WalletCapabilities = {
  [capability: string]: unknown;
};

export type WalletCapabilitiesRecord<
  capabilities extends WalletCapabilities,
  id extends string | number = Hex,
> = {
  [chain in id]: capabilities;
} & {
  message?: string;
};

export type WalletSendCallsParameters<
  capabilities extends WalletCapabilities = WalletCapabilities,
  chainId extends Hex | number = Hex,
> = [
  {
    from: Address;
    calls: EIP5792Call[];
    capabilities?: capabilities | undefined;
    version: string;
    chainId: chainId;
    atomicRequired: boolean;
  },
];

export type WalletSendCallsId = string;

export type EIP5792Call = OneOf<
  | {
      to: Hex;
      data?: Hex | undefined;
      value?: Hex | undefined;
    }
  | {
      data: Hex; // Contract creation case
    }
>;

type WalletGetCallsStatusReturnType<
  numberType = Hex,
  bigintType = Hex,
  receiptStatus = Hex,
> = Prettify<{
  atomic: boolean;
  chainId: numberType;
  id: string;
  receipts?: WalletCallReceipt<bigintType, receiptStatus>[] | undefined;
  status: number;
  version: string;
}>;

export type GetCallsStatusResponse = Prettify<
  Omit<
    WalletGetCallsStatusReturnType<number, bigint, "success" | "reverted">,
    "status"
  > & {
    statusCode: number;
    status: "pending" | "success" | "failure" | undefined;
  }
>;

export type GetCallsStatusRawResponse = {
  version: string;
  id: `0x${string}`;
  chainId: `0x${string}`;
  status: number; // See "Status Codes"
  atomic: boolean;
  receipts?: {
    logs: {
      address: `0x${string}`;
      data: `0x${string}`;
      topics: `0x${string}`[];
    }[];
    status: `0x${string}`; // Hex 1 or 0 for success or failure, respectively
    blockHash: `0x${string}`;
    blockNumber: `0x${string}`;
    gasUsed: `0x${string}`;
    transactionHash: `0x${string}`;
  }[];
  capabilities?: Record<string, unknown>;
};

export type WalletCallReceipt<quantity = Hex, status = Hex> = {
  logs: {
    address: string;
    data: Hex;
    topics: Hex[];
  }[];
  status: status;
  blockHash: Hex;
  blockNumber: quantity;
  gasUsed: quantity;
  transactionHash: Hex;
};
