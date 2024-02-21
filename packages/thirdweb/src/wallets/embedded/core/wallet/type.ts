import type { ThirdwebClient } from "../../../../client/client.js";
import type { WalletStorageFormatType } from "../storage/type.js";

export type WalletStateType = "loaded" | "pending_load" | "read_only";
export type KeyGenerationSourceType = "developer" | "thirdweb";

export type AccountDetailType = {
  accountId: string;
  address: Readonly<string>;
  client: ThirdwebClient;
  userId?: string | undefined;
  walletState: WalletStateType;
  keyGenerationSource: Readonly<KeyGenerationSourceType>;
  format: WalletStorageFormatType;
  createdAt: number; // unix timestamp
};
export type SensitiveAccountDetailType = AccountDetailType & {
  keyMaterial: Readonly<string>;
};

export type CreateAccountOverrideType = () =>
  | Promise<{ address: string; privateKey: string }>
  | { address: string; privateKey: string };
