import type { Address } from "../../utils/address.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { OneOf } from "../../utils/type-utils.js";

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

export type GetCallsStatusResponse = {
  status: "PENDING" | "CONFIRMED";
  receipts: WalletCallReceipt<bigint, "success" | "reverted">[];
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
