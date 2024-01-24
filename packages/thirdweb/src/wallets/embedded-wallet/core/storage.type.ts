import type { ThirdwebClient } from "../../../client/client.js";
import type { AuthUserType } from "./authentication.type.js";
import type { WalletDetailType } from "./wallet.type.js";

export type WalletStorageFormatType = "privateKey" | "sharded";
export type EncryptionType = (arg: {
  value: string;
}) => Promise<string> | string;
export type SaveKeyValueType = (args: {
  key: string;
  value: string;
}) => Promise<void> | void;
export type LoadKeyValueType = (args: {
  key: string;
}) => Promise<string> | string;

/**
 * @param uniqueId - the unique id associated with the keyMaterial
 * @param keyMaterial - the sensitive value to be save. This can either be a private key or a share
 */
export type SaveKeyType = (args: {
  walletDetail: WalletDetailType;
  uniqueId: string;
  keyMaterial: string;
  authUser?: AuthUserType | undefined;
}) => Promise<void> | void;

export type LoadKeyType = (args: {
  uniqueId: string;
  walletDetail: WalletDetailType;
  authUser?: AuthUserType | undefined;
}) => Promise<string> | string;

export type SaveLoadKeyType = {
  save: SaveKeyType;
  load: LoadKeyType;
};

/**
 * The interface for the storage of a wallet
 */
export type StorageType =
  | ({
      format: "privateKey";
      client: ThirdwebClient;
      authUser?: AuthUserType | undefined;
    } & SaveLoadKeyType)
  | {
      format: "sharded";
      client: ThirdwebClient;
      authUser?: AuthUserType | undefined;
      shareA: SaveLoadKeyType;
      shareB: SaveLoadKeyType;
      shareC: SaveLoadKeyType;
    };
