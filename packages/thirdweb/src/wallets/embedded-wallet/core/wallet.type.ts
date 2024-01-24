import type { ThirdwebClient } from "src/client/client.js";
import type { WalletStorageFormatType } from "./storage.type.js";

export type WalletStateType = "loaded" | "pending_load" | "read_only";
export type KeyGenerationSourceType = "developer" | "thirdweb";

export type WalletDetailType = {
  walletId: string;
  address: string;
  client: ThirdwebClient;
  userId?: string;
  walletState: WalletStateType;
  keyGenerationSource: KeyGenerationSourceType;
  format: WalletStorageFormatType;
  createdAt: number; // unix timestamp
};
