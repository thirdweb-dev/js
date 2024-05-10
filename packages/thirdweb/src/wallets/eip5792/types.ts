import type { Hex } from "../../utils/encoding/hex.js";

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
