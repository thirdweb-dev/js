import type { ThirdwebClient } from "../../../../client/client.js";
import type { StorageType, WalletStorageFormatType } from "../storage/type.js";

export type WalletStateType = "loaded" | "pending_load" | "read_only";
export type KeyGenerationSourceType = "developer" | "thirdweb";

export type WalletDetailType = {
  walletId: string;
  address: Readonly<string>;
  client: ThirdwebClient;
  userId?: string | undefined;
  walletState: WalletStateType;
  keyGenerationSource: Readonly<KeyGenerationSourceType>;
  format: WalletStorageFormatType;
  createdAt: number; // unix timestamp
};
export type SensitiveWalletDetailType = WalletDetailType & {
  keyMaterial: Readonly<string>;
};

export type CreateWalletOverrideType = () =>
  | Promise<{ address: string; privateKey: string }>
  | { address: string; privateKey: string };
export type SaveWalletArgType = {
  walletDetail: SensitiveWalletDetailType;
  storage: StorageType;
};
